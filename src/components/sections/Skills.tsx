import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Monitor, Brain, Cloud, TrendingUp, Wrench, X } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillGroups, type SkillGroup, type Skill } from "@/data/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// AUGMENTATIONS — Skill matrix with neural link hover + detail modals
// ═══════════════════════════════════════════════════════════════════════════════

// Map icon names to Lucide components
const iconMap: Record<string, typeof Monitor> = {
  Monitor,
  Brain,
  Cloud,
  TrendingUp,
  Wrench,
};

/** Skill detail modal */
function SkillDetailModal({
  skill,
  color,
  onClose,
}: {
  skill: Skill | null;
  color: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!skill) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [skill, onClose]);

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-detail-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-xl border bg-navy-950/95 backdrop-blur-2xl overflow-hidden"
            style={{ borderColor: `${color}30` }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
            />

            <div className="p-6">
              <button
                onClick={onClose}
                autoFocus
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>

              {/* Skill ring */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-full p-[3px] flex-shrink-0"
                  style={{
                    background: `conic-gradient(${color} ${skill.proficiency}%, rgba(255,255,255,0.06) 0%)`,
                    boxShadow: `0 0 20px ${color}30`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
                    <span className="text-sm font-bold font-mono" style={{ color }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 id="skill-detail-title" className="text-lg font-bold text-slate-100 font-display">{skill.label}</h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {skill.proficiency >= 90
                      ? "Core Skill"
                      : skill.proficiency >= 70
                        ? "Proficient"
                        : "Familiar"}
                  </p>
                </div>
              </div>

              {/* Used in */}
              <div className="mb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: `${color}99` }}>
                  Used In
                </p>
                <p className="text-sm text-slate-300">{skill.usedIn}</p>
              </div>

              {/* Proficiency bar */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-2">
                  Proficiency Level
                </p>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Neon progress ring for a single skill with neural link hover */
function SkillRing({
  skill,
  color,
  delay,
  onClick,
}: {
  skill: Skill;
  color: string;
  delay: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      aria-label={`${skill.label}: ${skill.proficiency}% — ${skill.usedIn}`}
    >
      {/* Neural link line — draws from ring to tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-1/2 left-1/2 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="absolute -top-8 -left-2"
              width="4"
              height="16"
              viewBox="0 0 4 16"
              aria-hidden
            >
              <motion.line
                x1="2" y1="16" x2="2" y2="0"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ring */}
      <div
        className={cn(
          "w-20 h-20 rounded-full p-[3px] mx-auto transition-all duration-300",
          hovered && "scale-110",
        )}
        style={{
          background: isInView
            ? `conic-gradient(${color} ${skill.proficiency}%, rgba(255,255,255,0.06) 0%)`
            : "rgba(255,255,255,0.06)",
          boxShadow: hovered ? `0 0 25px ${color}50, 0 0 50px ${color}15` : "none",
        }}
      >
        <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
          <span className="text-xs font-bold font-mono" style={{ color }}>
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className={cn(
        "text-xs text-center mt-2 font-medium transition-colors duration-200",
        hovered ? "text-slate-100" : "text-slate-300",
      )}>
        {skill.label}
      </p>

      {/* "Used in" tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 px-2.5 py-1 rounded-md bg-navy-900/95 border text-[10px] font-mono"
            style={{
              borderColor: `${color}30`,
              color: `${color}cc`,
              boxShadow: `0 0 10px ${color}10`,
            }}
          >
            {skill.usedIn}
            <span className="block text-[8px] text-slate-600 mt-0.5">Click for details</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** One skill category group */
function SkillGroupCard({
  group,
  index,
  onSkillClick,
}: {
  group: SkillGroup;
  index: number;
  onSkillClick: (skill: Skill, color: string) => void;
}) {
  const Icon = iconMap[group.icon] || Monitor;

  return (
    <AnimatedSection delay={index * 0.1}>
      <HoloCard padding="p-6" className="h-full" glowColor={hexToRgb(group.color)}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-lg"
            style={{ background: `${group.color}15`, border: `1px solid ${group.color}30` }}
          >
            <Icon size={18} style={{ color: group.color }} />
          </div>
          <h3 className="font-semibold text-slate-200 font-display">{group.label}</h3>
          <span className="ml-auto text-[10px] font-mono text-slate-600">
            {group.skills.length} skills
          </span>
        </div>

        {/* Skill rings grid */}
        <div className="grid grid-cols-3 gap-4">
          {group.skills.map((skill, i) => (
            <SkillRing
              key={skill.label}
              skill={skill}
              color={group.color}
              delay={i * 0.08}
              onClick={() => onSkillClick(skill, group.color)}
            />
          ))}
        </div>
      </HoloCard>
    </AnimatedSection>
  );
}

/** Convert hex color to "r, g, b" string for HoloCard */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<{ skill: Skill; color: string } | null>(null);

  return (
    <>
      <section id="augmentations" className="max-w-6xl mx-auto px-6 py-24" aria-label="Skills section">
        <AnimatedSection>
          <SectionHeader
            codename="// 03"
            label="Augmentations"
            sub="25+ skills across 5 domains — click any skill for details"
          />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, i) => (
            <SkillGroupCard
              key={group.id}
              group={group}
              index={i}
              onSkillClick={(skill, color) => setSelectedSkill({ skill, color })}
            />
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

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill?.skill ?? null}
        color={selectedSkill?.color ?? "#00f5ff"}
        onClose={() => setSelectedSkill(null)}
      />
    </>
  );
}
