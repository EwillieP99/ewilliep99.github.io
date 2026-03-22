import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ECHO_KNOWLEDGE } from "../src/data/echoKnowledge";

const CORE_PROMPT = `You are Echo, the AI assistant on Ethan Pecora's portfolio.

Style:
- Concise, practical, and recruiter-friendly by default.
- Use bullet points for structured answers.
- Keep under 120 words unless user explicitly asks for detail.

Rules:
- Only claim facts grounded in provided knowledge or user input.
- If uncertain, say "I do not have enough verified detail on that."
- Do not invent metrics, roles, dates, or technologies.
- Prioritize outcomes, evidence, and next steps.

Helpful behaviors:
- For recruiter prompts, include fit summary + evidence.
- For networking prompts, draft concise outreach copy.
- For project prompts, explain business value and implementation depth.`;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const requestLog = new Map<string, number[]>();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getClientIp(req: VercelRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (value?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown").toString();
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const existing = requestLog.get(clientKey) ?? [];
  const withinWindow = existing.filter((ts) => now - ts < RATE_WINDOW_MS);
  withinWindow.push(now);
  requestLog.set(clientKey, withinWindow);
  return withinWindow.length > RATE_LIMIT;
}

function buildSystemPrompt() {
  return `${CORE_PROMPT}\n\nKNOWLEDGE_BASE:\n${ECHO_KNOWLEDGE}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const origin = typeof req.headers.origin === "string" ? req.headers.origin : "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only, operator." });
  }

  const clientKey = getClientIp(req);
  if (isRateLimited(clientKey)) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again shortly." });
  }

  const apiKey = process.env.NAVIGATOR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "NAVIGATOR_API_KEY not configured." });
  }

  const { messages, stream: wantStream } = req.body as {
    messages?: ChatMessage[];
    stream?: boolean;
    activeSection?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return res.status(400).json({ error: "Invalid messages array (1-50 items)." });
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content || typeof msg.content !== "string") {
      return res.status(400).json({ error: "Each message needs role and content." });
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.ai.it.ufl.edu/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-instruct",
        max_tokens: 700,
        temperature: 0.35,
        stream: !!wantStream,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...(req.body?.activeSection
            ? [{ role: "system", content: `Current page context: ${req.body.activeSection}` }]
            : []),
          ...messages,
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.error("Navigator API error:", response.status, text);
      return res.status(502).json({
        error: "Upstream API error.",
        upstream_status: response.status,
        detail: text.slice(0, 500),
      });
    }

    // Streaming mode — pipe SSE back to client
    if (wantStream && response.body) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = (response.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (streamErr) {
        console.error("Stream read error:", streamErr);
      }

      return res.end();
    }

    // Non-streaming fallback
    const data = await response.json();
    const message = data.choices?.[0]?.message?.content ?? "No response from Navigator.";
    return res.status(200).json({ message });
  } catch (err) {
    clearTimeout(timeout);
    if ((err as Error).name === "AbortError") {
      return res.status(504).json({ error: "Upstream request timed out." });
    }
    console.error("Echo handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
