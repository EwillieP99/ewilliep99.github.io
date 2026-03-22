import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon,
  Zap,
  Grid3x3,
  Sun,
  Flame,
  GraduationCap,
  Bot,
  Menu,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigation, NAV_SECTIONS } from "./NavigationProvider";
import { GlitchText } from "@/components/effects/GlitchText";
import { Magnetic } from "@/components/ui/Magnetic";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/lib/theme";

// ═══════════════════════════════════════════════════════════════════════════════
// TOP COMMAND BAR — Persistent cyberpunk Operator HUD navigation
// ═══════════════════════════════════════════════════════════════════════════════

interface TopCommandBarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onTerminalOpen: () => void;
}

const THEME_MENU: { id: ThemeMode; label: string; icon: typeof Zap }[] = [
  { id: "neon", label: "Neon", icon: Zap },
  { id: "matrix", label: "Matrix", icon: Grid3x3 },
  { id: "clean", label: "Clean", icon: Sun },
  { id: "gator", label: "Gator", icon: GraduationCap },
  { id: "ember", label: "Ember", icon: Flame },
];

export function TopCommandBar({ theme, onThemeChange, onTerminalOpen }: TopCommandBarProps) {
  const { activeId, scrollTo } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setThemeMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!themeMenuOpen) return;
    const onPointerDown = (ev: MouseEvent) => {
      if (themeMenuRef.current?.contains(ev.target as Node)) return;
      setThemeMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [themeMenuOpen]);

  const modKey = useMemo(() => {
    if (typeof navigator === "undefined") return "⌘";
    return /Mac|iPhone|iPad/.test(navigator.userAgent || "") ? "⌘" : "Ctrl";
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const currentThemeMeta = THEME_MENU.find((t) => t.id === theme) ?? THEME_MENU[0];
  const ThemeIcon = currentThemeMeta.icon;

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      {/* ── Desktop + Mobile Top Bar ──────────────────────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          "w-[96%] max-w-7xl mt-2 rounded-2xl",
          "border backdrop-blur-2xl",
          scrolled
            ? "bg-navy-950/86 border-neon-cyan/20 shadow-[0_0_24px_rgba(0,245,255,0.08)]"
            : "bg-navy-950/65 border-neon-cyan/10",
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

        <nav
          className="flex items-center justify-between h-14 px-4 md:px-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ── Left: Logo + Status ─────────────────────────────────────── */}
          <Magnetic className="inline-flex shrink-0" innerClassName="inline-flex">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 group"
            aria-label="Scroll to top"
          >
            <GlitchText className="text-xs font-bold tracking-[0.25em] text-neon-cyan font-display uppercase">
              UPLINK OS
            </GlitchText>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neon-green/80 uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
              </span>
              Online
            </span>
          </button>
          </Magnetic>

          {/* ── Center: Nav Pills (desktop) ────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <Magnetic key={section.id} className="inline-flex" innerClassName="inline-flex">
                <button
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "relative px-3 py-1.5 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase transition-all duration-300",
                    isActive
                      ? "text-neon-cyan bg-neon-cyan/10"
                      : "text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/6",
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
                    <span className="text-neon-cyan/45 mr-1">{section.code}</span>
                  {section.label}
                </button>
                </Magnetic>
              );
            })}
          </div>

          {/* ── Right: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme picker */}
            <div className="relative" ref={themeMenuRef}>
              <Magnetic className="inline-flex" innerClassName="inline-flex">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={themeMenuOpen}
                aria-label={`Theme: ${currentThemeMeta.label}. Choose appearance`}
                onClick={() => setThemeMenuOpen((o) => !o)}
                className="flex items-center gap-0.5 rounded-lg p-2 text-slate-400 transition-all hover:bg-neon-cyan/10 hover:text-neon-cyan"
              >
                <ThemeIcon size={15} strokeWidth={2} aria-hidden />
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={cn("opacity-70 transition-transform", themeMenuOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              </Magnetic>
              {themeMenuOpen && (
                <div
                  role="menu"
                  aria-label="Site appearance"
                  className="absolute right-0 top-full z-[70] mt-2 min-w-[12.75rem] rounded-xl border border-white/10 bg-navy-950/95 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  {THEME_MENU.map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px] font-mono transition-all rounded-md border border-transparent",
                          active
                            ? "bg-neon-cyan/12 text-neon-cyan"
                            : "text-slate-300 hover:border-neon-cyan/15 hover:shadow-neon-cyan-soft hover:text-slate-100",
                        )}
                        onClick={() => {
                          onThemeChange(opt.id);
                          setThemeMenuOpen(false);
                        }}
                      >
                        <Icon size={15} strokeWidth={2} className="shrink-0 opacity-85" aria-hidden />
                        <span className="flex-1">{opt.label}</span>
                        {active && <Check size={14} strokeWidth={2} className="shrink-0 text-neon-cyan" aria-hidden />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terminal button (desktop) */}
            <Magnetic className="hidden md:inline-flex" innerClassName="inline-flex">
            <button
              onClick={onTerminalOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-neon-cyan/80 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all"
            >
              <TerminalIcon size={13} />
              Terminal
            </button>
            </Magnetic>

            {/* Echo (desktop) — primary entry on md+ */}
            <Magnetic className="hidden md:inline-flex" innerClassName="inline-flex">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-echo"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-neon-purple/90 border border-neon-purple/30 hover:bg-neon-purple/10 hover:text-neon-purple transition-all"
            >
              <Bot size={13} />
              <span>Ask Echo</span>
              <kbd className="hidden lg:inline text-[9px] font-normal text-slate-500 border border-white/10 rounded px-1 py-0.5">
                {modKey}K
              </kbd>
            </button>
            </Magnetic>

            {/* Resume (desktop) */}
            <Magnetic className="hidden md:inline-flex" innerClassName="inline-flex">
            <a
              href={bio.resumePdf}
              download
              className="btn-ghost text-[11px] py-1.5 px-3"
            >
              Resume
            </a>
            </Magnetic>

            {/* Mobile hamburger */}
            <Magnetic className="lg:hidden inline-flex" innerClassName="inline-flex">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-lg text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              onClick={() => {
                setThemeMenuOpen(false);
                setMenuOpen(!menuOpen);
              }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            </Magnetic>
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
                  <Magnetic key={section.id} className="inline-flex" innerClassName="inline-flex">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => handleNavClick(section.id)}
                    className={cn(
                      "flex items-center gap-3 text-xl font-display font-semibold transition-all",
                      isActive ? "text-neon-cyan text-glow-cyan" : "text-slate-300 hover:text-neon-cyan",
                    )}
                  >
                    <span className="text-sm font-mono text-neon-cyan/40">{section.code}</span>
                    {section.label}
                  </motion.button>
                  </Magnetic>
                );
              })}
            </div>

            {/* Mobile actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_SECTIONS.length * 0.06 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              <Magnetic className="inline-flex" innerClassName="inline-flex">
              <button
                onClick={() => { onTerminalOpen(); setMenuOpen(false); }}
                className="btn-ghost text-sm py-2 px-4"
              >
                <TerminalIcon size={16} />
                Terminal
              </button>
              </Magnetic>
              <Magnetic className="inline-flex" innerClassName="inline-flex">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-echo"));
                  setMenuOpen(false);
                }}
                className="btn-ghost text-sm py-2 px-4"
              >
                <Bot size={16} />
                Ask Echo
              </button>
              </Magnetic>
              <Magnetic className="inline-flex" innerClassName="inline-flex">
              <a href={bio.resumePdf} download className="btn-neon text-sm">
                Resume
              </a>
              </Magnetic>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
