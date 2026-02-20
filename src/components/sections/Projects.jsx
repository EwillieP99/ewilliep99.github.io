import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { Tag } from "../ui/Tag.jsx";
import { projects, plays } from "../../data/projects.js";

function TerminalCard({ project }) {
  return (
    <div className="terminal-card p-6 h-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-slate-500 font-mono ml-2">{project.title}</span>
      </div>

      {/* Metrics */}
      {project.metrics?.length > 0 && (
        <div className="mb-4 flex flex-col gap-1.5">
          {project.metrics.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-accent-cyan/60">›</span>
              <span className="text-slate-400">{m.label}:</span>
              <span className="text-accent-cyan font-semibold">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-400 leading-relaxed mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  if (project.type === "terminal") {
    return (
      <AnimatedSection>
        <TerminalCard project={project} />
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <GlassCard featured={project.featured} padding="p-6" className="h-full flex flex-col">
        <h3 className="font-semibold text-slate-100 mb-2">{project.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        {project.links?.length > 0 && (
          <div className="flex gap-3 pt-2 border-t border-white/6">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-blue hover:underline"
              >
                {link.label} →
              </a>
            ))}
          </div>
        )}
      </GlassCard>
    </AnimatedSection>
  );
}

function PlaysAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-16">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-px h-6 bg-gradient-to-b from-accent-purple to-transparent" />
          <h3 className="text-lg font-semibold text-slate-200">Playbook</h3>
          <span className="text-xs text-slate-500 font-mono">— tactical repeatable motions</span>
        </div>
      </AnimatedSection>

      <div className="flex flex-col gap-2">
        {plays.map((play, i) => (
          <AnimatedSection key={play.id} delay={i * 0.05}>
            <div
              className="glass-card overflow-hidden cursor-pointer"
              onClick={() => setOpen(open === play.id ? null : play.id)}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-accent-purple text-xs font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-slate-200 text-sm">{play.title}</span>
                </div>
                <motion.span
                  animate={{ rotate: open === play.id ? 45 : 0 }}
                  className="text-slate-500 text-lg leading-none"
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
                    <div className="px-5 pb-4 pt-0 border-t border-white/6">
                      <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                        {play.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {play.tags.map((tag) => (
                          <Tag key={tag} label={tag} />
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
  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Projects" sub="Systems, tools, and process IP" />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <PlaysAccordion />
    </section>
  );
}
