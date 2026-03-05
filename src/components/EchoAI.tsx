import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Send, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/components/hud/NavigationProvider";
import { SECTION_PROMPTS } from "@/data/echoPrompts";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHTWEIGHT MARKDOWN RENDERER
   ═══════════════════════════════════════════════════════════════════════════ */

function renderMarkdown(text: string): ReactNode {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre
          key={key++}
          className="bg-cyan-950/30 border border-cyan-400/20 rounded-lg px-3 py-2 my-2 overflow-x-auto text-xs"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // List item
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc list-inside my-1 space-y-0.5">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p key={key++} className="my-0.5">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{blocks}</>;
}

function renderInline(text: string): ReactNode {
  // Split on inline patterns: **bold**, *italic*, `code`
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={key++} className="text-cyan-300">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code
          key={key++}
          className="bg-cyan-950/40 px-1 rounded text-cyan-300 text-[0.9em]"
        >
          {match[4]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const TYPEWRITER_SPEED = 18; // ms per character

export default function EchoAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "ECHO AI v1.0 ONLINE.\nI'm your digital twin, Ethan. Ask me anything — pitches, playbooks, game ideas, or just vibe in the matrix.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Typewriter state
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [displayedChars, setDisplayedChars] = useState(0);

  // Context-aware prompts
  const { activeId } = useNavigation();
  const prompts = SECTION_PROMPTS[activeId] ?? SECTION_PROMPTS.default;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom — throttled during typewriter
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll during typewriter every ~15 chars
  useEffect(() => {
    if (typingIndex !== null && displayedChars % 15 === 0) {
      scrollToBottom();
    }
  }, [displayedChars, typingIndex, scrollToBottom]);

  // Typewriter interval — only re-runs when typingIndex changes
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

  const sendMessage = async (userMessage?: string) => {
    const messageToSend = userMessage || input.trim();
    if (!messageToSend) return;

    // Interrupt typewriter if active
    if (typingIndex !== null) {
      setTypingIndex(null);
    }

    if (loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageToSend, timestamp: Date.now() },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/echo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.role === "user" || m.role === "ai")
            .map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content,
            })),
        }),
      });

      const text = await response.text();
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Echo API non-JSON response:", response.status, text);
        throw new Error(
          `Non-JSON response (${response.status}): ${text.slice(0, 200)}`,
        );
      }

      if (!response.ok) {
        console.error("Echo API error:", response.status, data);
        const detail = data.detail || data.error || `Status ${response.status}`;
        throw new Error(String(detail));
      }

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
    } catch (error) {
      console.error("Echo fetch error:", error);
      const errMsg =
        error instanceof Error ? error.message : "Unknown error";
      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: `TRANSMISSION ERROR: ${errMsg}`,
          timestamp: Date.now(),
        },
      ]);
    }

    setLoading(false);
  };

  const copyMessage = (content: string, index: number) => {
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

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ─── Render ─── */
  return (
    <>
      {/* Floating Neon Orb */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_50px_#22f0ff,0_0_80px_#c026d3] border-4 border-black hover:scale-110 active:scale-95 transition-all"
        whileHover={{ scale: 1.15, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot size={30} className="text-black drop-shadow-lg sm:hidden" />
        <Bot size={34} className="text-black drop-shadow-lg hidden sm:block" />
      </motion.button>

      {/* Chat Modal */}
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
                      ECHO AI v1.0
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400/60">
                      NEON CORE • NAVIGATOR POWERED
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-400 hover:text-white p-1"
                >
                  <X size={24} className="sm:hidden" />
                  <X size={28} className="hidden sm:block" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 font-mono text-cyan-200 text-sm sm:text-base space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-cyan-500">
                {messages.map((msg, i) => {
                  const isTyping = typingIndex === i;
                  const visibleContent =
                    isTyping
                      ? msg.content.slice(0, displayedChars)
                      : msg.content;

                  return (
                    <div key={i}>
                      {/* Transmission break between exchanges */}
                      {i > 0 &&
                        msg.role === "user" &&
                        messages[i - 1]?.role === "ai" && (
                          <div className="flex items-center gap-2 pb-4">
                            <div className="flex-1 h-px bg-cyan-400/10" />
                            <div className="text-[8px] text-cyan-400/20 font-mono tracking-widest">
                              TRANSMISSION BREAK
                            </div>
                            <div className="flex-1 h-px bg-cyan-400/10" />
                          </div>
                        )}

                      <div
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="relative group max-w-[90%] sm:max-w-[85%]">
                          <div
                            className={`px-4 py-3 sm:px-5 sm:py-4 rounded-xl border text-sm sm:text-base ${
                              msg.role === "user"
                                ? "border-purple-400/40 bg-purple-950/40"
                                : "border-cyan-400/30 bg-black/60"
                            }`}
                          >
                            {msg.role === "ai" ? (
                              <>
                                {renderMarkdown(visibleContent)}
                                {isTyping && (
                                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
                                )}
                              </>
                            ) : (
                              visibleContent
                            )}
                          </div>

                          {/* Timestamp */}
                          <div
                            className={`text-[9px] text-cyan-400/25 mt-1 font-mono ${msg.role === "user" ? "text-right" : "text-left"}`}
                          >
                            {formatTime(msg.timestamp)}
                          </div>

                          {/* Copy button for AI messages */}
                          {msg.role === "ai" && !isTyping && (
                            <button
                              onClick={() => copyMessage(msg.content, i)}
                              className="absolute top-2 right-2 p-1 text-cyan-400/0 group-hover:text-cyan-400/40 hover:!text-cyan-400 transition-colors"
                              aria-label="Copy message"
                            >
                              {copiedIndex === i ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-start gap-3 text-cyan-400 font-mono">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((j) => (
                            <motion.div
                              key={j}
                              className="w-1.5 h-4 bg-cyan-400 rounded-sm"
                              animate={{
                                scaleY: [0.3, 1, 0.3],
                                opacity: [0.4, 1, 0.4],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: j * 0.15,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs tracking-[3px]">
                          DECRYPTING SIGNAL
                        </span>
                      </div>
                      <div className="h-px w-48 bg-cyan-400/20 rounded overflow-hidden">
                        <motion.div
                          className="h-full w-1/3 bg-cyan-400/60"
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts — context-aware */}
              <div className="px-3 sm:px-6 pb-3 sm:pb-4 overflow-x-auto shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex sm:flex-wrap gap-2"
                  >
                    {prompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(prompt)}
                        className="shrink-0 sm:shrink text-[10px] px-3 sm:px-4 py-2 bg-black border border-cyan-400/30 hover:border-cyan-400 rounded-full text-cyan-300 hover:text-white transition-all whitespace-nowrap sm:whitespace-normal"
                      >
                        {prompt.length > 50
                          ? prompt.slice(0, 47) + "..."
                          : prompt}
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Input Bar */}
              <div className="p-3 sm:p-5 border-t border-cyan-400/30 bg-black shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2 sm:gap-3"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-black border border-cyan-400/50 focus:border-cyan-400 px-3 py-3 sm:px-5 sm:py-4 font-mono text-sm sm:text-base text-cyan-200 placeholder:text-cyan-400/50 outline-none rounded-xl"
                    placeholder="TYPE COMMAND..."
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="neon-button px-4 sm:px-8 flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <Send size={18} />
                    <span className="hidden sm:inline">SEND</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
