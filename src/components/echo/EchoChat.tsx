import { useRef, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: number;
  error?: boolean;
}

interface EchoChatProps {
  messages: Message[];
  loading: boolean;
  streamingIndex: number | null;
  typingIndex: number | null;
  displayedChars: number;
  copiedIndex: number | null;
  onCopy: (content: string, index: number) => void;
  onRetry: (index: number) => void;
}

/* ── Lightweight Markdown renderer ─────────────────────────────────────── */

function renderMarkdown(text: string): ReactNode {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
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

    if (line.trim() === "") {
      i++;
      continue;
    }

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

/* ── Component ─────────────────────────────────────────────────────────── */

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export function EchoChat({
  messages,
  loading,
  streamingIndex,
  typingIndex,
  displayedChars,
  copiedIndex,
  onCopy,
  onRetry,
}: EchoChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll during streaming/typewriter
  useEffect(() => {
    if (streamingIndex !== null || (typingIndex !== null && displayedChars % 15 === 0)) {
      scrollToBottom();
    }
  }, [displayedChars, typingIndex, streamingIndex, messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 font-mono text-cyan-200 text-sm sm:text-base space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-cyan-500">
      {messages.map((msg, i) => {
        const isTyping = typingIndex === i;
        const isStreaming = streamingIndex === i;
        const visibleContent =
          isTyping ? msg.content.slice(0, displayedChars) : msg.content;

        return (
          <div key={i}>
            {/* Transmission break between exchanges */}
            {i > 0 && msg.role === "user" && messages[i - 1]?.role === "ai" && (
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
                      : msg.error
                      ? "border-red-400/40 bg-red-950/20"
                      : "border-cyan-400/30 bg-black/60"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <>
                      {renderMarkdown(visibleContent)}
                      {(isTyping || isStreaming) && (
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
                {msg.role === "ai" && !isTyping && !isStreaming && (
                  <button
                    onClick={() => onCopy(msg.content, i)}
                    className="absolute top-2 right-2 p-1 text-cyan-400/0 group-hover:text-cyan-400/40 hover:!text-cyan-400 transition-colors"
                    aria-label="Copy message"
                  >
                    {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}

                {/* Retry button for error messages */}
                {msg.error && (
                  <button
                    onClick={() => onRetry(i)}
                    className="mt-1 text-[10px] text-red-400 hover:text-red-300 font-mono tracking-wider transition-colors"
                  >
                    RETRY TRANSMISSION
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
              <span className="text-xs tracking-[3px]">DECRYPTING SIGNAL</span>
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
  );
}
