// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Mission archive (Notion when synced, else static)
// ═══════════════════════════════════════════════════════════════════════════════

export type { Project, ProjectLink, ProjectMetric } from "./projectTypes";
import type { Project } from "./projectTypes";
import { projectsFromNotion } from "../generated/notion/projects-import";
import { projectCategories, staticProjects } from "./projectsStatic";

export const projects: Project[] =
  projectsFromNotion.length > 0 ? projectsFromNotion : staticProjects;

export { projectCategories };
