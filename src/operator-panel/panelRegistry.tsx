import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { LazyPanelId, PanelId } from "./panelIds";

export type PanelProps = {
  errorCount?: number;
};

const WorkspacePanel = lazy(() => import("./panels/WorkspacePanel"));
const RouteHealthPanel = lazy(() => import("./panels/RouteHealthPanel"));
const ApiTesterPanel = lazy(() => import("./panels/ApiTesterPanel"));
const IntegrationsPanel = lazy(() => import("./panels/IntegrationsPanel"));
const ChangelogPanel = lazy(() => import("./panels/ChangelogPanel"));
const ExperimentsPanel = lazy(() => import("./panels/ExperimentsPanel"));
const SiteTourPanel = lazy(() => import("./panels/SiteTourPanel"));
const EnvDiffPanel = lazy(() => import("./panels/EnvDiffPanel"));
const ArcadeLabPanel = lazy(() => import("./panels/ArcadeLabPanel"));
const EchoLabPanel = lazy(() => import("./panels/EchoLabPanel"));
const ExperimentalPanel = lazy(() => import("./panels/ExperimentalPanel"));

export const PANEL_LOADERS: Record<
  LazyPanelId,
  LazyExoticComponent<ComponentType<PanelProps>>
> = {
  workspace: WorkspacePanel,
  "route-health": RouteHealthPanel,
  "api-tester": ApiTesterPanel,
  integrations: IntegrationsPanel,
  changelog: ChangelogPanel,
  experiments: ExperimentsPanel,
  "site-tour": SiteTourPanel,
  "env-diff": EnvDiffPanel,
  "arcade-lab": ArcadeLabPanel,
  "echo-lab": EchoLabPanel,
  experimental: ExperimentalPanel,
};

export const PANEL_LABELS: Record<PanelId, string> = {
  workspace: "Workspace",
  "route-health": "Route Health",
  "api-tester": "API Tester",
  integrations: "Integrations",
  changelog: "Changelog",
  experiments: "Experiments",
  "error-log": "Error Log",
  "site-tour": "Site tour",
  "env-diff": "Env diff",
  "arcade-lab": "Arcade lab",
  "echo-lab": "Echo lab",
  experimental: "Experimental",
};
