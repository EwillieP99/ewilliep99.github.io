import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { skills } from "../../data/skills.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

const barColors = {
  core: "bg-cyan-400",
  proficient: "bg-purple-400",
  familiar: "bg-slate-500",
};

const textColors = {
  core: "text-cyan-400",
  proficient: "text-purple-400",
  familiar: "text-slate-500",
};

function SkillBar({ label, level, value, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        <span className={`text-xs font-mono ${textColors[level]}`}>
          {level === "core" ? "Core" : level === "proficient" ? "Proficient" : "Familiar"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColors[level]}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.8, delay: index * 0.06, type: "spring", stiffness: 60, damping: 15 }
          }
        />
      </div>
    </div>
  );
}

function SkillColumn({ columnKey, index }) {
  const col = skills[columnKey];
  return (
    <AnimatedSection delay={index * 0.08}>
      <GlassCard padding="p-6" className="h-full">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{col.icon}</span>
          <h3 className="font-semibold text-slate-200">{col.label}</h3>
        </div>
        <div>
          {col.items.map((item, i) => (
            <SkillBar
              key={item.label}
              label={item.label}
              level={item.level}
              value={item.value}
              index={i}
            />
          ))}
        </div>
      </GlassCard>
    </AnimatedSection>
  );
}

export function Skills() {
  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Skills" />
      </AnimatedSection>

      <div className="grid sm:grid-cols-3 gap-5">
        {Object.keys(skills).map((key, i) => (
          <SkillColumn key={key} columnKey={key} index={i} />
        ))}
      </div>

      {/* Legend */}
      <AnimatedSection delay={0.25} className="mt-8 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-cyan-400" />
          <span>Core — High-use, confident</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-purple-400" />
          <span>Proficient — Active, developing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-slate-500" />
          <span>Familiar — Working knowledge</span>
        </div>
      </AnimatedSection>
    </section>
  );
}
