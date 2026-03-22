import { useCallback, useState } from "react";
import { blBtnPrimary } from "../blUi";

const EXPECTED = [
  "NAVIGATOR_API_KEY",
  "BUILD_LOG_SESSION_SECRET",
  "BUILD_LOG_ALLOWED_GITHUB_IDS",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "VITE_EMAILJS_SERVICE_ID",
] as const;

export default function EnvDiffPanel() {
  const [keys, setKeys] = useState<Record<string, boolean> | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/build-log/env-check", { credentials: "include" });
    if (r.ok) {
      const j = (await r.json()) as { keys: Record<string, boolean> };
      setKeys(j.keys);
    }
  }, []);

  return (
    <div className="max-w-3xl space-y-4">
      <button type="button" onClick={load} className={blBtnPrimary}>
        Load & compare
      </button>
      <table className="w-full overflow-hidden rounded-xl border border-[var(--bl-line-strong)] text-sm">
        <thead className="bg-[rgba(255,255,255,0.04)]">
          <tr>
            <th className="p-3 text-left font-medium text-[var(--bl-muted)]">Key</th>
            <th className="p-3 text-left font-medium text-[var(--bl-muted)]">Expected</th>
            <th className="p-3 text-left font-medium text-[var(--bl-muted)]">Present</th>
          </tr>
        </thead>
        <tbody>
          {EXPECTED.map((k) => {
            const present = keys?.[k];
            return (
              <tr key={k} className="border-t border-[var(--bl-line)]">
                <td className="bl-mono p-3 text-xs text-[var(--bl-ink)]">{k}</td>
                <td className="p-3 text-[var(--bl-muted)]">yes</td>
                <td className="p-3 text-[var(--bl-muted)]">{present === undefined ? "—" : present ? "yes" : "no"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
