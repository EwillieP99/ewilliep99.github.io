import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Zap, Leaf, Sun } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useGlitch } from "@/hooks/useGlitch";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/App";

const NAV_LINKS = [
  { id: "about", label: "Profile" },
  { id: "timeline", label: "Chrono" },
  { id: "augmentations", label: "Skills" },
  { id: "projects", label: "Missions" },
  { id: "contact", label: "Uplink" },
];

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onTerminalOpen: () => void;
}

export function Navbar({ theme, onThemeChange, onTerminalOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(NAV_LINKS.map((l) => l.id));
  const { glitchClass } = useGlitch(true);

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

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const themeIcons: Record<ThemeMode, { icon: typeof Zap; label: string }> = {
    neon: { icon: Zap, label: "Neon" },
    matrix: { icon: Leaf, label: "Matrix" },
    overdrive: { icon: Sun, label: "Overdrive" },
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ["neon", "matrix", "overdrive"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    onThemeChange(next);
  };

  const ThemeIcon = themeIcons[theme].icon;

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-navy-950/85 backdrop-blur-2xl border-b border-neon-cyan/10"
            : "bg-transparent",
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
              "text-sm font-bold tracking-[0.25em] gradient-text uppercase font-display",
              "hover:opacity-90 transition-opacity",
              glitchClass,
            )}
            aria-label="Scroll to top"
          >
            {bio.initials}
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={cn("nav-link", activeId === link.id && "active")}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              aria-label={`Switch theme (current: ${theme})`}
              title={`Theme: ${themeIcons[theme].label}`}
            >
              <ThemeIcon size={16} />
            </button>

            {/* Terminal button */}
            <button
              onClick={onTerminalOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-neon-cyan/80 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all"
            >
              <TerminalIcon size={14} />
              Terminal
            </button>

            {/* Resume */}
            <a
              href={bio.resumePdf}
              download
              className="btn-ghost text-xs py-2 px-4"
            >
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-neon-cyan"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-px bg-neon-cyan"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-neon-cyan"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-navy-950/95 backdrop-blur-2xl md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link.id)}
                className="text-2xl font-semibold text-slate-200 hover:text-neon-cyan transition-colors font-display"
              >
                {link.label}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.07 }}
              className="flex gap-3 mt-4"
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
