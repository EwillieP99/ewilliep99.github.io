import { useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon } from "lucide-react";
import { useTerminal } from "@/hooks/useTerminal";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Interactive terminal overlay — type commands to navigate the portfolio */
export function Terminal({ isOpen, onClose }: TerminalProps) {
  const { lines, input, setInput, handleCommand } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Terminal window */}
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px] z-[61] max-h-[70vh] flex flex-col terminal-card overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive Terminal"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neon-cyan/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" aria-label="Close terminal" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-neon-cyan/60 font-mono ml-2 flex items-center gap-1.5">
                  <TerminalIcon size={12} />
                  neon-nexus@ethan:~
                </span>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Output area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 min-h-[200px] max-h-[50vh]"
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "input"
                      ? "text-neon-cyan"
                      : line.type === "system"
                      ? "text-neon-purple/80"
                      : "text-slate-400"
                  }
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>

            {/* Input line */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-neon-cyan/20">
              <span className="text-neon-cyan font-mono text-sm">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-slate-200 font-mono outline-none placeholder:text-slate-600"
                placeholder='Type a command... (try "help")'
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
