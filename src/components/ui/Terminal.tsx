import { useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon } from "lucide-react";
import { useTerminal, type TerminalLine } from "@/hooks/useTerminal";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

function renderOutputText(text: string): ReactNode {
  if (!text) return "\u00A0";
  const re = /https?:\/\/[^\s<>"']+/gi;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <a
        key={key++}
        href={m[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-cyan underline decoration-neon-cyan/40 hover:decoration-neon-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {m[0]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length > 0 ? nodes : "\u00A0";
}

function TerminalLineView({ line }: { line: TerminalLine }) {
  if (line.type === "input") {
    return <div className="text-neon-cyan">{line.text}</div>;
  }
  if (line.type === "system") {
    return (
      <div className="space-y-2">
        {line.text ? (
          <div className="text-neon-purple/85 font-medium">{renderOutputText(line.text)}</div>
        ) : null}
        {line.openEchoHint && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-echo"))}
            className="text-[11px] font-mono px-2 py-1 rounded border border-neon-purple/35 text-neon-purple/90 hover:bg-neon-purple/10 transition-colors"
          >
            Open Echo
          </button>
        )}
      </div>
    );
  }
  return <div className="text-slate-400 leading-relaxed">{renderOutputText(line.text)}</div>;
}

/** Interactive terminal overlay — type commands to navigate the portfolio */
export function Terminal({ isOpen, onClose }: TerminalProps) {
  const { lines, input, setInput, handleCommand, applyHistory, autocomplete } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleCommand(input);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      applyHistory("up");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      applyHistory("down");
    }
    if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[min(100%,680px)] z-[61] max-h-[72vh] flex flex-col terminal-card overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.06)]"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive Terminal"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neon-cyan/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    aria-label="Close terminal"
                  />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-neon-cyan/60 font-mono ml-2 flex items-center gap-1.5">
                  <TerminalIcon size={12} />
                  neon-nexus@ethan:~
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 min-h-[200px] max-h-[48vh] leading-relaxed selection:bg-neon-cyan/25 selection:text-white"
            >
              {lines.map((line, i) => (
                <TerminalLineView key={i} line={line} />
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-neon-cyan/20">
              <span className="text-neon-cyan font-mono text-sm">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-slate-200 font-mono outline-none placeholder:text-slate-600"
                placeholder='help · work · timeline · play · skills · ai · echo "…"'
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
              <span className="w-2 h-4 bg-neon-cyan/80 animate-[blink_1s_step-end_infinite]" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
