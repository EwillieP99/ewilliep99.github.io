import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Zap, Download } from "lucide-react";
import { bio } from "@/data/bio";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neon-cyan/10 py-10 mt-24 relative" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main footer content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: System status line */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
            <motion.span
              className="w-2 h-2 rounded-full bg-neon-cyan"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span>System Online</span>
            <span className="text-slate-700">·</span>
            <span>Built in {bio.location}</span>
            <span className="text-slate-700">·</span>
            <span>{currentYear}</span>
          </div>

          {/* Right: Social links + resume */}
          <div className="flex items-center gap-4">
            <a
              href={bio.resumePdf}
              download
              className="text-slate-500 hover:text-neon-cyan transition-colors"
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
                className="text-slate-500 hover:text-neon-cyan transition-colors"
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
                className="text-slate-500 hover:text-neon-cyan transition-colors"
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
                className="text-slate-500 hover:text-neon-cyan transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            )}
            <a
              href={`mailto:${bio.email}`}
              className="text-slate-500 hover:text-neon-cyan transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-mono">
          <span>
            &copy; {currentYear} {bio.name}. All rights reserved.
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={12} className="text-neon-cyan/40" />
            Powered by React 19 · Three.js · Uplink Protocol v2.0
          </span>
        </div>
      </div>
    </footer>
  );
}
