import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { meta } from "../../data/meta.js";

// ─── EDIT THIS CONTENT ─────────────────────────────────────────────────────────
const ORIGIN_STORY = `
  I didn't take the straight road. I started in real estate, pivoted to computer science,
  then entrepreneurship, then professional selling, and finally landed in Mass Communications —
  not because I was lost, but because I was looking for the intersection of business, technology,
  and storytelling. Turns out, that intersection is exactly where I want to operate.
`.trim();

const ORIGIN_STORY_2 = `
  That path gave me something most people don't have at 21: a real feel for how products get
  built, how they get sold, and how they get explained. I've built systems to run my own life,
  led teams to grow a campus AI network, and learned to distill complicated things into language
  that moves people to action.
`.trim();

// Short operating-style bullets
const TRAITS = [
  "Systems thinker — I build processes before I scale effort",
  "High-trust communicator — I meet people where they are",
  "Bias toward action — I prefer learning by doing over over-planning",
  "AI-fluent — I use AI as leverage, not a crutch",
];
// ───────────────────────────────────────────────────────────────────────────────

export function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="About" />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Photo */}
        <AnimatedSection className="md:col-span-2" delay={0.05}>
          <GlassCard padding="p-3" hover={false}>
            <img
              src={meta.avatar}
              alt={meta.name}
              className="w-full rounded-xl object-cover aspect-square"
            />
            <div className="mt-3 px-1 pb-1">
              <p className="text-sm font-semibold text-slate-200">{meta.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {meta.major} · {meta.university}
              </p>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Story + traits */}
        <AnimatedSection className="md:col-span-3 flex flex-col gap-6" delay={0.1}>
          <p className="text-slate-300 leading-relaxed">{ORIGIN_STORY}</p>
          <p className="text-slate-400 leading-relaxed">{ORIGIN_STORY_2}</p>

          <GlassCard padding="p-5">
            <p className="text-xs font-mono text-accent-cyan/70 uppercase tracking-widest mb-3">
              Operating Style
            </p>
            <ul className="flex flex-col gap-2">
              {TRAITS.map((trait, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-accent-blue mt-0.5 flex-shrink-0">▸</span>
                  {trait}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Social links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {meta.linkedinUrl && (
              <a href={meta.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3">LinkedIn</a>
            )}
            {meta.githubUrl && (
              <a href={meta.githubUrl} target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3">GitHub</a>
            )}
            {meta.twitterUrl && (
              <a href={meta.twitterUrl} target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3">Twitter / X</a>
            )}
            <a href={`mailto:${meta.email}`}
              className="btn-secondary text-xs py-2 px-3">Email</a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
