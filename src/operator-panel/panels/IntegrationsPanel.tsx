import { useCallback, useState } from "react";
import { blBtnPrimary } from "../blUi";

export default function IntegrationsPanel() {
  const [keys, setKeys] = useState<Record<string, boolean> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/build-log/env-check", { credentials: "include" });
      if (!r.ok) {
        setErr(await r.text());
        return;
      }
      const j = (await r.json()) as { keys: Record<string, boolean> };
      setKeys(j.keys);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-3xl space-y-4">
      <button type="button" onClick={load} disabled={loading} className={blBtnPrimary}>
        {loading ? "Loading…" : "Refresh env presence"}
      </button>
      {err && <p className="text-sm text-rose-400">{err}</p>}
      {keys && (
        <ul className="space-y-1.5 bl-mono text-sm">
          {Object.entries(keys).map(([k, v]) => (
            <li key={k} className="flex gap-2 text-[var(--bl-muted)]">
              <span className={v ? "text-emerald-400" : "text-[var(--bl-faint)]"}>{v ? "●" : "○"}</span>
              <span className="text-[var(--bl-ink)]">{k}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
