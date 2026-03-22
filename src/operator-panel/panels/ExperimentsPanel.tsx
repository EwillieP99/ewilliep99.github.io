import { useEffect, useState } from "react";
import { blFieldArea } from "../blUi";
import { BL_EXPERIMENTS } from "../storageKeys";

type Item = { id: string; title: string; status: string };

export default function ExperimentsPanel() {
  const [raw, setRaw] = useState("[]");
  const [parseErr, setParseErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRaw(localStorage.getItem(BL_EXPERIMENTS) ?? "[]");
    } catch {
      setRaw("[]");
    }
  }, []);

  const save = (next: string) => {
    setRaw(next);
    try {
      JSON.parse(next);
      setParseErr(null);
      localStorage.setItem(BL_EXPERIMENTS, next);
    } catch {
      setParseErr("Invalid JSON");
    }
  };

  let items: Item[] = [];
  try {
    items = JSON.parse(raw) as Item[];
    if (!Array.isArray(items)) items = [];
  } catch {
    items = [];
  }

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm leading-relaxed text-[var(--bl-muted)]">
        Experiment ideas / feature flags (JSON array). Stored in{" "}
        <span className="bl-mono text-xs text-[var(--bl-faint)]">{BL_EXPERIMENTS}</span>.
      </p>
      {parseErr && <p className="text-sm text-amber-400">{parseErr}</p>}
      <textarea value={raw} onChange={(e) => save(e.target.value)} rows={16} className={blFieldArea} />
      <ul className="space-y-1 text-sm text-[var(--bl-muted)]">
        {items.map((it) => (
          <li key={it.id}>
            <span className="font-medium text-[var(--bl-ink)]">{it.title || it.id}</span>
            <span className="text-[var(--bl-faint)]"> — </span>
            {it.status || "idea"}
          </li>
        ))}
      </ul>
    </div>
  );
}
