import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import "./build-log.css";
import {
  Activity,
  Bot,
  Bug,
  FlaskConical,
  Gamepad2,
  LayoutDashboard,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Plug,
  ScrollText,
  Send,
  SplitSquareVertical,
  TestTube2,
} from "lucide-react";
import { PANEL_LABELS, PANEL_LOADERS, type PanelId } from "./panelRegistry";
import { groupForPanel, PANEL_GROUPS } from "./panelGroups";
import { LAZY_PANEL_IDS, PANEL_IDS, type LazyPanelId } from "./panelIds";
import { BL_ACTIVE_PANEL, BL_SIDEBAR_EXPANDED } from "./storageKeys";
import ErrorLogPanel from "./panels/ErrorLogPanel";

const ICONS: Record<PanelId, typeof LayoutDashboard> = {
  workspace: LayoutDashboard,
  "route-health": Activity,
  "api-tester": Send,
  integrations: Plug,
  changelog: ScrollText,
  experiments: TestTube2,
  "error-log": Bug,
  "site-tour": Map,
  "env-diff": SplitSquareVertical,
  "arcade-lab": Gamepad2,
  "echo-lab": Bot,
  experimental: FlaskConical,
};

function readStoredPanel(): PanelId {
  try {
    const v = localStorage.getItem(BL_ACTIVE_PANEL);
    if (v && (PANEL_IDS as readonly string[]).includes(v)) return v as PanelId;
  } catch {
    /* ignore */
  }
  return "workspace";
}

function readSidebarExpanded(): boolean {
  try {
    const v = localStorage.getItem(BL_SIDEBAR_EXPANDED);
    if (v === "0") return false;
    return true;
  } catch {
    return true;
  }
}

function PanelLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-16">
      <div className="flex gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[var(--bl-accent)] opacity-40 [animation:bl-dot_0.9s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
      <p className="bl-mono text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--bl-faint)]">
        Loading module
      </p>
    </div>
  );
}

