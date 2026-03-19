import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Lock, Play, Monitor } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { games, type Game } from "@/data/games";

// Lazy-load the game launcher to keep initial bundle small
const GameLauncherModal = lazy(() =>
  import("@/components/modals/GameLauncherModal").then((m) => ({ default: m.GameLauncherModal }))
);
import { cn } from "@/lib/utils";

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

/** CRT-styled game card */
function CRTGameCard({
  game,
  index,
  onLaunch,
}: {
  game: Game;
  index: number;
  onLaunch: () => void;
}) {
  const isLive = game.status === "live";
  const highScore = getHighScore(game.id);

  return (
    <AnimatedSection delay={index * 0.1}>
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden transition-all duration-500",
          "border border-white/10 hover:border-neon-cyan/30",
          "bg-navy-950/80 backdrop-blur-lg",
          isLive && "cursor-pointer hover:shadow-[0_0_30px_rgba(0,245,255,0.08)]",
        )}
        onClick={isLive ? onLaunch : undefined}
        role={isLive ? "button" : undefined}
        tabIndex={isLive ? 0 : undefined}
        onKeyDown={isLive ? (e) => { if (e.key === "Enter") onLaunch(); } : undefined}
        aria-label={isLive ? `Launch ${game.title}` : `${game.title} — coming soon`}
      >
        {/* CRT bezel top */}
        <div className="relative h-10 bg-[#0c0e1a] border-b border-white/5 flex items-center px-4 gap-3" aria-hidden="true">
          {/* CRT dots */}
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

        {/* Screen area */}
        <div className="relative p-6">
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)",
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Gamepad2 size={18} className="text-neon-cyan" />
              <h3 className="text-lg font-bold text-slate-100 font-display group-hover:text-neon-cyan transition-colors">
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

          <p className="text-sm text-slate-300 leading-relaxed mb-4">{game.description}</p>

          {/* Highlight */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple/80">
            {game.highlight}
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {game.tech.map((tag) => (
              <Tag key={tag} label={tag} color="cyan" />
            ))}
          </div>

          {/* Footer: High score + Launch */}
          <div className="flex items-center justify-between pt-4 border-t border-white/6">
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

        {/* CRT bezel reflection */}
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

  return (
    <>
      <section id="games" className="max-w-6xl mx-auto px-6 py-24" aria-label="Games section">
        <AnimatedSection>
          <SectionHeader
            codename="// 05"
            label="Arcade"
            sub="Playable experiments and mini-game systems"
          />
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {games.map((game, index) => (
            <CRTGameCard
              key={game.id}
              game={game}
              index={index}
              onLaunch={() => setSelectedGame(game)}
            />
          ))}
        </div>
      </section>

      {/* Game Launcher Modal (lazy-loaded) */}
      <Suspense fallback={null}>
        <GameLauncherModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      </Suspense>
    </>
  );
}
