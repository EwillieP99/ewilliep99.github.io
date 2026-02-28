import { Gamepad2, ExternalLink, Lock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { games } from "@/data/games";

export function Games() {
  return (
    <section id="games" className="max-w-6xl mx-auto px-6 py-24" aria-label="Games section">
      <AnimatedSection>
        <SectionHeader
          codename="// 05"
          label="Arcade"
          sub="Playable experiments and mini-game systems"
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 gap-5">
        {games.map((game, index) => (
          <AnimatedSection key={game.id} delay={index * 0.08}>
            <Card padding="p-6" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} className="text-neon-cyan" />
                  <h3 className="font-semibold text-slate-100 font-display">{game.title}</h3>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                    game.status === "live"
                      ? "text-neon-green border-neon-green/30 bg-neon-green/10"
                      : "text-slate-400 border-white/15 bg-white/5"
                  }`}
                >
                  {game.status === "live" ? "LIVE" : "LOCKED"}
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-3 flex-1">{game.description}</p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple/80 self-start">
                {game.highlight}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {game.tech.map((tag) => (
                  <Tag key={tag} label={tag} color="cyan" />
                ))}
              </div>

              {game.links.length > 0 ? (
                <div className="flex gap-3 pt-3 border-t border-white/6">
                  {game.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                    >
                      <ExternalLink size={12} />
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="pt-3 border-t border-white/6 text-xs text-slate-500 font-mono flex items-center gap-1.5">
                  <Lock size={12} />
                  Awaiting next deployment...
                </div>
              )}
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
