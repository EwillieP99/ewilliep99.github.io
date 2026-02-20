import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { skills } from "../../data/skills.js";

function SkillPill({ label, level }) {
  const cls =
    level === "core"
      ? "skill-pill skill-core"
      : level === "proficient"
      ? "skill-pill skill-proficient"
      : "skill-pill skill-familiar";

  return <span className={cls}>{label}</span>;
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
        <div className="flex flex-wrap gap-2">
          {col.items.map((item) => (
            <SkillPill key={item.label} label={item.label} level={item.level} />
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
          <span className="skill-pill skill-core text-xs px-2 py-0.5">Core</span>
          <span>High-use, confident</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="skill-pill skill-proficient text-xs px-2 py-0.5">Proficient</span>
          <span>Active, developing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="skill-pill skill-familiar text-xs px-2 py-0.5">Familiar</span>
          <span>Working knowledge</span>
        </div>
      </AnimatedSection>
    </section>
  );
}
