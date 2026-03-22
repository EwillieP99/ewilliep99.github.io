import { useEffect, useMemo, useState } from "react";
import { BL_NOTES } from "../storageKeys";
import type { PanelProps } from "../panelRegistry";
import { blBtnPrimary } from "../blUi";

const NOTE_TEMPLATES = [
  {
    id: "deploy",
    label: "Deploy",
    body: `## Deploy pass
- [ ] Build succeeds locally
- [ ] /build-log auth check
- [ ] Echo API smoke test
- [ ] Route health pass
`,
  },
  {
    id: "incident",
    label: "Incident",
    body: `## Incident log
- Time:
- Surface:
- Symptom:
- Root cause:
- Mitigation:
- Follow-up:
`,
  },
  {
    id: "experiment",
    label: "Experiment",
    body: `## Experiment
- Hypothesis:
- Change:
- Metric:
- Result:
- Decision:
`,
  },
] as const;

export default function WorkspacePanel({ errorCount = 0 }: PanelProps) {
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setNotes(localStorage.getItem(BL_NOTES) ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  const save = (v: string) => {
    setNotes(v);
    try {
      localStorage.setItem(BL_NOTES, v);
    } catch {
      /* ignore */
    }
  };

  const lines = useMemo(() => notes.split(/\r?\n/), [notes]);
  const lineCount = notes.trim() ? lines.length : 0;
  const charCount = notes.length;
  const wordCount = useMemo(() => {
    const w = notes.trim().match(/\S+/g);
    return w ? w.length : 0;
  }, [notes]);

  const insertTemplate = (templateBody: string) => {
    const next = notes.trim() ? `${notes}\n\n${templateBody}` : templateBody;
    save(next);
  };

  const clearNotes = () => save("");

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore clipboard failures */
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-2xl border border-[var(--bl-line-strong)] bg-[var(--bl-card)] p-5">
          <h3 className="bl-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--bl-faint)]">
            Control deck
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--bl-muted)]">
            Fast entry point for links, incident context, and reusable runbooks.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[var(--bl-line)] px-3 py-2 transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-accent)]"
            >
              Portfolio home
            </a>
            <a
              href="https://github.com/ewilliep99"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[var(--bl-line)] px-3 py-2 transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-accent)]"
            >
              GitHub
            </a>
            <a
              href="/api/echo"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[var(--bl-line)] px-3 py-2 bl-mono text-xs transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-accent)]"
            >
              /api/echo · smoke test
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--bl-line-strong)] bg-[var(--bl-card)] p-5">
          <h3 className="bl-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--bl-faint)]">
            Signal snapshot
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[var(--bl-line)] bg-[var(--bl-bg)] px-3 py-3">
              <div className="bl-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bl-faint)]">Errors</div>
              <div className="mt-1 bl-display text-2xl font-bold text-[var(--bl-ink)]">{errorCount}</div>
            </div>
            <div className="rounded-xl border border-[var(--bl-line)] bg-[var(--bl-bg)] px-3 py-3">
              <div className="bl-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bl-faint)]">Words</div>
              <div className="mt-1 bl-display text-2xl font-bold text-[var(--bl-ink)]">{wordCount}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--bl-faint)]">
            Notes are local only. Use <span className="text-[var(--bl-ink)]">Signals → Error Log</span> for stacks.
          </p>
        </section>
      </aside>

      <section className="rounded-2xl border border-[var(--bl-line-strong)] bg-[var(--bl-card)] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="bl-display text-2xl font-bold tracking-tight text-[var(--bl-ink)]">Workspace notes</h3>
            <p className="mt-1 text-sm text-[var(--bl-muted)]">
              Draft deployment steps, capture learnings, and stash decisions while you ship.
            </p>
          </div>
          <div className="bl-mono text-[10px] uppercase tracking-[0.2em] text-[var(--bl-faint)]">{BL_NOTES}</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {NOTE_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => insertTemplate(t.body)}
              className="rounded-lg border border-[var(--bl-line)] px-3 py-1.5 text-xs font-medium text-[var(--bl-muted)] transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-accent)]"
            >
              + {t.label} template
            </button>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => save(e.target.value)}
          rows={17}
          className="mt-4 w-full resize-y rounded-2xl border border-[var(--bl-line-strong)] bg-[var(--bl-bg)] px-4 py-4 bl-mono text-sm leading-relaxed text-[var(--bl-ink)] placeholder:text-[var(--bl-faint)] outline-none transition-shadow focus:border-[var(--bl-accent-dim)] focus:ring-2 focus:ring-[var(--bl-accent-soft)]"
          placeholder="Deploy checklist, env keys to verify, URLs, session notes…"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="bl-mono text-[10px] uppercase tracking-[0.2em] text-[var(--bl-faint)]">
            {lineCount} lines · {wordCount} words · {charCount} chars
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyNotes}
              className="rounded-lg border border-[var(--bl-line)] px-3 py-2 text-xs font-medium text-[var(--bl-muted)] transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-accent)]"
            >
              {copied ? "Copied" : "Copy notes"}
            </button>
            <button
              type="button"
              onClick={clearNotes}
              className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:text-rose-200"
            >
              Clear
            </button>
            <button type="button" onClick={() => save(notes)} className={blBtnPrimary}>
              Saved locally
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
