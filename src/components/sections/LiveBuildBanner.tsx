import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { bio } from "@/data/bio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

function FocusTicker({ lines }: { lines: readonly string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % lines.length), 3200);
    return () => clearInterval(t);
  }, [lines.length]);
  return (
    <div className="h-5 overflow-hidden text-left">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease }}
          className="text-xs font-mono text-neon-green/85 line-clamp-1"
        >
          &gt; {lines[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/** Resonate callout under #home — motion-forward, no section id */
export function LiveBuildBanner() {
  const s = bio.featuredSpotlight;
  const scrollTo = () =>
    document.getElementById(s.scrollToId)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative z-10 px-6 pt-2 pb-8 md:pt-4 md:pb-12">
      <AnimatedSection className="max-w-3xl mx-auto">
        <motion.button
          type="button"
          onClick={scrollTo}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
          whileHover={{ y: -3, transition: { duration: 0.28, ease } }}
          whileTap={{ scale: 0.992 }}
          className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.14] bg-navy-950/80 backdrop-blur-xl text-left shadow-[0_0_0_1px_rgba(0,245,255,0.07),0_24px_56px_-24px_rgba(0,0,0,0.7)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(0,245,255,0.2),0_28px_64px_-20px_rgba(0,245,255,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
          aria-label={`${s.ctaLabel}: ${s.title}`}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.5 }}
            style={{
              background:
                "radial-gradient(900px circle at 15% 0%, rgba(34,197,94,0.11), transparent 42%), radial-gradient(700px circle at 92% 85%, rgba(0,245,255,0.1), transparent 48%)",
            }}
          />

          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.25), transparent 40%, rgba(168,85,247,0.2))",
            }}
          />

          <div className="hud-bracket hud-bracket-tl pointer-events-none opacity-80" />
          <div className="hud-bracket hud-bracket-tr pointer-events-none opacity-80" />
          <div className="hud-bracket hud-bracket-bl pointer-events-none opacity-80" />
          <div className="hud-bracket hud-bracket-br pointer-events-none opacity-80" />

          <div className="relative px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">
              <motion.div
                className="flex-1 min-w-0 space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green shadow-[0_0_14px_#22c55e]" />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-neon-green font-semibold">
                    {s.badge}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600" aria-hidden>
                    <span className="h-px w-8 bg-gradient-to-r from-neon-green/40 to-transparent" />
                    <Sparkles size={12} className="text-neon-cyan/40" />
                  </span>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-2">
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight leading-[1.15]">
                      <span className="text-neon-purple/50">[</span>
                      {s.title}
                      <span className="text-neon-purple/50">]</span>
                    </p>
                    <p className="text-sm sm:text-[15px] font-medium text-neon-cyan/85 mt-2 leading-snug">
                      {s.tagline}
                    </p>
                  </div>
                  <p className="text-[15px] sm:text-base text-slate-300 leading-[1.65] max-w-prose">
                    {s.description}
                  </p>
                </motion.div>

                <motion.ul
                  variants={fadeUp}
                  className="flex flex-wrap gap-2 pt-1"
                  aria-label="Highlights"
                >
                  {s.highlights.map((h, idx) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.12 + idx * 0.05, duration: 0.35, ease }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <span className="inline-flex items-center rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-slate-300 group-hover:border-neon-cyan/25 group-hover:text-slate-200 transition-colors">
                        {h}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="inline-flex items-center rounded-md border border-neon-cyan/15 bg-neon-cyan/[0.06] px-2 py-0.5 text-[11px] font-mono font-medium text-neon-cyan/80"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-3"
                >
                  <p className="type-overline !mb-2 !text-slate-500">Currently shipping</p>
                  <FocusTicker lines={bio.currentFocus} />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15, ease }}
                className="flex lg:flex-col items-center justify-center gap-4 lg:gap-3 lg:border-l lg:border-white/[0.1] lg:pl-10 shrink-0"
              >
                <motion.div
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/15 to-transparent text-neon-cyan shadow-[0_0_24px_rgba(0,245,255,0.12)]"
                >
                  <Layers size={26} strokeWidth={1.5} aria-hidden />
                </motion.div>
                <div className="text-center lg:text-center max-w-[9rem]">
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 leading-relaxed">
                    Mission
                    <br />
                    archive
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-6 pt-5 border-t border-white/[0.1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="min-w-0 text-left">
                <p className="font-mono text-xs sm:text-[13px] font-semibold text-neon-cyan tracking-wide uppercase">
                  {s.ctaLabel}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{s.ctaHint}</p>
              </div>
              <motion.span
                className="flex h-11 w-11 items-center justify-center self-end sm:self-auto rounded-xl border border-white/[0.12] bg-white/[0.04] text-neon-cyan"
                whileHover={{
                  scale: 1.06,
                  borderColor: "rgba(0,245,255,0.45)",
                  backgroundColor: "rgba(0,245,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </motion.span>
            </motion.div>
          </div>
        </motion.button>
      </AnimatedSection>
    </div>
  );
}
