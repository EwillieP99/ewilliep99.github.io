import { useCallback, useState } from "react";
import { blBtnPrimary } from "../blUi";

type Row = { path: string; status: number | null; ok: boolean; error?: string };

export default function RouteHealthPanel() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/build-log/route-check", { credentials: "include" });
      if (!r.ok) {
        setErr(await r.text());
        setRows(null);
        return;
      }
      const j = (await r.json()) as { origin: string; results: Row[] };
      setOrigin(j.origin);
      setRows(j.results);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setRows(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-3xl space-y-4">
      <button type="button" onClick={run} disabled={loading} className={blBtnPrimary}>
        {loading ? "Checking…" : "Run route check"}
      </button>
      {origin && <p className="bl-mono text-xs text-[var(--bl-faint)]">Origin: {origin}</p>}
      {err && <p className="text-sm text-rose-400">{err}</p>}
      {rows && (
        <table className="w-full overflow-hidden rounded-xl border border-[var(--bl-line-strong)] text-sm">
          <thead className="bg-[rgba(255,255,255,0.04)]">
            <tr>
              <th className="p-3 text-left font-medium text-[var(--bl-muted)]">Path</th>
              <th className="p-3 text-left font-medium text-[var(--bl-muted)]">Status</th>
              <th className="p-3 text-left font-medium text-[var(--bl-muted)]">OK</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.path} className="border-t border-[var(--bl-line)]">
                <td className="bl-mono p-3 text-xs text-[var(--bl-ink)]">{row.path}</td>
                <td className="p-3 text-[var(--bl-muted)]">{row.status ?? row.error ?? "—"}</td>
                <td className="p-3 text-[var(--bl-muted)]">{row.ok ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
