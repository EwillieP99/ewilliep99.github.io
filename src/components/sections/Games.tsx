import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Gamepad2, Lock, Play, Monitor } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { games, type Game } from "@/data/games";
import { navCodename } from "@/data/navSections";
import { cn } from "@/lib/utils";

const GameLauncherModal = lazy(() =>
  import("@/components/modals/GameLauncherModal").then((m) => ({ default: m.GameLauncherModal })),
);

// ═══════════════════════════════════════════════════════════════════════════════
// ARCADE — CRT-framed game cards with full-screen launcher
// ═══════════════════════════════════════════════════════════════════════════════

/** Get high score from localStorage */
function getHighScore(gameId: string): number {
  try {
    return parseInt(localStorage.getItem(`highscore-${gameId}`) || "0", 10);
  } catch {
    return 0;
  }
}

const BREACH_LINES = ["CONNECTING…", "BREACH KEY OK", "OPEN CHANNEL"] as const;

/** CRT-styled game card */
function CRTGameCard({
  game,
  index,
  onLaunch,
  fullWidth,
  selectedId,
}: {
  game: Game;
  index: number;
  onLaunch: () => void;
  fullWidth?: boolean;
  selectedId: string | null;
}) {
  const isLive = game.status === "live";
  const highScore = getHighScore(game.id);
  const isSignalBreach = game.id === "signal-breach";
  const [breachStep, setBreachStep] = useState(0);
  const onLaunchRef = useRef(onLaunch);
  onLaunchRef.current = onLaunch;

  useEffect(() => {
    if (breachStep === 0) return;
    if (breachStep > 3) return;
    const delay = breachStep === 3 ? 420 : 380;
    const t = window.setTimeout(() => {
      if (breachStep === 3) {
        onLaunchRef.current();
        setBreachStep(0);
      } else {
        setBreachStep((s) => s + 1);
      }
    }, delay);
    return () => window.clearTimeout(t);
  }, [breachStep]);

  const tryActivate = () => {
    if (!isLive || breachStep > 0) return;
    if (isSignalBreach) {
      setBreachStep(1);
      return;
    }
    onLaunch();
  };

  const shareLayout = isLive && selectedId !== game.id;
  const layoutId = shareLayout ? `arcade-viewport-${game.id}` : undefined;

  return (
    <AnimatedSection delay={index * 0.1}>
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden transition-all duration-500",
          "border border-white/10 hover:border-neon-cyan/30",
          "bg-navy-950/80 backdrop-blur-lg",
          fullWidth && "w-full",
          isLive && "cursor-pointer hover:shadow-[0_0_30px_rgba(0,245,255,0.08)]",
        )}
        onClick={tryActivate}
        role={isLive ? "button" : undefined}
        tabIndex={isLive ? 0 : undefined}
        onKeyDown={isLive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tryActivate(); } } : undefined}
        aria-label={isLive ? `Launch ${game.title}` : `${game.title} — coming soon`}
      >
        {/* CRT bezel top */}
        <div className="relative h-10 bg-[#0c0e1a] border-b border-white/5 flex items-center px-4 gap-3" aria-hidden="true">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Monitor size={11} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-600 uppercase">CRT-{String(index + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <motion.div
          layoutId={layoutId}
          className="relative rounded-b-[inherit]"
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        >
          {/* Screen area */}
          <div className={cn("relative p-5 sm:p-6", fullWidth && "sm:grid sm:grid-cols-[1fr_minmax(0,280px)] sm:gap-6 sm:items-start")}>
            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)",
              }}
            />

            <AnimatePresence>
              {breachStep > 0 && (
                <motion.div
                  key="breach"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 z-20 flex flex-col items-start justify-end p-5 sm:p-6 bg-navy-950/92 backdrop-blur-sm pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="font-mono text-[11px] text-neon-green/90 space-y-1.5 tracking-wide">
                    {BREACH_LINES.slice(0, breachStep).map((line, i) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                      >
                        <span className="text-neon-cyan/50">&gt;</span> {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Signal strength micro-bar (CRT “RSSI”) */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] w-full max-w-[min(100%,14rem)] bg-gradient-to-r from-neon-cyan/90 to-neon-purple/50 origin-left z-[2] pointer-events-none"
              initial={false}
              whileHover={isLive ? { scaleX: 1.08, opacity: 1 } : {}}
              animate={{ scaleX: isLive ? 0.62 : 0.22, opacity: isLive ? 0.9 : 0.3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            />

            {/* Header + body column */}
            <div className={cn(fullWidth && "min-w-0")}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Gamepad2 size={18} className="text-neon-cyan" />
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-display group-hover:text-neon-cyan transition-colors">
                    {game.title}
                  </h3>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border font-mono font-bold uppercase tracking-wider",
                    isLive
                      ? "text-neon-green border-neon-green/30 bg-neon-green/10"
                      : "text-slate-400 border-white/15 bg-white/5",
                  )}
                >
                  {isLive && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
                    </span>
                  )}
                  {isLive ? "LIVE" : "LOCKED"}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-line">{game.description.replace(/\*\*/g, "")}</p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple/80">
                {game.highlight}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {game.tech.map((tag) => (
                  <Tag key={tag} label={tag} color="cyan" />
                ))}
              </div>
            </div>

            <div className={cn("mt-6 sm:mt-0", !fullWidth && "contents")}>
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/6",
                  fullWidth && "sm:flex-col sm:items-stretch sm:border-t-0 sm:border-l sm:border-white/10 sm:pl-8 sm:pt-0",
                )}
              >
                {highScore > 0 && (
                  <span className="text-[11px] font-mono text-neon-cyan/50">
                    HIGH SCORE: <span className="text-neon-cyan font-bold tabular-nums">{highScore.toLocaleString()}</span>
                  </span>
                )}

                {isLive ? (
                  <motion.div
                    className="flex items-center gap-2 ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 text-xs font-mono font-bold text-neon-cyan group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_15px_rgba(0,245,255,0.15)] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play size={12} className="fill-current" />
                    LAUNCH
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500 font-mono">
                    <Lock size={12} />
                    Awaiting deployment...
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,255,0.02) 0%, transparent 50%, rgba(168,85,247,0.02) 100%)",
          }}
        />
      </div>
    </AnimatedSection>
  );
}

export function Games() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const selectedId = selectedGame?.id ?? null;

  return (
    <LayoutGroup id="arcade">
      <>
        <section id="games" className="section-shell" aria-label="Games section">
          <AnimatedSection>
            <SectionHeader
              codename={navCodename("games")}
              label="Arcade"
              sub="Playable experiments — launch in fullscreen when you’re ready"
            />
          </AnimatedSection>

          <div className="w-full">
            {games.map((game, index) => (
              <CRTGameCard
                key={game.id}
                game={game}
                index={index}
                onLaunch={() => setSelectedGame(game)}
                fullWidth
                selectedId={selectedId}
              />
            ))}
          </div>
        </section>

        <Suspense fallback={null}>
          <GameLauncherModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        </Suspense>
      </>
    </LayoutGroup>
  );
}
