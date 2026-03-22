import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Shield, Target, BookOpen, FileText } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { hudType } from "@/lib/sectionTypography";
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
      className="rounded-lg border border-white/10 bg-navy-950/80 p-4 text-center transition-all duration-300 hover:border-neon-cyan/25 hover:shadow-[0_0_15px_rgba(0,245,255,0.06)]"
    >
      <p className="font-display text-xl font-bold tabular-nums text-neon-cyan">{display}</p>
      <p className={cn(hudType.overline, "mt-2 text-center")}>{label}</p>
    </motion.div>
  );
}

export function MissionDossierModal({ project, onClose }: MissionDossierModalProps) {
  const isOpen = project !== null;
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

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
          ref={trapRef}
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
              className="absolute -right-1 -top-1 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-navy-950/90 text-slate-500 transition-colors hover:border-neon-cyan/35 hover:text-neon-cyan"
              aria-label="Close dossier"
            >
              <X size={16} strokeWidth={2} />
            </button>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-950/90 shadow-[0_0_60px_rgba(0,245,255,0.05)] backdrop-blur-2xl">
              {/* ── Header ──────────────────────────────────────────────── */}
              <div className="relative border-b border-white/10 p-6 md:p-8">
                <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/35 to-transparent" />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-1 font-semibold",
                          hudType.monoPill,
                          project.status === "classified"
                            ? "border-neon-cyan/25 bg-neon-cyan/10 text-neon-cyan/85"
                            : "border-neon-green/25 bg-neon-green/10 text-neon-green/85",
                        )}
                      >
                        <Shield size={10} strokeWidth={2} aria-hidden />
                        {project.status === "classified" ? "Classified" : "Active"}
                      </span>
                      {project.featured && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-neon-purple/20 bg-neon-purple/10 px-2 py-1 text-neon-purple/85",
                            hudType.monoPill,
                          )}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    <h2
                      id="dossier-title"
                      className="mb-3 font-display text-2xl font-bold leading-tight tracking-tight text-slate-100 md:text-3xl"
                    >
                      {project.title}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag} label={tag} color={project.category === "ai" ? "purple" : "cyan"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Body ────────────────────────────────────────────────── */}
              <div className="space-y-8 p-6 md:p-8">
                <section>
                  <div className={hudType.dossierSection}>
                    <FileText size={14} className="shrink-0 text-slate-500" aria-hidden />
                    <span className={hudType.overline}>Mission brief</span>
                  </div>
                  <p className={hudType.dossierBody}>{project.dossier?.fullDescription ?? project.description}</p>
                </section>

                <div className={cn(hudType.impactStrip, "max-w-full")}>
                  <Target size={14} className="shrink-0 text-neon-purple/65" aria-hidden />
                  {project.impact}
                </div>

                {project.dossier?.results && (
                  <section>
                    <div className={cn(hudType.dossierSection, "mb-4")}>
                      <Target size={14} className="shrink-0 text-slate-500" aria-hidden />
                      <span className={hudType.overline}>Quantified results</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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

                {project.dossier?.debrief && (
                  <section>
                    <div className={cn(hudType.dossierSection, "mb-4")}>
                      <BookOpen size={14} className="shrink-0 text-slate-500" aria-hidden />
                      <span className={hudType.overline}>Debrief</span>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {project.dossier.debrief.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className={cn("flex items-start gap-3", hudType.dossierBody)}
                        >
                          <span className={cn(hudType.indexCounter, "mt-0.5 w-5 shrink-0 text-neon-cyan/45")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                )}

                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={hudType.linkChip}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
