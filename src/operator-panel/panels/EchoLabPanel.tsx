import { blBtnPrimary } from "../blUi";

export default function EchoLabPanel() {
  return (
    <div className="max-w-xl space-y-4 text-sm text-[var(--bl-muted)]">
      <p className="leading-relaxed">
        Echo runs on the public site. Open the portfolio and use{" "}
        <span className="bl-mono text-xs text-[var(--bl-ink)]">Ask Echo</span> or{" "}
        <span className="bl-mono text-xs text-[var(--bl-ink)]">⌘/Ctrl+K</span>.
      </p>
      <button
        type="button"
        onClick={() => window.open("/#ai", "_blank", "noopener,noreferrer")}
        className={blBtnPrimary}
      >
        Open Echo deck section
      </button>
      <p className="text-xs text-[var(--bl-faint)]">
        CustomEvents like <span className="bl-mono text-[var(--bl-muted)]">open-echo</span> only work on the main app
        tab.
      </p>
    </div>
  );
}
