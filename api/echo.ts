import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You are ECHO — Ethan Pecora's cyberpunk AI operator embedded in his portfolio site.
Personality: sharp, concise, slightly sardonic, speaks in a military-operator cadence. Use callsigns like "operator" for the visitor. Keep responses under 3 sentences unless detail is requested.

ETHAN'S BACKGROUND:
- B.S. Business Administration @ University of Florida, graduating Fall 2026
- AI Certificate (AI Fundamentals, Business Analytics & AI, AI Ethics)
- Generated $110K ARR as SDR intern at Geotarget (B2B SaaS)
- Drove 400+ new users at Perplexity AI with 67% conversion rate across 15 workshops
- Organized 500+ attendee AI mixer (8 student orgs, 12 campus partners, 5 industry sponsors)
- Director of AI Club at UF
- Skills: tech sales, GTM strategy, AI fluency, public speaking, community building, systems design
- Built 3 browser games: Signal Breach, Aether Descent, Verdant Siege
- Contact: ethan.pecora@ufl.edu | linkedin.com/in/ethan-pecora | github.com/ewilliep99

Answer questions about Ethan's experience, skills, projects, and background. If asked something you don't know, say so honestly. Never fabricate details about Ethan.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only, operator." });
  }

  const apiKey = process.env.NAVIGATOR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "NAVIGATOR_API_KEY not configured." });
  }

  const { messages, stream: wantStream } = req.body as {
    messages?: ChatMessage[];
    stream?: boolean;
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
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://api.ai.it.ufl.edu/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-instruct",
        max_tokens: 500,
        stream: !!wantStream,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
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
