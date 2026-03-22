import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: number;
  error?: boolean;
}

interface EchoChatProps {
  isClean?: boolean;
  messages: Message[];
  loading: boolean;
  streamingIndex: number | null;
  typingIndex: number | null;
  displayedChars: number;
  copiedIndex: number | null;
  onCopy: (content: string, index: number) => void;
  onRetry: (index: number) => void;
}

const echoMarkdownComponents: Partial<Components> = {
  p: ({ children, ...props }) => (
    <p className="echo-prose-p" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="echo-prose-ul" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="echo-prose-ol" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="echo-prose-li" {...props}>
      {children}
    </li>
  ),
  h1: ({ children, ...props }) => (
    <h3 className="echo-prose-h1" {...props}>
      {children}
    </h3>
  ),
  h2: ({ children, ...props }) => (
    <h3 className="echo-prose-h2" {...props}>
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="echo-prose-h3" {...props}>
      {children}
    </h3>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="echo-prose-blockquote" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="echo-prose-hr" {...props} />,
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="echo-prose-link"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }) => (
    <strong className="echo-prose-strong" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="echo-prose-em" {...props}>
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => {
    const text = String(children);
    const isBlock =
      Boolean(className?.includes("language-")) || text.includes("\n");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="echo-prose-code-inline" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className="echo-prose-pre" {...props}>
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="echo-prose-table-scroll">
      <table className="echo-prose-table" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="echo-prose-thead" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="echo-prose-tbody" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="echo-prose-tr" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="echo-prose-th" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="echo-prose-td" {...props}>
      {children}
    </td>
  ),
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="echo-prose-task mr-1.5 align-middle"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export function EchoChat({
  isClean = false,
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

  const remarkPlugins = useMemo(() => [remarkGfm], []);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]);

  useEffect(() => {
    if (streamingIndex !== null || (typingIndex !== null && displayedChars % 15 === 0)) {
      scrollToBottom("auto");
    }
  }, [displayedChars, typingIndex, streamingIndex, messages]);

  return (
    <div
      className={
        isClean
          ? "flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 text-slate-700 text-sm sm:text-base space-y-4 bg-white"
          : "flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 font-mono text-slate-200 text-sm sm:text-base space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-white/20"
      }
    >
      {messages.map((msg, i) => {
        const isTyping = typingIndex === i;
        const isStreaming = streamingIndex === i;
        const visibleContent =
          isTyping ? msg.content.slice(0, displayedChars) : msg.content;

        return (
          <div key={i}>
            {i > 0 && msg.role === "user" && messages[i - 1]?.role === "ai" && (
              <div className="flex items-center gap-2 pb-4">
                <div className={`flex-1 h-px ${isClean ? "bg-slate-200" : "bg-white/10"}`} />
                {!isClean && (
                  <div className="text-[8px] text-slate-600 font-mono tracking-widest">·</div>
                )}
                <div className={`flex-1 h-px ${isClean ? "bg-slate-200" : "bg-white/10"}`} />
              </div>
            )}

            <div
              className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span
                className={
                  isClean
                    ? "text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1"
                    : "text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1"
                }
              >
                {msg.role === "user" ? "You" : "Echo"}
              </span>
              <div className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="relative group max-w-[90%] sm:max-w-[85%]">
                  <div
                    className={`px-4 py-3 sm:px-5 sm:py-4 rounded-xl border text-sm sm:text-base ${
                      isClean
                        ? msg.role === "user"
                          ? "border-slate-200 bg-slate-100 text-slate-800"
                          : msg.error
                            ? "border-red-200 bg-red-50 text-red-900"
                            : "border-slate-200 bg-slate-50 text-slate-800"
                        : msg.role === "user"
                          ? "border-violet-500/25 bg-violet-950/35 text-slate-100"
                          : msg.error
                            ? "border-red-500/30 bg-red-950/25 text-red-100"
                            : "border-white/10 bg-black/50 text-slate-100"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <>
                        {msg.error ? (
                          <p className="my-0 whitespace-pre-wrap break-words">{visibleContent}</p>
                        ) : (
                          <>
                            {visibleContent.length > 0 ? (
                              <div className="echo-prose">
                                <ReactMarkdown
                                  remarkPlugins={remarkPlugins}
                                  components={echoMarkdownComponents}
                                >
                                  {visibleContent}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <span className="inline-block min-h-[1.25em]" aria-hidden />
                            )}
                            {(isTyping || isStreaming) && (
                              <span
                                className={`inline-block w-0.5 h-4 animate-pulse ml-0.5 align-middle rounded-sm ${
                                  isClean ? "bg-sky-500" : "bg-cyan-400"
                                }`}
                              />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <p className="my-0 whitespace-pre-wrap break-words">{visibleContent}</p>
                    )}
                  </div>

                  <div
                    className={`text-[9px] mt-1 ${isClean ? "text-slate-400" : "text-slate-600 font-mono"} ${msg.role === "user" ? "text-right" : "text-left"}`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>

                  {msg.role === "ai" && !isTyping && !isStreaming && (
                    <button
                      type="button"
                      onClick={() => onCopy(msg.content, i)}
                      className={
                        isClean
                          ? "absolute top-2 right-2 p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-all"
                          : "absolute top-2 right-2 p-1 text-slate-500/0 group-hover:text-slate-400 hover:!text-slate-200 transition-colors"
                      }
                      aria-label="Copy message"
                    >
                      {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}

                  {msg.error && (
                    <button
                      type="button"
                      onClick={() => onRetry(i)}
                      className="mt-1 text-[10px] text-red-400 hover:text-red-300 font-mono tracking-wider transition-colors"
                    >
                      RETRY TRANSMISSION
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <div
          className={`flex items-center gap-2 text-sm ${isClean ? "text-slate-500" : "text-slate-400 font-mono"}`}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((j) => (
              <motion.span
                key={j}
                className={`h-1.5 w-1.5 rounded-full ${isClean ? "bg-sky-400" : "bg-cyan-400"}`}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: j * 0.12 }}
              />
            ))}
          </div>
          <span>Thinking…</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
