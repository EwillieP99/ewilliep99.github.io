import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Cpu, Trophy, Gamepad2 } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import type { Game } from "@/data/games";

// ═══════════════════════════════════════════════════════════════════════════════
// GAME LAUNCHER MODAL — Full-screen game view with sidebar info
// Embeds existing Phaser game via iframe + shows specs, controls, high score
// ═══════════════════════════════════════════════════════════════════════════════

interface GameLauncherModalProps {
  game: Game | null;
  onClose: () => void;
}

/** Get/set high score from localStorage */
function getHighScore(gameId: string): number {
  try {
    return parseInt(localStorage.getItem(`highscore-${gameId}`) || "0", 10);
  } catch {
    return 0;
  }
}

export function GameLauncherModal({ game, onClose }: GameLauncherModalProps) {
  const isOpen = game !== null;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highScore, setHighScore] = useState(0);

  // Load high score when game changes
  useEffect(() => {
    if (game) setHighScore(getHighScore(game.id));
  }, [game]);

  // Listen for high score messages from the game iframe
  useEffect(() => {
    if (!game) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "highscore" && typeof e.data.score === "number") {
        const current = getHighScore(game.id);
        if (e.data.score > current) {
          localStorage.setItem(`highscore-${game.id}`, String(e.data.score));
          setHighScore(e.data.score);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [game]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const gameUrl = game?.links.find((l) => l.label === "Play")?.href;

  return (
    <AnimatePresence>
      {isOpen && game && (
        <motion.div
          className="fixed inset-0 z-[60] bg-navy-950"
          role="dialog"
          aria-modal="true"
          aria-label={`${game.title} game launcher`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Top bar ─────────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between h-12 px-4 bg-navy-950/95 border-b border-neon-cyan/15 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <Gamepad2 size={16} className="text-neon-cyan" />
              <span className="text-sm font-bold font-display text-slate-200">{game.title}</span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-neon-green/80 uppercase tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
                </span>
                LIVE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-3 py-1 rounded-md text-[11px] font-mono text-slate-400 hover:text-neon-cyan border border-white/10 hover:border-neon-cyan/30 transition-all"
              >
                {sidebarOpen ? "Hide Info" : "Show Info"}
              </button>
              <button
                onClick={onClose}
                autoFocus
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold text-navy-950 bg-gradient-to-r from-neon-pink to-neon-purple hover:shadow-[0_0_15px_rgba(244,114,182,0.3)] transition-all"
              >
                <X size={12} />
                EJECT
              </button>
            </div>
          </div>

          {/* ── Main content area ───────────────────────────────────── */}
          <div className="absolute top-12 bottom-0 left-0 right-0 flex">
            {/* Game iframe */}
            <div className="flex-1 relative bg-black">
              {gameUrl ? (
                <iframe
                  src={gameUrl}
                  title={`${game.title} game`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
                  Game not available
                </div>
              )}

              {/* CRT bezel effect on edges */}
              <div className="absolute inset-0 pointer-events-none border border-white/[0.03] rounded-sm" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            </div>

            {/* Sidebar */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden bg-navy-950/95 border-l border-neon-cyan/15 flex-shrink-0"
                >
                  <div className="w-[280px] p-5 space-y-6 overflow-y-auto h-full">
                    {/* High Score */}
                    <div className="text-center p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/15">
                      <Trophy size={20} className="text-neon-cyan mx-auto mb-2" />
                      <p className="text-2xl font-bold font-display text-neon-cyan tabular-nums">
                        {highScore.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                        High Score
                      </p>
                    </div>

                    {/* Controls */}
                    {game.controls && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Keyboard size={13} className="text-neon-cyan/60" />
                          <h3 className="text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest">
                            Controls
                          </h3>
                        </div>
                        <ul className="space-y-1.5">
                          {game.controls.map((ctrl, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                              <span className="text-neon-cyan/40 mt-0.5">&gt;</span>
                              {ctrl}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* System Specs */}
                    {game.specs && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Cpu size={13} className="text-neon-cyan/60" />
                          <h3 className="text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest">
                            System Specs
                          </h3>
                        </div>
                        <ul className="space-y-1.5">
                          {game.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                              <span className="text-neon-purple/40 mt-0.5">&gt;</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Used */}
                    <div>
                      <h3 className="text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {game.tech.map((t) => (
                          <Tag key={t} label={t} color="cyan" />
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-[11px] font-mono text-neon-cyan/70 uppercase tracking-widest mb-2">
                        About
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{game.description}</p>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
