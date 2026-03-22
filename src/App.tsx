import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { LazyMotion, domMax, motion } from "framer-motion";
import { NavigationProvider } from "@/components/hud/NavigationProvider";
import { TopCommandBar } from "@/components/hud/TopCommandBar";
import { VerticalTimeline } from "@/components/hud/VerticalTimeline";
import { Hero } from "@/components/sections/Hero";
import { LiveBuildBanner } from "@/components/sections/LiveBuildBanner";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Games } from "@/components/sections/Games";
import { Contact } from "@/components/sections/Contact";
import { AIHub } from "@/components/sections/AIHub";
import { Footer } from "@/components/sections/Footer";
import { Terminal } from "@/components/ui/Terminal";
import { NeonCursor } from "@/components/ui/NeonCursor";
import { Scanline } from "@/components/effects/Scanline";
import { MatrixRain } from "@/components/effects/MatrixRain";
import EchoAI from "@/components/echo/EchoAI";
import { Toaster } from "sonner";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { useMouseGlow } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  THEME_ORDER,
  THEME_STORAGE_KEY,
  isLightTheme,
  parseSavedTheme,
  type ThemeMode,
} from "@/lib/theme";

// Lazy-load ambient background effects (not critical for initial render)
const DataStream = lazy(() => import("@/components/effects/DataStream").then((m) => ({ default: m.DataStream })));
const CircuitGrid = lazy(() => import("@/components/effects/CircuitGrid").then((m) => ({ default: m.CircuitGrid })));

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => parseSavedTheme(localStorage.getItem(THEME_STORAGE_KEY)));
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixRainDensity, setMatrixRainDensity] = useState(0.6);
  const echoMoodTimeoutRef = useRef(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onEchoMood = (e: Event) => {
      const mood = (e as CustomEvent<{ mood: "hype" | "calm" | "focus" }>).detail?.mood ?? "focus";
      const next =
        mood === "hype" ? 0.92 : mood === "calm" ? 0.28 : 0.74;
      window.clearTimeout(echoMoodTimeoutRef.current);
      setMatrixRainDensity(next);
      echoMoodTimeoutRef.current = window.setTimeout(() => setMatrixRainDensity(0.6), 2600);
    };
    window.addEventListener("echo-mood", onEchoMood);
    return () => {
      window.removeEventListener("echo-mood", onEchoMood);
      window.clearTimeout(echoMoodTimeoutRef.current);
    };
  }, []);

  // Theme changes from terminal (`theme`, `matrix`, `theme <name>`)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail === "toggle-matrix") {
        setTheme((prev) => (prev === "matrix" ? "neon" : "matrix"));
      } else if (detail === "cycle") {
        setTheme((prev) => THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length]);
      } else if (detail?.startsWith("set:")) {
        const next = detail.slice(4) as ThemeMode;
        if (
          next === "neon" ||
          next === "matrix" ||
          next === "clean" ||
          next === "ember" ||
          next === "gator"
        ) {
          setTheme(next);
        }
      }
    };
    window.addEventListener("toggle-theme", handler);
    return () => window.removeEventListener("toggle-theme", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Theme-based glow color — ref-based to avoid re-renders
  const glowColor = {
    neon: "rgba(0,245,255,0.08)",
    matrix: "rgba(34,197,94,0.08)",
    clean: "rgba(56,189,248,0.06)",
    gator: "rgba(250,70,22,0.06)",
    ember: "rgba(251,146,60,0.09)",
  }[theme];
  const glowRef = useMouseGlow(glowColor);

  const isClean = isLightTheme(theme);
  const sonnerTheme = isClean ? "light" : "dark";

  return (
    <LazyMotion features={domMax}>
    <NavigationProvider>
      <div className="min-h-screen bg-navy-950 text-slate-200 relative" data-theme={theme}>
        {/* Skip to content — visible only on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-neon-cyan focus:text-navy-950 focus:font-mono focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        {/* Fixed gradient background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: isClean
              ? theme === "gator"
                ? "linear-gradient(135deg, #faf8f5 0%, #eef2fb 42%, #e8f0fc 78%, #f7f4f0 100%)"
                : "linear-gradient(135deg, #eef2f7 0%, #e5eaf1 45%, #dce4ef 75%, #eef2f7 100%)"
              : theme === "matrix"
              ? "linear-gradient(135deg, #0a0f1e 0%, #0a1a10 45%, #0a150a 75%, #0a0f1e 100%)"
              : theme === "ember"
              ? "linear-gradient(135deg, #12080c 0%, #1a0c10 38%, #2a1418 72%, #140a0e 100%)"
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
        {theme === "matrix" && <MatrixRain density={matrixRainDensity} />}

        {/* Ambient background effects (lazy-loaded, hidden in clean mode) */}
        {!isClean && (
          <Suspense fallback={null}>
            <CircuitGrid />
            <DataStream />
          </Suspense>
        )}

        {/* Scanline overlay */}
        {!isClean && <Scanline />}

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

        {/* Main content — staged entrance + section rhythm */}
        <motion.div
          className="relative z-10"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <main id="main-content" className="relative" role="main" aria-label="Portfolio content">
            <Hero />
            <LiveBuildBanner />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Timeline />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Games />
            <SectionDivider />
            <Contact />
            <SectionDivider />
            <AIHub />
          </main>

          <Footer />
        </motion.div>
        <EchoAI />
        <Toaster position="top-right" theme={sonnerTheme} richColors />
      </div>
    </NavigationProvider>
    </LazyMotion>
  );
}
