import "./build-log.css";

export function BuildLogLogin() {
  return (
    <div className="build-log-theme relative min-h-[100dvh] overflow-hidden">
      <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* Left — brand field */}
        <div className="relative hidden flex-col justify-between border-r border-[var(--bl-line)] bg-[var(--bl-canvas)] p-10 lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(46,230,207,0.12), transparent), radial-gradient(circle at 90% 80%, rgba(99,102,241,0.08), transparent)",
            }}
            aria-hidden
          />
          <div className="relative z-10">
            <p className="bl-mono text-[10px] font-medium uppercase tracking-[0.4em] text-[var(--bl-faint)]">
              Internal
            </p>
            <h1 className="bl-display mt-6 max-w-md text-5xl font-extrabold leading-[0.95] tracking-tight text-[var(--bl-ink)] xl:text-6xl">
              Build
              <br />
              <span className="text-[var(--bl-accent-dim)]">Log</span>
            </h1>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-[var(--bl-muted)]">
              A calm workspace for routes, env, shipping notes, and experiments — separate from the public portfolio chrome.
            </p>
          </div>
          <p className="relative z-10 bl-mono text-[10px] uppercase tracking-widest text-[var(--bl-faint)]">
            Neon Nexus · operator tools
          </p>
        </div>

        {/* Right — auth card */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <p className="bl-mono text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--bl-faint)]">
                Build Log
              </p>
              <h2 className="bl-display mt-2 text-3xl font-bold tracking-tight text-[var(--bl-ink)]">Sign in</h2>
            </div>

            <div className="rounded-2xl border border-[var(--bl-line-strong)] bg-[var(--bl-card)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="hidden lg:block">
                <h2 className="bl-display text-2xl font-bold tracking-tight text-[var(--bl-ink)]">Sign in</h2>
                <p className="mt-2 text-sm text-[var(--bl-muted)]">GitHub OAuth · allowlisted accounts only</p>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-[var(--bl-muted)] lg:mt-6">
                Use the GitHub user ID listed in{" "}
                <code className="bl-mono rounded-md bg-[var(--bl-bg)] px-1.5 py-0.5 text-[11px] text-[var(--bl-accent-dim)]">
                  BUILD_LOG_ALLOWED_GITHUB_IDS
                </code>
                .
              </p>

              <a
                href="/api/build-log/auth/github"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-[var(--bl-accent)] py-3.5 text-sm font-semibold text-[#042f2a] transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Continue with GitHub
              </a>

              <a
                href="/"
                className="mt-6 block text-center text-sm font-medium text-[var(--bl-muted)] transition-colors hover:text-[var(--bl-accent)]"
              >
                ← Back to portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
