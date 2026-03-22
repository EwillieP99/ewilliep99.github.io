import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Linkedin, Github, Twitter, Mail, Download, ImageIcon } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlitchText } from "@/components/effects/GlitchText";
import { bio, holoStats } from "@/data/bio";
import { navCodename } from "@/data/navSections";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE — Grouped credentials + clearer hierarchy
// ═══════════════════════════════════════════════════════════════════════════════

const CORE_DIRECTIVES = [
  "Revenue Systems > Random Effort",
  "AI Adoption Through Practical Delivery",
  "Execution With Measurable Outcomes",
] as const;

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
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
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(`${prefix}${isInt ? Math.round(current) : current.toFixed(1)}${postfix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function DirectiveRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CORE_DIRECTIVES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-7 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm font-mono text-neon-cyan/80 tracking-wider"
        >
          &gt; {CORE_DIRECTIVES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function HolographicPhoto() {
  return (
    <HoloCard padding="p-3" className="relative group">
      <div className="hud-bracket hud-bracket-tl" />
      <div className="hud-bracket hud-bracket-tr" />
      <div className="hud-bracket hud-bracket-bl" />
      <div className="hud-bracket hud-bracket-br" />

      <div className="relative overflow-hidden rounded-xl">
        <img
          src={bio.avatar}
          alt={`${bio.name} — ${bio.headline}`}
          className="w-full object-cover aspect-square"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-[scanLine_4s_linear_infinite] pointer-events-none" />
        <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
            </span>
            <span className="text-[10px] font-mono text-neon-green/80 uppercase tracking-wider">Active Operator</span>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1 pb-1">
        <GlitchText className="text-sm font-semibold text-slate-200 font-display">{bio.name}</GlitchText>
        <p className="text-xs text-neon-cyan/60 font-mono mt-0.5">
          {bio.major} · {bio.education.university}
        </p>
        <DirectiveRotator />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {holoStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={cn(
              "bg-navy-950/80 border border-neon-cyan/15 rounded-lg px-2.5 py-2 text-center",
              "hover:border-neon-cyan/40 hover:shadow-[0_0_12px_rgba(0,245,255,0.1)] transition-all duration-300",
            )}
          >
            <p className="text-sm font-bold text-neon-cyan font-display">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-[10px] text-slate-500 font-mono">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </HoloCard>
  );
}

export function About() {
  return (
    <section id="about" className="section-shell" aria-label="About section">
      <AnimatedSection>
        <SectionHeader
          codename={navCodename("about")}
          label="Profile"
          sub="Background, strengths, and measurable outcomes"
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">
        <AnimatedSection className="md:col-span-2" delay={0.05}>
          <HolographicPhoto />
        </AnimatedSection>

        <AnimatedSection className="md:col-span-3 flex flex-col gap-6" delay={0.1}>
          <div className="space-y-3">
            <p className="text-slate-300 leading-relaxed text-lg font-light">{bio.profileIntro}</p>
            <p className="text-slate-400 leading-relaxed">{bio.profileNarrative}</p>
          </div>

          {/* 2×2 image quadrant — swap placeholders for real assets (e.g. <img src={...} />) */}
          <div
            className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-xl"
            aria-label="Photo gallery placeholders"
          >
            {[1, 2, 3, 4].map((slot) => (
              <div
                key={slot}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden",
                  "border border-dashed border-neon-cyan/20 bg-navy-950/60",
                  "shadow-[inset_0_0_0_1px_rgba(0,245,255,0.04)]",
                )}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,245,255,0.04)_0%,transparent_45%,rgba(168,85,247,0.04)_100%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                  <ImageIcon className="w-6 h-6 text-slate-600" strokeWidth={1.25} aria-hidden />
                  <span className="text-[10px] font-mono tracking-widest text-slate-600 uppercase">
                    Slot {String(slot).padStart(2, "0")}
                  </span>
                </div>
                <span className="sr-only">Image placeholder {slot} of 4</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Credential bands — single scan-friendly row */}
      <div className="mt-12 md:mt-14 grid lg:grid-cols-3 gap-5 lg:gap-6">
        <AnimatedSection delay={0.06}>
          <HoloCard padding="p-5" className="h-full" glowColor="0, 245, 255">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-4">Impact metrics</p>
            <div className="grid grid-cols-2 gap-2.5">
              {bio.achievements.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:border-neon-cyan/25 transition-colors"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-lg font-display text-neon-cyan mt-0.5 tabular-nums">{item.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">{item.context}</p>
                </div>
              ))}
            </div>
          </HoloCard>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <HoloCard padding="p-5" className="h-full" glowColor="168, 85, 247">
            <p className="text-xs font-mono text-neon-purple/80 uppercase tracking-widest mb-4">Operating profile</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-mono text-neon-cyan/60 uppercase tracking-wider mb-2">Specializations</p>
                <ul className="flex flex-col gap-2" role="list">
                  {bio.specializations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="text-neon-cyan mt-1 flex-shrink-0 w-1 h-1 rounded-full bg-neon-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:border-l sm:border-white/8 sm:pl-5">
                <p className="text-[10px] font-mono text-neon-cyan/60 uppercase tracking-wider mb-2">Current focus</p>
                <ul className="space-y-2 text-xs text-slate-300">
                  {bio.currentFocus.map((focus) => (
                    <li key={focus} className="leading-relaxed">
                      <span className="text-neon-purple/50 mr-1">›</span>
                      {focus}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </HoloCard>
        </AnimatedSection>

        <AnimatedSection delay={0.14}>
          <HoloCard padding="p-5" className="h-full flex flex-col" glowColor="34, 197, 94">
            <p className="text-xs font-mono text-neon-green/75 uppercase tracking-widest mb-3">Education & uplink</p>
            <div className="flex-1">
              <p className="text-sm text-slate-200 font-semibold">{bio.education.degree}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {bio.education.university} · {bio.education.gradDate}
              </p>
              <p className="text-xs text-neon-cyan/80 mt-2">{bio.education.certificate}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {bio.education.certCourses.map((course) => (
                  <span
                    key={course}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple/80"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-5 mt-4 border-t border-white/8">
              <a
                href={bio.resumePdf}
                download
                className="btn-neon text-[11px] py-2 px-3 flex items-center gap-1.5"
                aria-label="Download resume"
              >
                <Download size={13} /> Resume
              </a>
              {bio.linkedinUrl && (
                <a
                  href={bio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-[11px] py-2 px-2.5 flex items-center gap-1"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin size={13} />
                </a>
              )}
              {bio.githubUrl && (
                <a
                  href={bio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-[11px] py-2 px-2.5 flex items-center gap-1"
                  aria-label="GitHub profile"
                >
                  <Github size={13} />
                </a>
              )}
              {bio.twitterUrl && (
                <a
                  href={bio.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-[11px] py-2 px-2.5 flex items-center gap-1"
                  aria-label="Twitter profile"
                >
                  <Twitter size={13} />
                </a>
              )}
              <a
                href={`mailto:${bio.email}`}
                className="btn-ghost text-[11px] py-2 px-2.5 flex items-center gap-1"
                aria-label="Send email"
              >
                <Mail size={13} />
              </a>
            </div>
          </HoloCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
