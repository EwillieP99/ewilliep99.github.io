import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Zap, Leaf, Sun, Menu, X } from "lucide-react";
import { useNavigation, NAV_SECTIONS } from "./NavigationProvider";
import { GlitchText } from "@/components/effects/GlitchText";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/App";

// ═══════════════════════════════════════════════════════════════════════════════
// TOP COMMAND BAR — Persistent cyberpunk Operator HUD navigation
// ═══════════════════════════════════════════════════════════════════════════════

interface TopCommandBarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onTerminalOpen: () => void;
}

export function TopCommandBar({ theme, onThemeChange, onTerminalOpen }: TopCommandBarProps) {
  const { activeId, scrollTo } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const themeIcons: Record<ThemeMode, { icon: typeof Zap; label: string }> = {
    neon: { icon: Zap, label: "Neon" },
    matrix: { icon: Leaf, label: "Matrix" },
    clean: { icon: Sun, label: "Clean" },
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ["neon", "matrix", "clean"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    onThemeChange(next);
  };

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  const ThemeIcon = themeIcons[theme].icon;

  return (
    <>
      {/* ── Desktop + Mobile Top Bar ──────────────────────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          "w-[96%] max-w-7xl mt-2 rounded-xl",
          "border backdrop-blur-2xl",
          scrolled
            ? "bg-navy-950/90 border-neon-cyan/20 shadow-[0_0_30px_rgba(0,245,255,0.08)]"
            : "bg-navy-950/60 border-neon-cyan/10",
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated top edge glow */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

        <nav
          className="flex items-center justify-between h-14 px-4 md:px-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ── Left: Logo + Status ─────────────────────────────────────── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Scroll to top"
          >
            <GlitchText className="text-xs font-bold tracking-[0.25em] text-neon-cyan font-display uppercase">
              NEON OPERATOR
            </GlitchText>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neon-green/80 uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
              </span>
              Online
            </span>
          </button>

          {/* ── Center: Nav Pills (desktop) ────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "relative px-3 py-1.5 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase transition-all duration-300",
                    isActive
                      ? "text-neon-cyan bg-neon-cyan/10"
                      : "text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/5",
                  )}
                >
                  {/* Active underline glow */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 left-2 right-2 h-px bg-neon-cyan shadow-[0_0_8px_rgba(0,245,255,0.6)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-neon-cyan/50 mr-1">{section.code}</span>
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* ── Right: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              aria-label={`Switch theme (current: ${theme})`}
              title={`Theme: ${themeIcons[theme].label}`}
            >
              <ThemeIcon size={15} />
            </button>

            {/* Terminal button (desktop) */}
            <button
              onClick={onTerminalOpen}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-neon-cyan/80 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all"
            >
              <TerminalIcon size={13} />
              Terminal
            </button>

            {/* Transmission button (desktop) — scrolls to Uplink */}
            <button
              onClick={() => handleNavClick("contact")}
              className="hidden md:flex hud-transmission-btn items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-navy-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300"
            >
              TRANSMISSION
            </button>

            {/* Resume (desktop) */}
            <a
              href={bio.resumePdf}
              download
              className="hidden md:flex btn-ghost text-[11px] py-1.5 px-3"
            >
              Resume
            </a>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Full-Screen Menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-navy-950/98 backdrop-blur-2xl lg:hidden"
          >
            {/* Scanline effect in menu */}
            <div className="absolute inset-0 scanline-overlay opacity-50 pointer-events-none" />

            <div className="flex flex-col items-center gap-5">
              {NAV_SECTIONS.map((section, i) => {
                const isActive = activeId === section.id;
                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => handleNavClick(section.id)}
                    className={cn(
                      "flex items-center gap-3 text-xl font-display font-semibold transition-all",
                      isActive
                        ? "text-neon-cyan text-glow-cyan"
                        : "text-slate-300 hover:text-neon-cyan",
                    )}
                  >
                    <span className="text-sm font-mono text-neon-cyan/40">{section.code}</span>
                    {section.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_SECTIONS.length * 0.06 }}
              className="flex gap-3 mt-8"
            >
              <button
                onClick={() => { onTerminalOpen(); setMenuOpen(false); }}
                className="btn-ghost text-sm py-2 px-4"
              >
                <TerminalIcon size={16} />
                Terminal
              </button>
              <a href={bio.resumePdf} download className="btn-neon text-sm">
                Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
