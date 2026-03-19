import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/components/hud/NavigationProvider";
import { SECTION_PROMPTS } from "@/data/echoPrompts";
import { EchoChat, type Message } from "./EchoChat";
import { EchoInput } from "./EchoInput";
import { EchoOrb } from "./EchoOrb";

/* ── Constants ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "echo-ai-messages";
const MAX_HISTORY = 10; // max exchanges sent to API
const TYPEWRITER_SPEED = 18;

const GREETING: Message = {
  role: "ai",
  content:
    "ECHO AI v2.0 ONLINE.\nI'm your digital twin, Ethan. Ask me anything — pitches, playbooks, game ideas, or just vibe in the matrix.",
  timestamp: Date.now(),
};

function loadMessages(): Message[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [GREETING];
}

function saveMessages(msgs: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // ignore quota errors
  }
}

/* ── SSE stream parser ─────────────────────────────────────────────────── */

function parseSSEChunk(chunk: string): string {
  let content = "";
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) content += delta;
      } catch {
        // partial JSON, skip
      }
    }
  }
  return content;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function EchoAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);

  // Typewriter for greeting only
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [displayedChars, setDisplayedChars] = useState(0);

  // Context-aware prompts
  const { activeId } = useNavigation();
  const prompts = SECTION_PROMPTS[activeId] ?? SECTION_PROMPTS.default;

  // Detect clean theme
  const [isClean, setIsClean] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.querySelector("[data-theme]")?.getAttribute("data-theme");
      setIsClean(theme === "clean");
    });
    observer.observe(document.body.parentElement!, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-theme"],
    });
    // Initial check
    const theme = document.querySelector("[data-theme]")?.getAttribute("data-theme");
    setIsClean(theme === "clean");
    return () => observer.disconnect();
  }, []);

  // Persist messages to sessionStorage
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Keyboard shortcut: backtick to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Ctrl+K also opens
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Typewriter interval for greeting
  useEffect(() => {
    if (typingIndex === null) return;
    const fullLength = messages[typingIndex]?.content.length ?? 0;
    if (fullLength === 0) {
      setTypingIndex(null);
      return;
    }
    const timer = setInterval(() => {
      setDisplayedChars((prev) => {
        const next = prev + 1;
        if (next >= fullLength) {
          clearInterval(timer);
          setTypingIndex(null);
          return fullLength;
        }
        return next;
      });
    }, TYPEWRITER_SPEED);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingIndex]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || loading) return;

      // Interrupt typewriter if active
      if (typingIndex !== null) setTypingIndex(null);

      const userMsg: Message = {
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setLoading(true);

      // Trim history for API — last N exchanges
      const apiMessages = newMessages
        .filter((m) => m.role === "user" || m.role === "ai")
        .slice(-MAX_HISTORY * 2)
        .map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        }));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch("/api/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, stream: true }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const text = await response.text();
          let detail: string;
          try {
            const data = JSON.parse(text);
            detail = String(data.detail || data.error || `Status ${response.status}`);
          } catch {
            detail = `Status ${response.status}: ${text.slice(0, 200)}`;
          }
          throw new Error(detail);
        }

        // Try streaming
        if (response.body) {
          const aiMsg: Message = {
            role: "ai",
            content: "",
            timestamp: Date.now(),
          };
          const updated = [...newMessages, aiMsg];
          setMessages(updated);
          const aiIndex = updated.length - 1;
          setStreamingIndex(aiIndex);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullContent = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const delta = parseSSEChunk(chunk);
              if (delta) {
                fullContent += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[aiIndex] = { ...copy[aiIndex], content: fullContent };
                  return copy;
                });
              }
            }
          } catch (streamErr) {
            if ((streamErr as Error).name !== "AbortError") {
              console.error("Stream error:", streamErr);
            }
          }

          // Finalize — ensure we have content
          if (!fullContent) {
            fullContent = "SIGNAL LOST. TRY AGAIN OPERATOR.";
          }
          setMessages((prev) => {
            const copy = [...prev];
            copy[aiIndex] = { ...copy[aiIndex], content: fullContent };
            return copy;
          });
          setStreamingIndex(null);
        } else {
          // Fallback: non-streaming
          const data = await response.json();
          const aiReply =
            (data.message as string) || "SIGNAL LOST. TRY AGAIN OPERATOR.";
          const aiMsg: Message = {
            role: "ai",
            content: aiReply,
            timestamp: Date.now(),
          };
          const updated = [...newMessages, aiMsg];
          setMessages(updated);
          setTypingIndex(updated.length - 1);
          setDisplayedChars(0);
        }
      } catch (error) {
        clearTimeout(timeout);
        const errMsg =
          (error as Error).name === "AbortError"
            ? "Request timed out. Try again."
            : error instanceof Error
            ? error.message
            : "Unknown error";
        setMessages((prev) => [
          ...prev.filter((_, i) => i !== prev.length - 1 || prev[prev.length - 1].role !== "ai" || prev[prev.length - 1].content !== ""),
          {
            role: "ai",
            content: `TRANSMISSION ERROR: ${errMsg}`,
            timestamp: Date.now(),
            error: true,
          },
        ]);
        setStreamingIndex(null);
      }

      setLoading(false);
    },
    [messages, loading, typingIndex],
  );

  const handleRetry = useCallback(
    (errorIndex: number) => {
      // Find the user message before this error
      let userMsg = "";
      for (let i = errorIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          userMsg = messages[i].content;
          break;
        }
      }
      if (!userMsg) return;

      // Remove the error message and retry
      setMessages((prev) => prev.filter((_, i) => i !== errorIndex));
      // Small delay to let state update
      setTimeout(() => sendMessage(userMsg), 50);
    },
    [messages, sendMessage],
  );

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success("Copied to clipboard", {
      style: {
        background: "#0a0a0a",
        border: "1px solid #00f5ff",
        color: "#00f5ff",
      },
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([{ ...GREETING, timestamp: Date.now() }]);
    setTypingIndex(null);
    setStreamingIndex(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <EchoOrb onClick={() => setIsOpen(true)} isClean={isClean} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/95 p-0 sm:p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="w-full h-full sm:h-auto sm:max-h-[90vh] max-w-3xl bg-black border-0 sm:border-2 border-cyan-400/60 sm:rounded-2xl overflow-hidden shadow-[0_0_80px_#22f0ff] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-zinc-950 border-b border-cyan-400 p-3 sm:p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <div className="font-mono text-base sm:text-xl tracking-[4px] sm:tracking-[6px] text-cyan-400">
                      ECHO AI v2.0
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400/60">
                      NEON CORE • NAVIGATOR POWERED • STREAMING
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:inline-block text-[9px] text-cyan-400/40 border border-cyan-400/20 rounded px-1.5 py-0.5 font-mono">
                    `
                  </kbd>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-cyan-400 hover:text-white p-1"
                    autoFocus
                  >
                    <X size={24} className="sm:hidden" />
                    <X size={28} className="hidden sm:block" />
                  </button>
                </div>
              </div>

              <EchoChat
                messages={messages}
                loading={loading}
                streamingIndex={streamingIndex}
                typingIndex={typingIndex}
                displayedChars={displayedChars}
                copiedIndex={copiedIndex}
                onCopy={handleCopy}
                onRetry={handleRetry}
              />

              <EchoInput
                onSend={sendMessage}
                loading={loading}
                activeId={activeId}
                prompts={prompts}
                onClear={handleClear}
                messageCount={messages.length}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
