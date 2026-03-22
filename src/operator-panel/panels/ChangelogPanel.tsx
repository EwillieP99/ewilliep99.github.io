import { useCallback, useState } from "react";
import { blBtnPrimary } from "../blUi";

export default function ChangelogPanel() {
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const r = await fetch("/api/build-log/build-meta", { credentials: "include" });
      if (!r.ok) {
        setErr(await r.text());
        return;
      }
      setMeta(await r.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }, []);

  return (
    <div className="max-w-3xl space-y-4">
      <button type="button" onClick={load} className={blBtnPrimary}>
        Load deploy metadata
      </button>
      {err && <p className="text-sm text-rose-400">{err}</p>}
      {meta && (
        <pre className="overflow-x-auto rounded-xl border border-[var(--bl-line-strong)] bg-[var(--bl-bg)] p-4 bl-mono text-xs leading-relaxed text-[var(--bl-muted)]">
          {JSON.stringify(meta, null, 2)}
        </pre>
      )}
    </div>
  );
}
