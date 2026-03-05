import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { NavigationProvider } from "@/components/hud/NavigationProvider";
import { TopCommandBar } from "@/components/hud/TopCommandBar";
import { VerticalTimeline } from "@/components/hud/VerticalTimeline";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Games } from "@/components/sections/Games";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Terminal } from "@/components/ui/Terminal";
import { NeonCursor } from "@/components/ui/NeonCursor";
import { Scanline } from "@/components/effects/Scanline";
import { MatrixRain } from "@/components/effects/MatrixRain";
import { useMouseGlow } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Lazy-load ambient background effects (not critical for initial render)
const DataStream = lazy(() => import("@/components/effects/DataStream").then((m) => ({ default: m.DataStream })));
const CircuitGrid = lazy(() => import("@/components/effects/CircuitGrid").then((m) => ({ default: m.CircuitGrid })));

// Theme modes: neon (default), matrix (green), overdrive (max glow)
export type ThemeMode = "neon" | "matrix" | "overdrive";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("neon");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  // Listen for theme toggle from terminal commands
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail === "matrix") {
        setTheme((prev) => (prev === "matrix" ? "neon" : "matrix"));
      }
    };
    window.addEventListener("toggle-theme", handler);
    return () => window.removeEventListener("toggle-theme", handler);
  }, []);

  // Theme-based glow color — ref-based to avoid re-renders
  const glowColor = {
    neon: "rgba(0,245,255,0.08)",
    matrix: "rgba(34,197,94,0.08)",
    overdrive: "rgba(244,114,182,0.12)",
  }[theme];
  const glowRef = useMouseGlow(glowColor);

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-navy-950 text-slate-200 relative">
        {/* Skip to content — visible only on keyboard focus */}
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-neon-cyan focus:text-navy-950 focus:font-mono focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        {/* Fixed gradient background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: theme === "matrix"
              ? "linear-gradient(135deg, #0a0f1e 0%, #0a1a10 45%, #0a150a 75%, #0a0f1e 100%)"
              : theme === "overdrive"
              ? "linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 45%, #2a0a1e 75%, #0a0f1e 100%)"
              : "linear-gradient(135deg, #0a0f1e 0%, #0d1942 45%, #1c1240 75%, #0a1838 100%)",
          }}
          aria-hidden="true"
        />

        {/* Cursor-following glow (desktop only, ref-based — no re-renders) */}
        {!prefersReduced && (
          <div
            ref={glowRef}
            className="fixed inset-0 pointer-events-none z-[2] hidden md:block"
            aria-hidden="true"
          />
        )}

        {/* Matrix rain (only in matrix mode) */}
        {theme === "matrix" && <MatrixRain />}

        {/* Ambient background effects (lazy-loaded) */}
        <Suspense fallback={null}>
          <CircuitGrid />
          <DataStream />
        </Suspense>

        {/* Scanline overlay */}
        <Scanline />

        {/* Custom cursor */}
        <NeonCursor />

        {/* ── Operator HUD ──────────────────────────────────────────────── */}
        <TopCommandBar
          theme={theme}
          onThemeChange={setTheme}
          onTerminalOpen={() => setTerminalOpen(true)}
        />
        <VerticalTimeline />

        {/* Interactive terminal */}
        <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

        {/* Main content */}
        <main className="relative z-10" role="main" aria-label="Portfolio content">
          <Hero />
          <About />
          <Timeline />
          <Skills />
          <Projects />
          <Games />
          <Contact />
        </main>

        <Footer />

        {/* Simple 2D Echo AI Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            y: [0, -12, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="fixed bottom-8 right-8 z-50 bg-black/90 backdrop-blur-2xl border border-[#00f3ff] rounded-3xl p-6 shadow-[0_0_45px_-5px] shadow-cyan-400 w-72 cursor-pointer hover:border-cyan-300 transition-all"
          onClick={() => alert("Echo AI: How can I assist you today, Operator?")}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-cyan-400 font-mono text-xs tracking-widest">ECHO AI • ONLINE</div>
          </div>
          <div className="text-white text-lg font-bold mb-2">Hello, Operator.</div>
          <p className="text-zinc-400 text-sm">
            I'm Echo. The guardian of the Neon Nexus.<br />
            How can I assist you today?
          </p>
          <div className="mt-5 text-[10px] font-mono text-cyan-500/70">
            NEURAL LINK • STABLE • 99.8%
          </div>
        </motion.div>
      </div>
    </NavigationProvider>
  );
}
