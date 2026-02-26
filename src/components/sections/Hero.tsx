import { lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Download, Calendar } from "lucide-react";
import { bio } from "@/data/bio";
import { Button } from "@/components/ui/Button";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GlitchText } from "@/components/effects/GlitchText";
import { ParticleField } from "@/components/effects/ParticleField";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeUpItem } from "@/lib/animations";

// Lazy-load the 3D scene to keep initial bundle small
const HeroScene = lazy(() =>
  import("@/components/3d/HeroScene").then((m) => ({ default: m.HeroScene }))
);

const container = staggerContainer;
const item = fadeUpItem;

export function Hero() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* 3D Scene (desktop only, lazy-loaded) */}
      <div className="hidden lg:block">
        <ErrorBoundary fallback={<ParticleField count={60} />}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Mobile/tablet particle fallback */}
      <div className="lg:hidden">
        <ParticleField count={40} showConnections={false} />
      </div>

      {/* Gradient background overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,245,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Hero content — parallax on scroll */}
      <motion.div
        className="relative z-10 max-w-3xl"
        variants={container}
        initial="hidden"
        animate="visible"
        style={prefersReduced ? {} : { opacity: heroOpacity, y: heroY }}
      >
        {/* Eyebrow */}
        <motion.div variants={item} className="mb-4">
          <span className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-neon-cyan/60">
            {bio.university} · {bio.major} · {bio.location}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1 variants={item} className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4 font-display">
          <GlitchText delay={800} hover>
            <span className="gradient-text">{bio.name}</span>
          </GlitchText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={item} className="text-lg sm:text-xl font-mono text-neon-cyan/80 mb-2 tracking-wider">
          <span className="text-neon-purple">[</span>
          {" "}{bio.headline}{" "}
          <span className="text-neon-purple">]</span>
        </motion.p>

        {/* One-liner */}
        <motion.p variants={item} className="text-xl sm:text-2xl font-light text-slate-300 leading-relaxed mb-3">
          {bio.heroOneLiner}
        </motion.p>

        {/* Sub-line */}
        <motion.p variants={item} className="text-sm text-slate-500 mb-10">
          {bio.heroSub}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="neon"
            href={bio.resumePdf}
            download
            icon={<Download size={16} />}
          >
            Download Resume
          </Button>
          <Button
            variant="ghost"
            href={bio.calendlyUrl}
            icon={<Calendar size={16} />}
          >
            Book Time
          </Button>
        </motion.div>

        {/* Impact stats ticker */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "$110K", label: "ARR Generated" },
            { value: "400+", label: "Users Driven" },
            { value: "67%", label: "Conversion Rate" },
            { value: "500+", label: "Attendees" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-neon-cyan text-glow-cyan font-display">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 font-mono mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs text-slate-600 font-mono tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-neon-cyan/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
