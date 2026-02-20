/**
 * Consistent section heading with left accent bar.
 */
export function SectionHeader({ label, sub }) {
  return (
    <div className="section-label">
      <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
        {label}
      </h2>
      {sub && (
        <p className="text-sm text-slate-400 mt-0.5">{sub}</p>
      )}
    </div>
  );
}
