import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { SectionId } from "@/data/navSections";
import { SECTION_LABELS } from "@/lib/sectionLabels";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Magnetic } from "@/components/ui/Magnetic";

const VISIBLE_PROMPTS = 3;

interface EchoInputProps {
  isClean?: boolean;
  onSend: (message: string) => void;
  loading: boolean;
  activeId: SectionId | string;
  prompts: string[];
  onClear: () => void;
  messageCount: number;
}

export function EchoInput({
  isClean = false,
  onSend,
  loading,
  activeId,
  prompts,
  onClear,
  messageCount,
}: EchoInputProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const sectionLabel = SECTION_LABELS[activeId as SectionId] ?? "Site";
  const shown = moreOpen ? prompts : prompts.slice(0, VISIBLE_PROMPTS);
  const hasMore = prompts.length > VISIBLE_PROMPTS;

  return (
    <>
      <div
        className={
          isClean
            ? "px-3 sm:px-5 pb-2 shrink-0 border-t border-slate-100 bg-slate-50/90"
            : "px-3 sm:px-5 pb-2 shrink-0 border-t border-white/10 bg-black/30"
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pt-3 space-y-2"
          >
            <div className="flex flex-wrap gap-2">
              {shown.map((prompt, i) => (
                <Magnetic
                  key={`${activeId}-${i}`}
                  className="inline-flex max-w-full sm:max-w-[280px]"
                  innerClassName="inline-flex max-w-full sm:max-w-[280px]"
                >
                <button
                  type="button"
                  onClick={() => onSend(prompt)}
                  disabled={loading}
                  className={
                    isClean
                      ? "text-left text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/80 transition-colors disabled:opacity-50 max-w-full sm:max-w-[280px]"
                      : "text-left text-xs px-3 py-2 rounded-lg border border-white/12 bg-white/[0.04] text-slate-200 hover:border-white/25 hover:bg-white/[0.07] transition-colors disabled:opacity-50 max-w-full sm:max-w-[280px]"
                  }
                >
                  {prompt.length > 72 ? `${prompt.slice(0, 69)}…` : prompt}
                </button>
                </Magnetic>
              ))}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className={
                  isClean
                    ? "flex items-center gap-1 text-[11px] font-medium text-sky-600 hover:text-sky-800"
                    : "flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-300"
                }
              >
                {moreOpen ? (
                  <>
                    Fewer prompts <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    More prompts ({prompts.length - VISIBLE_PROMPTS}) <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={
          isClean
            ? "p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0"
            : "p-3 sm:p-4 border-t border-white/10 bg-black/50 shrink-0"
        }
      >
        <p
          className={
            isClean
              ? "text-[11px] text-slate-500 mb-2"
              : "text-[10px] font-mono text-slate-500 mb-2"
          }
        >
          Context: <span className={isClean ? "text-slate-700 font-medium" : "text-slate-300"}>{sectionLabel}</span>
        </p>
        <PromptInputBox
          onSend={onSend}
          isLoading={loading}
          appearance={isClean ? "clean" : "default"}
          placeholder={isClean ? "Ask about Ethan, GTM, or projects…" : "Message Echo…"}
          leftActions={
            messageCount > 1 ? (
              <Magnetic className="inline-flex" innerClassName="inline-flex">
              <button
                type="button"
                onClick={onClear}
                className={
                  isClean
                    ? "flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                    : "flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:text-red-400 transition-colors"
                }
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
              </Magnetic>
            ) : null
          }
        />
      </div>
    </>
  );
}
