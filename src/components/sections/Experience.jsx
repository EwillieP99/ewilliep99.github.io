import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { Tag } from "../ui/Tag.jsx";
import { experience } from "../../data/experience.js";

function TimelineItem({ item, index }) {
  return (
    <AnimatedSection delay={index * 0.07}>
      <GlassCard padding="p-6" className="relative">
        {/* Timeline dot */}
        <div className="absolute -left-[1.85rem] top-7 w-3 h-3 rounded-full bg-accent-blue shadow-glow-blue hidden md:block" />

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <span className="font-bold text-slate-100">{item.org}</span>
          <span className="text-slate-400 text-sm">·</span>
          <span className="text-accent-blue text-sm font-medium">{item.role}</span>
          <span className="ml-auto text-xs font-mono text-slate-500">{item.dates}</span>
        </div>

        {item.location && (
          <p className="text-xs text-slate-600 mb-3 font-mono">{item.location}</p>
        )}

        <ul className="flex flex-col gap-1.5 mb-4">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-accent-blue/60 mt-1 flex-shrink-0 text-xs">▸</span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </GlassCard>
    </AnimatedSection>
  );
}

export function Experience() {
  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Experience" />
      </AnimatedSection>

      {/* Timeline track */}
      <div className="relative md:ml-8">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue/40 via-purple-400/20 to-transparent hidden md:block" />

        <div className="flex flex-col gap-5 md:pl-8">
          {experience.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
