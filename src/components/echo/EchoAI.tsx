import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/components/hud/NavigationProvider";
import { SECTION_PROMPTS } from "@/data/echoPrompts";
import { EchoChat, type Message } from "./EchoChat";
import { EchoInput } from "./EchoInput";
import { EchoOrb } from "./EchoOrb";
import { isLightTheme, parseSavedTheme, type ThemeMode } from "@/lib/theme";
import type { SectionId } from "@/data/navSections";
import { SECTION_LABELS } from "@/lib/sectionLabels";

/* ── Constants ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "echo-ai-messages-v2";
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
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // ignore quota errors
  }
}

/* ── SSE stream parser ─────────────────────────────────────────────────── */

/** Lightweight “mood” for chrome / Matrix rain — heuristic only, no extra API */
function dispatchEchoMoodFromReply(content: string) {
  const lower = content.toLowerCase();
  let mood: "hype" | "calm" | "focus" = "focus";
  if (
    /\b(love|awesome|incredible|excited|fantastic|great|excellent|perfect)\b/.test(lower)
  ) {
    mood = "hype";
  } else if (
    /\b(calm|careful|slowly|pause|step|patience|steady|think)\b/.test(lower)
  ) {
    mood = "calm";
  }
  window.dispatchEvent(new CustomEvent("echo-mood", { detail: { mood } }));
}

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
  const echoSectionLabel = SECTION_LABELS[activeId as SectionId] ?? "Site";

  // Light themes (clean UI for Echo chrome)
  const [isClean, setIsClean] = useState(false);
  useEffect(() => {
    const readTheme = (): ThemeMode =>
      parseSavedTheme(document.querySelector("[data-theme]")?.getAttribute("data-theme") ?? null);
    const observer = new MutationObserver(() => {
      setIsClean(isLightTheme(readTheme()));
    });
    observer.observe(document.body.parentElement!, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-theme"],
    });
    setIsClean(isLightTheme(readTheme()));
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

  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-echo", openHandler);
    return () => window.removeEventListener("open-echo", openHandler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      document.querySelector<HTMLTextAreaElement>("textarea[data-echo-input]")?.focus({
        preventScroll: true,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

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
      const timeout = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch("/api/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, stream: true, activeSection: activeId }),
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
          dispatchEchoMoodFromReply(fullContent);
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
          dispatchEchoMoodFromReply(aiReply);
        }
      } catch (error) {
        clearTimeout(timeout);
        const errMsg =
          (error as Error).name === "AbortError"
            ? "Request timed out. Try again or simplify the question."
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
    [messages, loading, typingIndex, activeId],
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
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([{ ...GREETING, timestamp: Date.now() }]);
    setTypingIndex(null);
    setStreamingIndex(null);
    localStorage.removeItem(STORAGE_KEY);
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
            className={
              isClean
                ? "fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4"
                : "fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-[2px] p-0 sm:p-4"
            }
            onClick={() => setIsOpen(false)}
            data-native-cursor
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="echo-dialog-title"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={
                isClean
                  ? "w-full h-full sm:h-auto sm:max-h-[90vh] max-w-lg bg-white border border-slate-200/80 sm:rounded-2xl overflow-hidden shadow-xl flex flex-col"
                  : "w-full h-full sm:h-auto sm:max-h-[90vh] max-w-3xl bg-zinc-950 border-0 sm:border border-white/10 sm:rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)] flex flex-col"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={
                  isClean
                    ? "border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between shrink-0 bg-slate-50/80"
                    : "border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between shrink-0 bg-black/40"
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={
                      isClean
                        ? "h-2 w-2 rounded-full bg-emerald-500 shrink-0"
                        : "h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    }
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      id="echo-dialog-title"
                      className={
                        isClean
                          ? "font-semibold text-slate-800 text-sm sm:text-base tracking-tight truncate"
                          : "font-mono text-sm sm:text-base text-slate-100 tracking-tight truncate"
                      }
                    >
                      Echo
                    </div>
                    <div
                      className={
                        isClean
                          ? "mt-1 flex flex-wrap items-center gap-2"
                          : "mt-1 flex flex-wrap items-center gap-2"
                      }
                    >
                      <span
                        className={
                          isClean
                            ? "text-[11px] text-slate-500 truncate"
                            : "text-[10px] text-slate-500 font-mono truncate"
                        }
                      >
                        Portfolio assistant · streaming
                      </span>
                      <span
                        className={
                          isClean
                            ? "shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            : "shrink-0 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wide text-slate-400"
                        }
                      >
                        {echoSectionLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <kbd
                    className={
                      isClean
                        ? "hidden sm:inline text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 font-mono"
                        : "hidden sm:inline text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5 font-mono"
                    }
                  >
                    `
                  </kbd>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className={
                      isClean
                        ? "text-slate-400 hover:text-slate-700 p-1.5 rounded-lg border border-transparent transition-all hover:border-sky-300/50 hover:bg-slate-100/80 hover:shadow-neon-cyan-soft"
                        : "text-slate-400 hover:text-white p-1.5 rounded-lg border border-transparent transition-all hover:border-neon-cyan/25 hover:shadow-neon-cyan-soft"
                    }
                    autoFocus
                    aria-label="Close Echo"
                  >
                    <X size={22} className="sm:hidden" />
                    <X size={24} className="hidden sm:block" />
                  </button>
                </div>
              </div>

              <EchoChat
                isClean={isClean}
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
                isClean={isClean}
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
