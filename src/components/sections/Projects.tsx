import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Zap, Shield, Eye } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { Card, TerminalCard } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { projects, projectCategories, plays, type Project } from "@/data/projects";

// Lazy-load the modal to keep initial bundle small
const MissionDossierModal = lazy(() =>
  import("@/components/modals/MissionDossierModal").then((m) => ({ default: m.MissionDossierModal }))
);
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION ARCHIVE — Clickable project cards with full-screen dossier modal
// ═══════════════════════════════════════════════════════════════════════════════

/** Terminal-style project card with metrics */
function TerminalProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <AnimatedSection>
      <div
        onClick={onClick}
        className="cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
        aria-label={`Open ${project.title} dossier`}
      >
        <TerminalCard className="h-full transition-all duration-300 group-hover:border-neon-cyan/40 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.08)]">
          <div className="flex items-center gap-2 -mt-2 mb-3">
            <span className="text-xs text-slate-500 font-mono">{project.title}</span>
            <div className="flex items-center gap-1.5 ml-auto">
              {project.status === "classified" && (
                <span className="flex items-center gap-1 text-[10px] text-neon-cyan/80 px-1.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 font-mono animate-[glowPulse_3s_ease-in-out_infinite]">
                  <Shield size={9} /> CLASSIFIED
                </span>
              )}
              {project.featured && (
                <span className="flex items-center gap-1 text-[10px] text-neon-purple/80 px-1.5 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
                  <Zap size={10} /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="mb-4 flex flex-col gap-1.5">
              {project.metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neon-cyan/60">&gt;</span>
                  <span className="text-slate-400">{m.label}:</span>
                  <span className="text-neon-cyan font-semibold">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-slate-400 leading-relaxed mb-3">{project.description}</p>

          {/* Impact badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple/80">
            {project.impact}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} color="cyan" />
            ))}
          </div>

          {/* View dossier hint */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neon-cyan/40 group-hover:text-neon-cyan/70 transition-colors">
            <Eye size={10} />
            Click to open full dossier
          </div>
        </TerminalCard>
      </div>
    </AnimatedSection>
  );
}

/** Standard glass project card — clickable */
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  if (project.type === "terminal") {
    return <TerminalProjectCard project={project} onClick={onClick} />;
  }

  return (
    <AnimatedSection>
      <div
        onClick={onClick}
        className="cursor-pointer group h-full"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
        aria-label={`Open ${project.title} dossier`}
      >
        <HoloCard
          padding="p-6"
          className="h-full flex flex-col"
          glowColor={project.category === "ai" ? "168, 85, 247" : "0, 245, 255"}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-100 font-display group-hover:text-neon-cyan transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5">
              {project.status === "classified" && (
                <span className="flex items-center gap-1 text-[10px] text-neon-cyan/80 px-1.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 font-mono animate-[glowPulse_3s_ease-in-out_infinite]">
                  <Shield size={9} /> CLASSIFIED
                </span>
              )}
              {project.featured && (
                <span className="flex items-center gap-1 text-[10px] text-neon-purple/80 px-1.5 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20">
                  <Zap size={10} /> Featured
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-3">{project.description}</p>

          {/* Impact badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple/80 self-start">
            {project.impact}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Links + dossier hint */}
          <div className="flex items-center justify-between pt-3 border-t border-white/6">
            {project.links.length > 0 && (
              <div className="flex gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.label.toLowerCase().includes("github") ? (
                      <Github size={12} />
                    ) : (
                      <ExternalLink size={12} />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-neon-cyan/40 group-hover:text-neon-cyan/70 transition-colors ml-auto">
              <Eye size={10} />
              Open Dossier
            </span>
          </div>
        </HoloCard>
      </div>
    </AnimatedSection>
  );
}

/** Playbook accordion section */
function PlaybookSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-16">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-px h-6 bg-gradient-to-b from-neon-purple to-transparent" />
          <h3 className="text-lg font-semibold text-slate-200 font-display">Playbook</h3>
          <span className="text-xs text-slate-500 font-mono">— tactical repeatable motions</span>
        </div>
      </AnimatedSection>

      <div className="flex flex-col gap-2">
        {plays.map((play, i) => (
          <AnimatedSection key={play.id} delay={i * 0.05}>
            <div
              className="glass-card overflow-hidden cursor-pointer hover:border-neon-purple/30 transition-all"
              onClick={() => setOpen(open === play.id ? null : play.id)}
              role="button"
              aria-expanded={open === play.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(open === play.id ? null : play.id);
                }
              }}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-neon-purple text-xs font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-slate-200 text-sm">{play.title}</span>
                </div>
                <motion.span
                  animate={{ rotate: open === play.id ? 45 : 0 }}
                  className="text-neon-cyan text-lg leading-none"
                >
                  +
                </motion.span>
              </div>
              <AnimatePresence>
                {open === play.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0 border-t border-neon-cyan/10">
                      <p className="text-sm text-slate-400 mt-3 leading-relaxed">{play.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {play.tags.map((tag) => (
                          <Tag key={tag} label={tag} color="purple" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <section id="projects" className="max-w-6xl mx-auto px-6 py-24" aria-label="Projects section">
        <AnimatedSection>
          <SectionHeader
            codename="// 04"
            label="Mission Archive"
            sub="Systems, tools, and process IP"
          />
        </AnimatedSection>

        {/* Category filters */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project filter">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                role="tab"
                aria-selected={activeFilter === cat.id}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border",
                  activeFilter === cat.id
                    ? "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan"
                    : "bg-transparent border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Project grid */}
        <motion.div layout className="grid sm:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <PlaybookSection />
      </section>

      {/* Dossier Modal (lazy-loaded) */}
      <Suspense fallback={null}>
        <MissionDossierModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Suspense>
    </>
  );
}
