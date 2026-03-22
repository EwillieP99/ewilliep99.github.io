import { useState, lazy, Suspense, type ReactNode } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Zap,
  Shield,
  Eye,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { projects, projectCategories, type Project } from "@/data/projects";
import { navCodename } from "@/data/navSections";
import { hudType } from "@/lib/sectionTypography";
import { cn } from "@/lib/utils";

const MissionDossierModal = lazy(() =>
  import("@/components/modals/MissionDossierModal").then((m) => ({ default: m.MissionDossierModal }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION ARCHIVE — Responsive grid (scan all missions at once)
// ═══════════════════════════════════════════════════════════════════════════════

function NotionIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z"
        fill="currentColor"
      />
      <path
        d="M61.35.227l-55.333 4.087C.554 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113L88.723 96.08c5.437-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.832-2.836-3.443-4.733L74.167 3.14C69.893.14 68.147-.357 61.35.227zM25.5 19.22c-5.2.332-6.382.408-9.34-2.1L7.7 10.053c-.776-.78-.388-1.753 1.164-1.947l52.533-3.89c4.47-.387 6.797 1.167 8.543 2.527l10.083 7.397c.388.193.97 1.363-.193 1.363l-54.52 3.52.19.197zM19.1 88.3V33.967c0-2.527.776-3.697 3.103-3.893L86.2 26.38c2.14-.193 3.107 1.167 3.107 3.693v53.94c0 2.527-.388 4.667-3.883 4.863l-60.377 3.5c-3.497.193-5.047-.97-5.947-4.077zM77.3 38.507c.387 1.75 0 3.5-1.75 3.7l-2.917.577v39.907c-2.527 1.36-4.853 2.137-6.797 2.137-3.107 0-3.883-.97-6.217-3.887l-19.03-29.94v28.967l6.02 1.363s0 3.5-4.857 3.5l-13.393.777c-.39-.78 0-2.723 1.357-3.11l3.497-.97V42.573l-4.853-.388c-.387-1.75.583-4.277 3.3-4.473l14.367-.967 19.8 30.327V40.44l-5.053-.58c-.39-2.143 1.163-3.7 3.103-3.89l13.4-.463z"
        fill="var(--bg-color, #0a0f1c)"
      />
    </svg>
  );
}

function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  const links = [
    project.notionUrl && { href: project.notionUrl, label: "Notion", icon: <NotionIcon size={13} /> },
    project.liveUrl && { href: project.liveUrl, label: "Live Demo", icon: <ExternalLink size={13} /> },
    project.githubUrl && { href: project.githubUrl, label: "GitHub", icon: <Github size={13} /> },
    ...project.links.map((l) => ({
      href: l.href,
      label: l.label,
      icon: l.label.toLowerCase().includes("github") ? <Github size={13} /> : <ExternalLink size={13} />,
    })),
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  if (links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={hudType.linkChip}
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
}

function MissionGridCard({
  project,
  index,
  total,
  onOpenDossier,
}: {
  project: Project;
  index: number;
  total: number;
  onOpenDossier: () => void;
}) {
  const glowColor = project.category === "ai" ? "168, 85, 247" : "0, 245, 255";
  const tagLimit = 4;
  const extraTags = project.tags.length - tagLimit;

  return (
    <HoloCard padding="p-0" className="h-full min-h-0 flex flex-col" glowColor={glowColor}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {project.status === "classified" && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-2 py-1 text-neon-cyan/80",
                  hudType.monoPill,
                )}
              >
                <Shield size={10} strokeWidth={2} aria-hidden />
                <span className="font-semibold">Classified</span>
              </span>
            )}
            {project.featured && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full border border-neon-purple/20 bg-neon-purple/10 px-2 py-1 text-neon-purple/85",
                  hudType.monoPill,
                )}
              >
                <Zap size={10} strokeWidth={2} aria-hidden />
                Featured
              </span>
            )}
          </div>
          <span className={cn(hudType.indexCounter, "shrink-0")}>
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>

        <h3 className={hudType.cardTitle}>{project.title}</h3>

        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-col gap-1">
            {project.metrics.slice(0, 3).map((m, i) => (
              <div key={i} className={hudType.metricRow}>
                <span className="text-neon-cyan/50">&gt;</span>
                <span className={hudType.metricLabel}>{m.label}:</span>
                <span className={hudType.metricValue}>{m.value}</span>
              </div>
            ))}
          </div>
        )}

        <p className={cn(hudType.cardBody, "line-clamp-3 flex-1")}>{project.description}</p>

        <div className={cn(hudType.impactStrip, "max-w-full self-start line-clamp-2")}>{project.impact}</div>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, tagLimit).map((tag) => (
            <Tag key={tag} label={tag} color={project.category === "ai" ? "purple" : "cyan"} />
          ))}
          {extraTags > 0 && (
            <span className={cn(hudType.monoPill, "px-2 py-1 text-slate-500")}>+{extraTags}</span>
          )}
        </div>

        <ProjectLinks project={project} />
      </div>

      <button
        type="button"
        onClick={onOpenDossier}
        className={cn(
          "mt-auto flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-3",
          hudType.missionCta,
        )}
      >
        <Eye size={12} strokeWidth={2} aria-hidden />
        Open full dossier
      </button>
    </HoloCard>
  );
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <section id="projects" className="section-shell" aria-label="Projects section">
        <AnimatedSection>
          <SectionHeader
            codename={navCodename("projects")}
            label="Mission Archive"
            sub="Systems, tools, and process IP — scan the grid or open a dossier"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <p className="type-overline">Filter</p>
          <LayoutGroup id="mission-filter">
            <div
              className="flex flex-wrap gap-2 section-toolbar-gap"
              role="tablist"
              aria-label="Project filter"
            >
              {projectCategories.map((cat) => {
                const isActive = activeFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveFilter(cat.id)}
                    role="tab"
                    aria-selected={isActive}
                    className={cn(
                      "relative z-0 overflow-hidden rounded-full px-3 py-1.5 text-xs font-mono transition-colors",
                      isActive
                        ? "border border-transparent text-neon-cyan"
                        : "border border-white/10 text-slate-400 hover:border-neon-cyan/20 hover:text-neon-cyan",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mission-filter-glow"
                        className="absolute inset-0 -z-10 rounded-full border border-neon-cyan/40 bg-neon-cyan/10"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </AnimatedSection>

        <div className="section-card-grid sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, i) => (
            <AnimatedSection key={project.id} delay={Math.min(i * 0.04, 0.24)} className="h-full">
              <MissionGridCard
                project={project}
                index={i}
                total={filteredProjects.length}
                onOpenDossier={() => setSelectedProject(project)}
              />
            </AnimatedSection>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className={cn(hudType.cardMeta, "py-16 text-center font-mono")}>
            No missions in this category.
          </p>
        )}
      </section>

      <Suspense fallback={null}>
        <MissionDossierModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </Suspense>
    </>
  );
}
