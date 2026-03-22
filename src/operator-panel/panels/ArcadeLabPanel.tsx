export default function ArcadeLabPanel() {
  return (
    <div className="max-w-3xl space-y-4 text-sm text-[var(--bl-muted)]">
      <p>
        <a
          href="/games/signal-breach/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--bl-accent)] underline decoration-[var(--bl-accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--bl-accent)]"
        >
          Signal Breach
        </a>{" "}
        — public arcade route.
      </p>
      <p className="leading-relaxed">
        Verdant Siege lives under <span className="bl-mono text-xs text-[var(--bl-faint)]">public/games/</span> but is
        not linked from the live arcade cards (see project copy).
      </p>
    </div>
  );
}
