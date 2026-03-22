import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Zap, Download, ChevronRight } from "lucide-react";
import { bio } from "@/data/bio";
import { useNavigation, NAV_SECTIONS } from "@/components/hud/NavigationProvider";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { scrollTo } = useNavigation();
  const jumpLinks = NAV_SECTIONS.filter((s) => s.id !== "home");

  return (
    <footer
      className="relative mt-12 md:mt-16 border-t border-neon-cyan/15 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950/80 py-12 md:py-16"
      role="contentinfo"
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-xl h-px bg-gradient-to-r from-transparent via-neon-cyan/35 to-transparent"
        aria-hidden
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* HUD corners */}
        <span className="absolute -top-1 left-0 w-3 h-3 border-l border-t border-neon-cyan/25 rounded-tl" aria-hidden />
        <span className="absolute -top-1 right-0 w-3 h-3 border-r border-t border-neon-cyan/25 rounded-tr" aria-hidden />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Brand + status */}
          <div className="max-w-md">
            <p className="text-xs font-mono text-neon-cyan/60 tracking-[0.2em] uppercase mb-2">Uplink OS</p>
            <p className="text-lg font-display font-bold text-slate-100 tracking-tight">{bio.name}</p>
            <p className="text-sm text-slate-500 mt-1 font-mono">{bio.headline}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 font-mono">
              <motion.span
                className="w-2 h-2 rounded-full bg-neon-cyan shrink-0"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              <span>System online</span>
              <span className="text-slate-700">·</span>
              <span>{bio.location}</span>
              <span className="text-slate-700">·</span>
              <span>{currentYear}</span>
            </div>
          </div>

          {/* Quick nav */}
          <nav className="flex flex-col gap-3" aria-label="Footer section links">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Jump</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
              {jumpLinks.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className="group flex items-center gap-1 text-left text-xs font-mono text-slate-500 hover:text-neon-cyan transition-colors"
                  >
                    <ChevronRight
                      size={12}
                      className="text-neon-cyan/0 group-hover:text-neon-cyan/70 transition-colors shrink-0"
                    />
                    <span className="text-neon-cyan/40 mr-0.5 tabular-nums">{s.code}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Channels</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={bio.resumePdf}
                download
                className="p-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all"
                aria-label="Download Resume"
                title="Download Resume"
              >
                <Download size={18} />
              </a>
              {bio.githubUrl && (
                <a
                  href={bio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              )}
              {bio.linkedinUrl && (
                <a
                  href={bio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {bio.twitterUrl && (
                <a
                  href={bio.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
              <a
                href={`mailto:${bio.email}`}
                className="p-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-mono">
          <span>
            &copy; {currentYear} {bio.name}. All rights reserved.
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Zap size={12} className="text-neon-cyan/45" />
            React 19 · Three.js · Tailwind v4 · Uplink Protocol v2.1
          </span>
        </div>
      </div>
    </footer>
  );
}
