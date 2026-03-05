import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Shield, Target, BookOpen, FileText } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION DOSSIER MODAL — Full-screen project case study overlay
// ═══════════════════════════════════════════════════════════════════════════════

interface MissionDossierModalProps {
  project: Project | null;
  onClose: () => void;
}

/** Animated counter for result metrics */
function ResultCounter({ label, value, delay }: { label: string; value: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(numericMatch[0]);
    const prefix = value.slice(0, value.indexOf(numericMatch[0]));
    const postfix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);
    const isInt = Number.isInteger(target);
    const duration = 1000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(`${prefix}${isInt ? Math.round(current) : current.toFixed(1)}${postfix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-navy-950/80 border border-neon-cyan/15 rounded-lg p-4 text-center hover:border-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,245,255,0.08)] transition-all duration-300"
    >
      <p className="text-xl font-bold text-neon-cyan font-display tabular-nums">{display}</p>
      <p className="text-[11px] text-slate-500 font-mono mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

export function MissionDossierModal({ project, onClose }: MissionDossierModalProps) {
  const isOpen = project !== null;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-navy-950/95 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-3xl mx-4 my-8 md:my-16"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              autoFocus
              className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-navy-950/90 border border-neon-cyan/20 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
              aria-label="Close dossier"
            >
              <X size={18} />
            </button>

            <div className="rounded-xl border border-neon-cyan/20 bg-navy-950/90 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(0,245,255,0.06)]">
              {/* ── Header ──────────────────────────────────────────────── */}
              <div className="relative p-6 md:p-8 border-b border-neon-cyan/10">
                {/* Top glow line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    {/* Classified / Active badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border",
                          project.status === "classified"
                            ? "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30 shadow-[0_0_10px_rgba(0,245,255,0.15)]"
                            : "text-neon-green bg-neon-green/10 border-neon-green/30",
                        )}
                      >
                        <Shield size={10} />
                        {project.status === "classified" ? "CLASSIFIED" : "ACTIVE"}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-neon-purple/80 px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 font-mono">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <h2 id="dossier-title" className="text-2xl md:text-3xl font-bold text-slate-100 font-display mb-2">
                      {project.title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Tag key={tag} label={tag} color={project.category === "ai" ? "purple" : "cyan"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Body ────────────────────────────────────────────────── */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Mission Brief */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-neon-cyan/60" />
                    <h3 className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest">
                      Mission Brief
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {project.dossier?.fullDescription ?? project.description}
                  </p>
                </section>

                {/* Impact badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/8 border border-neon-purple/20">
                  <Target size={14} className="text-neon-purple/70" />
                  <span className="text-sm font-mono text-neon-purple/90">{project.impact}</span>
                </div>

                {/* Quantified Results */}
                {project.dossier?.results && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={14} className="text-neon-cyan/60" />
                      <h3 className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest">
                        Quantified Results
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {project.dossier.results.map((result, i) => (
                        <ResultCounter
                          key={result.label}
                          label={result.label}
                          value={result.value}
                          delay={0.1 + i * 0.1}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Debrief */}
                {project.dossier?.debrief && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen size={14} className="text-neon-cyan/60" />
                      <h3 className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest">
                        Debrief
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {project.dossier.debrief.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="text-neon-cyan/50 mt-0.5 font-mono text-xs flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Links */}
                {project.links.length > 0 && (
                  <div className="flex gap-3 pt-4 border-t border-neon-cyan/10">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs py-2 px-4"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom glow */}
              <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
