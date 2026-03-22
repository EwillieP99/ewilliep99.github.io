import { motion } from "framer-motion";
import { Bot, Copy, Terminal as TerminalIcon, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { navCodename } from "@/data/navSections";

const DECK_PROMPTS = [
  "Give me a 30-second pitch on Ethan for a recruiter.",
  "Which projects best prove GTM execution plus technical depth?",
  "Draft a concise LinkedIn intro note from Ethan to a hiring manager.",
  "What interview questions should a founder ask Ethan?",
  "Summarize Ethan's Perplexity AI campus outcomes with metrics.",
  "Write a 90-day plan if Ethan joined as a founding GTM hire.",
  "How should Ethan position AI fluency without overstating engineering depth?",
  "What are Ethan's strongest proof points for B2B SaaS sales roles?",
] as const;

export function AIHub() {
  const copyPrompt = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success("Copied — paste into Echo", {
      style: {
        background: "var(--toast-bg, #0a0a0a)",
        border: "1px solid rgba(0,245,255,0.25)",
        color: "#e2e8f0",
      },
    });
  };

  return (
    <section id="ai" className="section-shell" aria-label="AI section">
      <AnimatedSection>
        <SectionHeader
          codename={navCodename("ai")}
          label="AI Command Deck"
          sub="Copy prompts, use shortcuts, or open Echo when you want a full conversation"
        />
      </AnimatedSection>

      <AnimatedSection delay={0.06}>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-start">
          <div className="rounded-xl border border-white/10 bg-navy-950/60 backdrop-blur-md p-6 sm:p-8">
            <p className="text-slate-300 text-sm leading-relaxed">
              For <span className="text-neon-cyan">recruiters</span>,{" "}
              <span className="text-neon-purple/90">founders</span>, and{" "}
              <span className="text-neon-green/90">students</span>: Echo answers from this portfolio&apos;s context.
              Start from a copied prompt below, then open Echo and paste — or type your own thread.
            </p>
            <p className="type-overline mt-5">Prompt deck</p>
            <ul className="mt-2 space-y-2">
              {DECK_PROMPTS.map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    onClick={() => copyPrompt(prompt)}
                    className="group w-full flex items-start gap-3 text-left rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 transition-all hover:border-neon-cyan/25 hover:bg-neon-cyan/5 hover:shadow-neon-cyan-soft"
                  >
                    <Copy
                      size={14}
                      className="mt-0.5 text-slate-500 group-hover:text-neon-cyan shrink-0"
                      aria-hidden
                    />
                    <span className="text-sm text-slate-300 leading-snug">{prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-echo"))}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neon-purple/90 hover:text-neon-purple transition-colors"
              >
                <Bot size={14} />
                Open Echo
              </button>
              <span className="text-slate-600 text-xs hidden sm:inline">·</span>
              <span className="text-[11px] text-slate-500">Full chat, streaming, section-aware prompts</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-neon-cyan/15 bg-black/40 p-6 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
                <Keyboard size={13} />
                Shortcuts
              </div>
              <ul className="space-y-2 text-sm text-slate-400 font-mono">
                <li className="flex justify-between gap-2">
                  <span>Toggle Echo</span>
                  <kbd className="text-neon-cyan/80 shrink-0">`</kbd>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Open Echo</span>
                  <kbd className="text-neon-cyan/80 shrink-0">⌘/Ctrl + K</kbd>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
                <TerminalIcon size={13} />
                Terminal
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400 font-mono">
                <li>
                  <span className="text-neon-purple/70">ai</span> — open Echo
                </li>
                <li>
                  <span className="text-neon-purple/70">echo &lt;question&gt;</span> — quick bridge (truncated)
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </section>
  );
}
