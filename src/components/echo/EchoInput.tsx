import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

interface EchoInputProps {
  onSend: (message: string) => void;
  loading: boolean;
  activeId: string;
  prompts: string[];
  onClear: () => void;
  messageCount: number;
}

export function EchoInput({
  onSend,
  loading,
  activeId,
  prompts,
  onClear,
  messageCount,
}: EchoInputProps) {
  return (
    <>
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
                onClick={() => onSend(prompt)}
                disabled={loading}
                className="shrink-0 sm:shrink text-[10px] px-3 sm:px-4 py-2 bg-black border border-cyan-400/30 hover:border-cyan-400 rounded-full text-cyan-300 hover:text-white transition-all whitespace-nowrap sm:whitespace-normal disabled:opacity-50"
              >
                {prompt.length > 50 ? prompt.slice(0, 47) + "..." : prompt}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-5 border-t border-cyan-400/30 bg-black shrink-0">
        <PromptInputBox
          onSend={onSend}
          isLoading={loading}
          placeholder="TYPE COMMAND..."
          leftActions={
            messageCount > 1 ? (
              <button
                type="button"
                onClick={onClear}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cyan-400/30 hover:text-red-400 transition-colors"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
            ) : null
          }
        />
      </div>
    </>
  );
}
