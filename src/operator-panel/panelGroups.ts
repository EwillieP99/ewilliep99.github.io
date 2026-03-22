import { PANEL_IDS, type PanelId } from "./panelIds";

export interface PanelGroupDef {
  id: string;
  /** Short label for sidebar section headers */
  label: string;
  panels: readonly PanelId[];
}

/**
 * Sidebar groups + sensible default order. Every panel id must appear exactly once.
 */
export const PANEL_GROUPS: PanelGroupDef[] = [
  { id: "deck", label: "Deck", panels: ["workspace"] },
  {
    id: "stack",
    label: "Stack",
    panels: ["route-health", "api-tester", "integrations", "env-diff"],
  },
  { id: "ship", label: "Ship", panels: ["changelog", "site-tour"] },
  {
    id: "lab",
    label: "Lab",
    panels: ["experiments", "experimental", "arcade-lab", "echo-lab"],
  },
  { id: "signals", label: "Signals", panels: ["error-log"] },
];

const _flat = PANEL_GROUPS.flatMap((g) => [...g.panels]);
if (_flat.length !== PANEL_IDS.length || new Set(_flat).size !== _flat.length) {
  throw new Error("panelGroups: each PANEL_IDS entry must appear exactly once in PANEL_GROUPS");
}
for (const id of PANEL_IDS) {
  if (!_flat.includes(id)) {
    throw new Error(`panelGroups: missing panel "${id}"`);
  }
}

export function groupForPanel(panelId: PanelId): PanelGroupDef | undefined {
  return PANEL_GROUPS.find((g) => g.panels.includes(panelId));
}
