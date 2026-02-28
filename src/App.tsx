import { useState, useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Terminal } from "@/components/ui/Terminal";
import { NeonCursor } from "@/components/ui/NeonCursor";
import { Scanline } from "@/components/effects/Scanline";
import { MatrixRain } from "@/components/effects/MatrixRain";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Theme modes: neon (default), matrix (green), overdrive (max glow)
export type ThemeMode = "neon" | "matrix" | "overdrive";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("neon");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { x, y } = useMousePosition();
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

  // Theme-based glow color
  const glowColor = {
    neon: "rgba(0,245,255,0.08)",
    matrix: "rgba(34,197,94,0.08)",
    overdrive: "rgba(244,114,182,0.12)",
  }[theme];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 relative">
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

      {/* Cursor-following glow (desktop only) */}
      {!prefersReduced && (
        <div
          className="fixed inset-0 pointer-events-none z-[2] hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Matrix rain (only in matrix mode) */}
      {theme === "matrix" && <MatrixRain />}

      {/* Scanline overlay */}
      <Scanline />

      {/* Custom cursor */}
      <NeonCursor />

      {/* Navigation */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        onTerminalOpen={() => setTerminalOpen(true)}
      />

      {/* Interactive terminal */}
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
