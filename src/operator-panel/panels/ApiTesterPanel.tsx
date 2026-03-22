import { useState } from "react";
import { blBtnPrimary, blField, blFieldArea } from "../blUi";

export default function ApiTesterPanel() {
  const [url, setUrl] = useState("/api/echo");
  const [method, setMethod] = useState<"GET" | "POST" | "OPTIONS">("POST");
  const [body, setBody] = useState(
    JSON.stringify(
      {
        messages: [{ role: "user", content: "ping" }],
        stream: false,
        activeSection: "home",
      },
      null,
      2,
    ),
  );
  const [out, setOut] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setOut("");
    setStatus(null);
    try {
      const init: RequestInit = {
        method,
        credentials: "include",
        headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body: method === "POST" ? body : undefined,
      };
      const r = await fetch(url, init);
      setStatus(r.status);
      const text = await r.text();
      setOut(text.slice(0, 12000));
    } catch (e) {
      setOut(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={method} onChange={(e) => setMethod(e.target.value as typeof method)} className={blField}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`${blField} min-w-[12rem] flex-1 bl-mono text-xs`}
        />
        <button type="button" onClick={send} disabled={loading} className={btnPrimary}>
          Send
        </button>
      </div>
      {method === "POST" && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className={blFieldArea}
        />
      )}
      {status !== null && (
        <p className="bl-mono text-xs text-[var(--bl-faint)]">
          HTTP <span className="text-[var(--bl-accent)]">{status}</span>
        </p>
      )}
      <pre className="max-h-[50vh] overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--bl-line-strong)] bg-[var(--bl-bg)] p-4 bl-mono text-xs leading-relaxed text-[var(--bl-muted)]">
        {out || "—"}
      </pre>
    </div>
  );
}
