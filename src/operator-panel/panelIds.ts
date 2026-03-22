export const PANEL_IDS = [
  "workspace",
  "route-health",
  "api-tester",
  "integrations",
  "changelog",
  "experiments",
  "error-log",
  "site-tour",
  "env-diff",
  "arcade-lab",
  "echo-lab",
  "experimental",
] as const;

export type PanelId = (typeof PANEL_IDS)[number];

export type LazyPanelId = Exclude<PanelId, "error-log">;

export const LAZY_PANEL_IDS: LazyPanelId[] = PANEL_IDS.filter(
  (id): id is LazyPanelId => id !== "error-log",
);
