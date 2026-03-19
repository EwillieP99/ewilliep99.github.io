import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Linkedin, Github, Twitter, Mail, Download } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlitchText } from "@/components/effects/GlitchText";
import { bio, holoStats } from "@/data/bio";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// Core Directive taglines that rotate
// ═══════════════════════════════════════════════════════════════════════════════

const CORE_DIRECTIVES = [
  "Closing Tomorrow's Deals Today",
  "Bridging AI & Human Connection",
  "Building Systems That Scale",
] as const;

/** Animated number counter */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part
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
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(`${prefix}${isInt ? Math.round(current) : current.toFixed(1)}${postfix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

/** Core Directive tagline rotator */
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

/** Holographic photo card with floating stats and glitch border */
function HolographicPhoto() {
  return (
    <HoloCard padding="p-3" className="relative group">
      {/* HUD brackets */}
      <div className="hud-bracket hud-bracket-tl" />
      <div className="hud-bracket hud-bracket-tr" />
      <div className="hud-bracket hud-bracket-bl" />
      <div className="hud-bracket hud-bracket-br" />

      {/* Photo */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={bio.avatar}
          alt={`${bio.name} — ${bio.headline}`}
          className="w-full object-cover aspect-square"
          loading="lazy"
        />
        {/* Scan line overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-[scanLine_4s_linear_infinite] pointer-events-none" />
        {/* Color overlay on hover */}
        <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* HUD overlay — name + status in bottom corner */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
            </span>
            <span className="text-[10px] font-mono text-neon-green/80 uppercase tracking-wider">
              Active Operator
            </span>
          </div>
        </div>
      </div>

      {/* Name + title */}
      <div className="mt-3 px-1 pb-1">
        <GlitchText className="text-sm font-semibold text-slate-200 font-display">
          {bio.name}
        </GlitchText>
        <p className="text-xs text-neon-cyan/60 font-mono mt-0.5">
          {bio.major} · {bio.university}
        </p>
        <DirectiveRotator />
      </div>

      {/* Animated counter stat cards */}
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
    <section id="about" className="max-w-6xl mx-auto px-6 py-24" aria-label="About section">
      <AnimatedSection>
        <SectionHeader
          codename="// 01"
          label="Operator Profile"
          sub="Origin story + operating system"
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Holographic photo */}
        <AnimatedSection className="md:col-span-2" delay={0.05}>
          <HolographicPhoto />
        </AnimatedSection>

        {/* Story + traits */}
        <AnimatedSection className="md:col-span-3 flex flex-col gap-6" delay={0.1}>
          <p className="text-slate-300 leading-relaxed text-lg font-light">{bio.originStory}</p>
          <div className="text-slate-400 leading-relaxed space-y-3">
            <p>
              I sell, I build systems, and I get things across the finish line.
            </p>
            <p>
              That's not a tagline — it's what the numbers show.{" "}
              <span className="text-neon-cyan font-semibold">$110K in ARR</span> as a sales development intern at Geotarget.{" "}
              <span className="text-neon-cyan font-semibold">400+ new users</span> at Perplexity AI with a{" "}
              <span className="text-neon-cyan font-semibold">67% conversion rate</span> across 15 workshops. A{" "}
              <span className="text-neon-cyan font-semibold">500+ attendee</span> AI mixer that brought together 8 student orgs, 12 campus partners, and 5 industry sponsors.
            </p>
          </div>

          {/* Operating style card */}
          <HoloCard padding="p-5" glowColor="168, 85, 247">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
              Operating Style
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {bio.traits.map((trait, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-neon-cyan mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block" />
                  {trait}
                </motion.li>
              ))}
            </ul>
          </HoloCard>

          {/* Education badge */}
          <HoloCard padding="p-5" glowColor="168, 85, 247">
            <p className="text-xs font-mono text-neon-purple/70 uppercase tracking-widest mb-3">
              Education
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-200 font-semibold">{bio.education.degree}</p>
              <p className="text-xs text-slate-400">{bio.education.university} · {bio.education.gradDate}</p>
              <p className="text-xs text-neon-cyan/80 mt-1">{bio.education.certificate}</p>
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
          </HoloCard>

          {/* Social links + Resume download */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={bio.resumePdf}
              download
              className="btn-neon text-xs py-2 px-4 flex items-center gap-1.5"
              aria-label="Download resume"
            >
              <Download size={14} /> Download Resume
            </a>
            {bio.linkedinUrl && (
              <a
                href={bio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {bio.githubUrl && (
              <a
                href={bio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="GitHub profile"
              >
                <Github size={14} /> GitHub
              </a>
            )}
            {bio.twitterUrl && (
              <a
                href={bio.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="Twitter profile"
              >
                <Twitter size={14} /> Twitter/X
              </a>
            )}
            <a
              href={`mailto:${bio.email}`}
              className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
              aria-label="Send email"
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