export function BuildLogLayout({ login }: { login: string }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(readSidebarExpanded);
  const [active, setActive] = useState<PanelId>(readStoredPanel);
  const [visited, setVisited] = useState<Set<LazyPanelId>>(() => {
    const s = new Set<LazyPanelId>();
    s.add("workspace");
    return s;
  });
  const [errorCount, setErrorCount] = useState(0);

  const activeGroup = groupForPanel(active);

  const panelSubtitle = useMemo(() => {
    const s: Partial<Record<PanelId, string>> = {
      workspace: "Notes, links, and a live error tally.",
      "route-health": "HEAD/OPTIONS probes against key paths.",
      "api-tester": "Fire requests at your API routes.",
      integrations: "Env presence and third-party wiring.",
      changelog: "Deploy metadata when Vercel provides it.",
      experiments: "Feature flags stored in the browser.",
      "error-log": "Captured runtime errors on this origin.",
      "site-tour": "Walk the sections like a first-time visitor.",
      "env-diff": "Compare local vs expected environment keys.",
      "arcade-lab": "Arcade embeds and game shell checks.",
      "echo-lab": "Echo / Navigator integration experiments.",
      experimental: "Sandbox tools — may change anytime.",
    };
    return s[active] ?? "";
  }, [active]);

  useEffect(() => {
    try {
      localStorage.setItem(BL_SIDEBAR_EXPANDED, sidebarExpanded ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    try {
      localStorage.setItem(BL_ACTIVE_PANEL, active);
    } catch {
      /* ignore */
    }
  }, [active]);

  const selectPanel = useCallback((id: PanelId) => {
    setActive(id);
    if (id !== "error-log") {
      setVisited((prev) => {
        const next = new Set(prev);
        next.add(id as LazyPanelId);
        return next;
      });
    }
  }, []);

  const logout = async () => {
    await fetch("/api/build-log/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/build-log";
  };

  const asideW = sidebarExpanded ? "w-[15.5rem]" : "w-[4.25rem]";

  const panelNavButton = (id: PanelId) => {
    const Icon = ICONS[id];
    const isActive = active === id;
    const badge = id === "error-log" && errorCount > 0;
    return (
      <button
        key={id}
        type="button"
        onClick={() => selectPanel(id)}
        className={`group relative flex w-full items-center gap-3 rounded-xl border border-transparent py-2.5 text-left text-[13px] transition-all duration-200 ${
          sidebarExpanded ? "px-3" : "justify-center px-0"
        } ${
          isActive
            ? "border-[var(--bl-line-strong)] bg-[var(--bl-accent-soft)] text-[var(--bl-ink)] shadow-[inset_3px_0_0_0_var(--bl-accent),0_0_0_1px_var(--bl-accent-violet-soft)]"
            : "text-[var(--bl-muted)] hover:border-[var(--bl-line)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--bl-ink)]"
        }`}
        title={PANEL_LABELS[id]}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)] text-[var(--bl-muted)] group-hover:text-[var(--bl-ink)]">
          <Icon size={17} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-[var(--bl-accent)]" : ""} />
          {badge && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-0.5 bl-mono text-[9px] font-bold text-white">
              {errorCount > 99 ? "99+" : errorCount}
            </span>
          )}
        </span>
        {sidebarExpanded && <span className="min-w-0 flex-1 truncate font-medium">{PANEL_LABELS[id]}</span>}
      </button>
    );
  };

  return (
    <div className="build-log-theme flex h-[100dvh] bg-[var(--bl-bg)] text-[var(--bl-ink)]">
      {/* Sidebar */}
      <aside
        className={`${asideW} flex shrink-0 flex-col border-r border-[var(--bl-line)] bg-[var(--bl-sidebar)] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      >
        <div
          className={`flex items-center border-b border-[var(--bl-line)] ${sidebarExpanded ? "gap-3 px-4 py-4" : "flex-col gap-2 px-2 py-3"}`}
        >
          {sidebarExpanded ? (
            <>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--bl-accent-soft)] to-transparent ring-1 ring-[var(--bl-line-strong)]">
                <span className="bl-display text-lg font-extrabold tracking-tight text-[var(--bl-accent)]">BL</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="bl-display truncate text-base font-bold leading-tight tracking-tight">Build Log</div>
                <div className="bl-mono mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[var(--bl-faint)]">Console</div>
              </div>
            </>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bl-accent-soft)] ring-1 ring-[var(--bl-line-strong)]">
              <span className="bl-display text-sm font-extrabold text-[var(--bl-accent)]">BL</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarExpanded((e) => !e)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--bl-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--bl-ink)]"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? <PanelLeftClose size={18} strokeWidth={1.75} /> : <PanelLeftOpen size={18} strokeWidth={1.75} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Build Log panels">
          {PANEL_GROUPS.map((group, gi) => (
            <div key={group.id} className={gi > 0 ? "mt-3 border-t border-[var(--bl-line)] pt-3" : ""}>
              {sidebarExpanded && (
                <p
                  className={`bl-mono px-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--bl-faint)] ${
                    gi === 0 ? "mb-1.5" : "mb-1.5 mt-0.5"
                  }`}
                >
                  {group.label}
                </p>
              )}
              {!sidebarExpanded && gi > 0 && <div className="mx-2 my-2 h-px bg-[var(--bl-line)]" aria-hidden />}
              <div className="flex flex-col gap-0.5">{group.panels.map((id) => panelNavButton(id))}</div>
            </div>
          ))}
        </nav>

        <div className="bl-mono border-t border-[var(--bl-line)] px-4 py-3 text-[9px] uppercase tracking-widest text-[var(--bl-faint)]">
          {sidebarExpanded ? "Local only · not indexed" : "·"}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--bl-canvas)]">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--bl-line)] bg-[var(--bl-bg)]/80 px-5 backdrop-blur-md sm:px-6">
          <span className="bl-display text-sm font-semibold tracking-tight text-[var(--bl-muted)]">Build Log</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden max-w-[200px] truncate bl-mono text-[11px] text-[var(--bl-muted)] sm:inline">{login}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[var(--bl-line-strong)] px-3 py-1.5 text-xs font-medium text-[var(--bl-muted)] transition-colors hover:border-[var(--bl-accent-dim)] hover:text-[var(--bl-ink)]"
            >
              Sign out
            </button>
            <a
              href="/"
              className="rounded-lg bg-gradient-to-r from-[var(--bl-accent)] to-[var(--bl-accent-violet)] px-3 py-1.5 text-xs font-semibold text-[#0a0c12] transition-opacity hover:opacity-90"
            >
              Site →
            </a>
          </div>
        </header>

        {/* Hero strip — current module */}
        <div
          className="shrink-0 border-b border-[var(--bl-line)] px-5 py-8 sm:px-8 sm:py-10"
          style={{
            background:
              "radial-gradient(circle at 84% 14%, var(--bl-accent-violet-soft), transparent 34%), linear-gradient(135deg, #0d0f14 0%, var(--bl-canvas) 62%, var(--bl-bg) 100%)",
          }}
        >
          <p className="bl-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--bl-faint)]">
            {activeGroup?.label ?? "—"}
          </p>
          <h2 className="bl-display mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
            {PANEL_LABELS[active]}
          </h2>
          {panelSubtitle && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--bl-muted)]">{panelSubtitle}</p>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
            <div
              className={
                active === "error-log"
                  ? "relative"
                  : "sr-only absolute m-0 h-px w-px overflow-hidden border-0 p-0"
              }
              aria-hidden={active !== "error-log"}
            >
              <ErrorLogPanel onCountChange={setErrorCount} />
            </div>

            {LAZY_PANEL_IDS.map((id) => {
              if (!visited.has(id)) return null;
              const Comp = PANEL_LOADERS[id];
              return (
                <div key={id} className={active === id ? "relative" : "hidden"}>
                  <Suspense fallback={<PanelLoadingFallback />}>
                    <Comp errorCount={errorCount} />
                  </Suspense>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
