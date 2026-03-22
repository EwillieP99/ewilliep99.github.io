import { NAV_SECTIONS } from "@/data/navSections";

export default function SiteTourPanel() {
  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm leading-relaxed text-[var(--bl-muted)]">
        Opens the public portfolio in a new tab scrolled to each section (hash + element id).
      </p>
      <ul className="space-y-2">
        {NAV_SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => window.open(`/#${s.id}`, "_blank", "noopener,noreferrer")}
              className="bl-mono text-left text-sm text-[var(--bl-accent)] underline decoration-[var(--bl-accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--bl-accent)]"
            >
              {s.label} <span className="text-[var(--bl-faint)]">#{s.id}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
