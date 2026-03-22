// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Project types (shared by static data, Notion sync, UI)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "terminal" | "card";
  metrics?: ProjectMetric[];
  links: ProjectLink[];
  featured: boolean;
  impact: string;
  category: "sales" | "ai" | "systems";
  status?: "classified" | "active";
  notionUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  dossier?: {
    fullDescription: string;
    results: ProjectMetric[];
    debrief: string[];
  };
}
