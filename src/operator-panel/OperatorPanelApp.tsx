import { useEffect, useState } from "react";
import "./build-log.css";
import { BuildLogLayout } from "./OperatorPanelLayout";
import { BuildLogLogin } from "./OperatorPanelLogin";

type GateState =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; login: string };

function SessionGateLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="build-log-theme relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(46,230,207,0.14),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(99,102,241,0.06),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center px-8 text-center">
        <div className="bl-mono mb-6 text-[10px] font-medium uppercase tracking-[0.5em] text-[var(--bl-faint)]">
          Authenticating
        </div>
        <div className="relative mb-8 flex h-36 w-36 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border border-[var(--bl-line-strong)]"
            aria-hidden
          />
          <div
            className="absolute inset-2 rounded-full border border-dashed border-[var(--bl-accent-dim)] opacity-40 animate-[spin_24s_linear_infinite]"
            aria-hidden
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--bl-accent)] opacity-80 animate-[spin_1.2s_linear_infinite]"
            aria-hidden
          />
          <span className="bl-display relative text-4xl font-extrabold tracking-tight text-[var(--bl-ink)]">
            BL
          </span>
        </div>
        <h1 className="bl-display text-3xl font-bold tracking-tight text-[var(--bl-ink)] sm:text-4xl">
          Verifying session
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--bl-muted)]">
          Secure handshake with the server. You’ll land in the console in a moment.
        </p>
        <div className="mt-10 flex gap-1.5" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1 w-6 rounded-full bg-[var(--bl-accent-soft)] [animation:bl-pulse-bar_1s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BuildLogApp() {
  const [gate, setGate] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/build-log/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; login?: string }) => {
        if (cancelled) return;
        if (d.ok && d.login) setGate({ status: "in", login: d.login });
        else setGate({ status: "out" });
      })
      .catch(() => {
        if (!cancelled) setGate({ status: "out" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (gate.status === "loading") {
    return <SessionGateLoader />;
  }
  if (gate.status === "out") {
    return <BuildLogLogin />;
  }
  return <BuildLogLayout login={gate.login} />;
}

export { BuildLogApp as OperatorPanelApp };
