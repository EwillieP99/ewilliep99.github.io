import { cn } from "@/lib/utils";

/**
 * Shared typography + chip styles for section toolbars, HoloCards, and modals
 * (Skills, Mission Archive, etc.).
 */
export const hudType = {
  overline: "text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500",
  monoPill: "text-[11px] font-mono uppercase tracking-[0.12em] leading-none",
  cardTitle: "text-base font-semibold text-slate-100 font-display leading-snug",
  cardBody: "text-sm text-slate-400 leading-relaxed",
  cardMeta: "text-xs text-slate-500 leading-relaxed",
  indexCounter: "text-[11px] font-mono tabular-nums text-slate-500",
  toolChip:
    "text-[11px] font-mono leading-none rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-400",
  linkChip:
    "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono text-slate-400 transition-all duration-200 hover:border-neon-cyan/30 hover:bg-neon-cyan/10 hover:text-neon-cyan",
  dossierBody: "text-sm text-slate-300 leading-relaxed",
  dossierSection: "flex items-center gap-2 mb-3",
  /** Mission card metric lines (terminal-style) */
  metricRow: "flex items-center gap-1.5 text-[11px] font-mono",
  metricLabel: "truncate text-slate-500",
  metricValue: "shrink-0 font-semibold text-neon-cyan",
  /** Mission card footer CTA */
  missionCta:
    "text-[11px] font-mono text-neon-cyan/55 transition-all duration-200 hover:bg-neon-cyan/5 hover:text-neon-cyan",
  /** One-line impact (sentence case; not uppercase) */
  impactStrip:
    "inline-flex items-center gap-2 rounded-full border border-neon-purple/20 bg-neon-purple/8 px-3 py-1.5 text-[11px] font-mono leading-snug text-neon-purple/90",
} as const;

export function filterChipClass(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1.5 text-xs font-mono transition-colors",
    active
      ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
      : "border-white/10 text-slate-400 hover:border-neon-cyan/20 hover:text-neon-cyan",
  );
}
