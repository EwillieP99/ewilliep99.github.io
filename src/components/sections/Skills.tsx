import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Monitor, Brain, Cloud, TrendingUp, Wrench } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillGroups, type SkillGroup, type Skill } from "@/data/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Map icon names to Lucide components
const iconMap: Record<string, typeof Monitor> = {
  Monitor,
  Brain,
  Cloud,
  TrendingUp,
  Wrench,
};

/** Neon progress ring for a single skill */
function SkillRing({ skill, color, delay }: { skill: Skill; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-default"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay }}
    >
      {/* Ring */}
      <div
        className="w-20 h-20 rounded-full p-[3px] mx-auto transition-shadow duration-300"
        style={{
          background: isInView
            ? `conic-gradient(${color} ${skill.proficiency}%, rgba(255,255,255,0.06) 0%)`
            : "rgba(255,255,255,0.06)",
          boxShadow: hovered ? `0 0 20px ${color}40` : "none",
        }}
      >
        <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
          <span className="text-xs font-bold font-mono" style={{ color }}>
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-xs text-slate-300 text-center mt-2 font-medium">{skill.label}</p>

      {/* "Used in" tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 px-2 py-1 rounded bg-navy-900/95 border border-neon-cyan/20 text-[10px] text-neon-cyan/80 font-mono"
          >
            {skill.usedIn}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** One skill category group */
function SkillGroupCard({ group, index }: { group: SkillGroup; index: number }) {
  const Icon = iconMap[group.icon] || Monitor;

  return (
    <AnimatedSection delay={index * 0.1}>
      <Card padding="p-6" className="h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-lg"
            style={{ background: `${group.color}15`, border: `1px solid ${group.color}30` }}
          >
            <Icon size={18} style={{ color: group.color }} />
          </div>
          <h3 className="font-semibold text-slate-200 font-display">{group.label}</h3>
        </div>

        {/* Skill rings grid */}
        <div className="grid grid-cols-3 gap-4">
          {group.skills.map((skill, i) => (
            <SkillRing
              key={skill.label}
              skill={skill}
              color={group.color}
              delay={i * 0.08}
            />
          ))}
        </div>
      </Card>
    </AnimatedSection>
  );
}

export function Skills() {
  return (
    <section id="augmentations" className="max-w-6xl mx-auto px-6 py-24" aria-label="Skills section">
      <AnimatedSection>
        <SectionHeader
          codename="// 03"
          label="Augmentations"
          sub="25+ skills across 5 domains — hover for context"
        />
      </AnimatedSection>

      {/* Grid: 2 columns on lg, 1 on mobile. Top row has 3 smaller, bottom has 2 wider */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((group, i) => (
          <SkillGroupCard key={group.id} group={group} index={i} />
        ))}
      </div>

      {/* Legend */}
      <AnimatedSection delay={0.3} className="mt-8 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-3 h-3 rounded-full bg-neon-cyan" />
          90%+ Core
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-3 h-3 rounded-full bg-neon-purple" />
          70-89% Proficient
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-3 h-3 rounded-full bg-slate-500" />
          &lt;70% Familiar
        </div>
      </AnimatedSection>
    </section>
  );
}
