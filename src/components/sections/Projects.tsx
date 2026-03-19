import { useState, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  ExternalLink,
  Github,
  Zap,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { projects, projectCategories, type Project } from "@/data/projects";

const MissionDossierModal = lazy(() =>
  import("@/components/modals/MissionDossierModal").then((m) => ({ default: m.MissionDossierModal }))
);
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC MISSION ARCHIVE — Swipeable project cards with Notion / Live / GitHub
// ═══════════════════════════════════════════════════════════════════════════════

const SWIPE_THRESHOLD = 50;
const DRAG_ELASTICITY = 0.15;

/** Notion icon SVG (inline to avoid extra dependency) */
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

/** Quick-action link buttons row */
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
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono
            bg-white/5 border border-white/10 text-slate-300
            hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:text-neon-cyan
            transition-all duration-200"
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
}

/** Single archive card — used inside the carousel */
function ArchiveCard({
  project,
  onOpenDossier,
}: {
  project: Project;
  onOpenDossier: () => void;
}) {
  const glowColor = project.category === "ai" ? "168, 85, 247" : "0, 245, 255";

  return (
    <HoloCard
      padding="p-0"
      className="h-full flex flex-col select-none"
      glowColor={glowColor}
    >
      <div className="p-6 pb-0 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {project.status === "classified" && (
              <span className="flex items-center gap-1 text-[10px] text-neon-cyan/80 px-1.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 font-mono animate-[glowPulse_3s_ease-in-out_infinite]">
                <Shield size={9} /> CLASSIFIED
              </span>
            )}
            {project.featured && (
              <span className="flex items-center gap-1 text-[10px] text-neon-purple/80 px-1.5 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 font-mono">
                <Zap size={10} /> Featured
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-600 font-mono">
            {String(projects.indexOf(project) + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 font-display mb-2 leading-tight">
          {project.title}
        </h3>

        {/* Metrics (terminal-style projects) */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-3 flex flex-col gap-1">
            {project.metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neon-cyan/60">&gt;</span>
                <span className="text-slate-400">{m.label}:</span>
                <span className="text-neon-cyan font-semibold">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-4 flex-1">
          {project.description}
        </p>

        {/* Impact */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-neon-purple/8 border border-neon-purple/20 text-[11px] font-mono text-neon-purple font-semibold self-start">
          {project.impact}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} color={project.category === "ai" ? "purple" : "cyan"} />
          ))}
        </div>

        {/* Action links */}
        <ProjectLinks project={project} className="mb-4" />
      </div>

      {/* Footer — open dossier */}
      <button
        onClick={onOpenDossier}
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5
          border-t border-white/6 text-xs font-mono
          text-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/5
          transition-all duration-200 cursor-pointer"
      >
        <Eye size={12} />
        Open Full Dossier
      </button>
    </HoloCard>
  );
}

/** Swipeable carousel with drag gestures */
function MissionCarousel({
  items,
  onOpenDossier,
}: {
  items: Project[];
  onOpenDossier: (p: Project) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Clamp active index when filtered list changes
  const clampedIndex = Math.min(activeIndex, items.length - 1);
  if (clampedIndex !== activeIndex) setActiveIndex(clampedIndex);

  const paginate = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
  };

  if (items.length === 0) {
    return (
      <p className="text-center text-slate-500 font-mono text-sm py-16">
        No missions in this category.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div ref={constraintsRef} className="overflow-hidden relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={items[clampedIndex].id}
            initial={{ opacity: 0, x: 200, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -200, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={DRAG_ELASTICITY}
            onDragEnd={handleDragEnd}
            className="w-full max-w-xl mx-auto touch-pan-y"
          >
            <ArchiveCard
              project={items[clampedIndex]}
              onOpenDossier={() => onOpenDossier(items[clampedIndex])}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous mission"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6
              w-10 h-10 rounded-full bg-navy-950/80 border border-white/10
              flex items-center justify-center text-slate-400
              hover:text-neon-cyan hover:border-neon-cyan/30 transition-all z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next mission"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6
              w-10 h-10 rounded-full bg-navy-950/80 border border-white/10
              flex items-center justify-center text-slate-400
              hover:text-neon-cyan hover:border-neon-cyan/30 transition-all z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Mission pagination">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              role="tab"
              aria-selected={i === clampedIndex}
              aria-label={`Go to ${item.title}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === clampedIndex
                  ? "w-8 bg-neon-cyan shadow-[0_0_8px_rgba(0,245,255,0.4)]"
                  : "w-1.5 bg-slate-700 hover:bg-slate-500",
              )}
            />
          ))}
        </div>
      )}
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
        <AnimatedSection delay={0.1} className="mb-10">
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

        {/* Swipeable mission carousel */}
        <AnimatedSection delay={0.2}>
          <MissionCarousel
            items={filteredProjects}
            onOpenDossier={(p) => setSelectedProject(p)}
          />
        </AnimatedSection>

        {/* Swipe hint */}
        <AnimatedSection delay={0.3}>
          <p className="text-center text-[10px] text-slate-600 font-mono mt-4 select-none">
            Swipe or use arrows to navigate missions
          </p>
        </AnimatedSection>

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
