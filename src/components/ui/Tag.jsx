/**
 * Small inline tag pill — used on experience and project cards.
 */
export function Tag({ label }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-slate-400">
      {label}
    </span>
  );
}
