interface SectionHeaderProps {
  label: string;
  sub?: string;
  /** Mono-style codename shown before the label */
  codename?: string;
}

/** Section heading with neon accent bar and optional subtitle */
export function SectionHeader({ label, sub, codename }: SectionHeaderProps) {
  return (
    <div className="section-label">
      <div>
        {codename && (
          <p className="text-xs font-mono text-neon-cyan/60 tracking-[0.2em] uppercase mb-1.5">
            {codename}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight font-display leading-tight">
          {label}
        </h2>
        {sub && (
          <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-prose">{sub}</p>
        )}
      </div>
    </div>
  );
}
