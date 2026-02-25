import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { meta } from "../../data/meta.js";

// ─── EDIT THIS ────────────────────────────────────────────────────────────────
const REEL_TAGLINE = "Here's what I'm about.";
const REEL_SUB =
  "A quick look at how I operate — building communities, running programs, and making things move.";
// ─────────────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

export function Reel() {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleEnded = () => setPlaying(false);

  return (
    <section id="reel" className="max-w-4xl mx-auto px-6 py-16">
      <AnimatedSection className="text-center mb-10">
        <span className="text-xs font-mono text-accent-cyan/70 uppercase tracking-[0.2em]">
          Highlight Reel
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-2 mb-3">
          {REEL_TAGLINE}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">{REEL_SUB}</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        {/* Outer glow ring */}
        <div className="relative rounded-2xl p-px"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.4), rgba(168,85,247,0.2), rgba(34,211,238,0.2))",
          }}
        >
          {/* Glass card wrapper */}
          <div className="relative rounded-2xl overflow-hidden bg-navy-900/80 backdrop-blur-md">
            {/* Video element */}
            <div
              className="relative w-full cursor-pointer"
              style={{ aspectRatio: "16/9" }}
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                src="/assets/videos/aiclubhipergatortour.mp4"
                poster={meta.avatar}   // uses your headshot as thumbnail; swap to a poster image if you have one
                preload="metadata"
                playsInline
                onCanPlay={() => setLoaded(true)}
                onEnded={handleEnded}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay — fades out when playing */}
              <AnimatePresence>
                {!playing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(6,8,24,0.85) 0%, rgba(6,8,24,0.4) 50%, rgba(6,8,24,0.2) 100%)",
                    }}
                  >
                    {/* Play button */}
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handlePlay(); }}
                      className="flex items-center justify-center w-20 h-20 rounded-full text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(56,189,248,0.9), rgba(168,85,247,0.9))",
                        boxShadow: "0 0 48px rgba(56,189,248,0.4)",
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Play highlight reel"
                    >
                      <PlayIcon />
                    </motion.button>

                    {!loaded && (
                      <p className="text-xs text-slate-400 font-mono mt-4 tracking-wide">
                        Loading…
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pause indicator — briefly flashes when paused mid-video */}
              <AnimatePresence>
                {!playing && loaded && (
                  <motion.div
                    key="paused-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}   /* invisible — play button handles it */
                    className="absolute bottom-4 right-4 text-xs font-mono text-slate-500"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom bar with native controls */}
            <div className="px-4 py-2 border-t border-white/6 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">{meta.name} · Highlight Reel</span>
              <span className="text-xs text-slate-600 font-mono">click to pause · scroll on</span>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
