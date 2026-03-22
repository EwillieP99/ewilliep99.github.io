import { useCallback, useEffect, useState } from "react";

export type ErrorEntry = {
  id: string;
  message: string;
  source?: string;
  time: number;
};

export default function ErrorLogPanel({
  onCountChange,
}: {
  onCountChange?: (n: number) => void;
}) {
  const [entries, setEntries] = useState<ErrorEntry[]>([]);

  const push = useCallback(
    (message: string, source?: string) => {
      setEntries((prev) => {
        const next = [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            message,
            source,
            time: Date.now(),
          },
        ].slice(-200);
        onCountChange?.(next.length);
        return next;
      });
    },
    [onCountChange],
  );

  useEffect(() => {
    const onErr = (ev: Event) => {
      const e = ev as ErrorEvent;
      const text = e.message || "Unknown error";
      const detail =
        e.error instanceof Error ? e.error.stack : `${e.filename ?? ""}:${e.lineno ?? ""}`;
      push(text, detail || "error");
    };
    const onRej = (ev: PromiseRejectionEvent) => {
      const r = ev.reason;
      const text = r instanceof Error ? r.message : String(r);
      push(text, "unhandledrejection");
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, [push]);

  useEffect(() => {
    onCountChange?.(entries.length);
  }, [entries.length, onCountChange]);

  const clear = () => {
    setEntries([]);
    onCountChange?.(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-prose text-sm text-[var(--bl-muted)]">
          Runtime errors and unhandled rejections on this origin. Keeping the last{" "}
          <span className="bl-mono text-[var(--bl-ink)]">200</span> entries.
        </p>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-[var(--bl-line-strong)] px-3 py-1.5 text-xs font-medium text-[var(--bl-muted)] transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          Clear all
        </button>
      </div>
      <ul className="max-h-[min(60vh,520px)] space-y-2 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--bl-line)] bg-[var(--bl-card)]/50 px-4 py-8 text-center text-sm text-[var(--bl-faint)]">
            No errors captured yet — clean run.
          </li>
        ) : (
          [...entries].reverse().map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-[var(--bl-line-strong)] bg-[var(--bl-card)] p-4"
            >
              <div className="bl-mono text-[10px] uppercase tracking-wider text-[var(--bl-faint)]">
                {new Date(e.time).toLocaleTimeString()}
              </div>
              <div className="mt-2 whitespace-pre-wrap break-words text-sm text-rose-300">{e.message}</div>
              {e.source && (
                <pre className="mt-3 max-h-40 overflow-x-auto overflow-y-auto rounded-lg bg-[var(--bl-bg)] p-3 bl-mono text-[10px] leading-relaxed text-[var(--bl-muted)]">
                  {e.source}
                </pre>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
