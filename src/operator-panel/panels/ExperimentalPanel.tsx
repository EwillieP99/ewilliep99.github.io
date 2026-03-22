import { useEffect, useState } from "react";
import { BL_EXPERIMENTAL_FLAGS } from "../storageKeys";

export default function ExperimentalPanel() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BL_EXPERIMENTAL_FLAGS);
      setFlags(raw ? (JSON.parse(raw) as Record<string, boolean>) : {});
    } catch {
      setFlags({});
    }
  }, []);

  const setFlag = (key: string, v: boolean) => {
    const next = { ...flags, [key]: v };
    setFlags(next);
    try {
      localStorage.setItem(BL_EXPERIMENTAL_FLAGS, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const presets = ["ui_polish_v2", "hero_reduced_motion_default", "echo_stream_debug"];

  return (
    <div className="max-w-xl space-y-4 text-sm text-[var(--bl-muted)]">
      <p className="leading-relaxed">
        Inert toggles for future features. Keys under{" "}
        <span className="bl-mono text-xs text-[var(--bl-faint)]">{BL_EXPERIMENTAL_FLAGS}</span> — wire consumers when
        ready.
      </p>
      <ul className="space-y-3">
        {presets.map((k) => (
          <li key={k} className="flex items-center gap-3">
            <input
              type="checkbox"
              id={k}
              checked={!!flags[k]}
              onChange={(e) => setFlag(k, e.target.checked)}
              className="h-4 w-4 rounded border-[var(--bl-line-strong)] bg-[var(--bl-bg)] accent-[var(--bl-accent)] focus:ring-2 focus:ring-[var(--bl-accent-soft)] focus:ring-offset-0 focus:ring-offset-[var(--bl-bg)]"
            />
            <label htmlFor={k} className="bl-mono cursor-pointer text-xs text-[var(--bl-ink)]">
              {k}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
