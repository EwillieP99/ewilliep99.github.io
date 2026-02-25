import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { meta } from "../../data/meta.js";

// ─── EDIT THIS CONTENT ─────────────────────────────────────────────────────────
const ORIGIN_STORY = `
  I didn't take the straight road. I went from real estate to computer science to
  entrepreneurship to professional selling and finally landed in Mass Communications —
  not because I was lost, but because I was building a toolkit. Each pivot taught me
  something: how products get built, how they get sold, and how complex ideas become
  stories that move people to action.
`.trim();

const ORIGIN_STORY_2 = `
  That winding path turned into real results. I generated $110K in ARR as a sales
  development intern at Geotarget, drove 400+ new users at Perplexity AI with a 67%
  conversion rate across 15 workshops, and organized a 500+ attendee AI mixer that
  brought together 8 student orgs, 12 campus partners, and 5 industry sponsors. I sell,
  I build systems, and I get things across the finish line.
`.trim();

// Short operating-style bullets
const TRAITS = [
  "Solution Seller — I listen first, then prescribe",
  "Public Speaker — 15 workshops, 600+ students, comfortable on stage",
  "AI-Fluent — I use AI as daily leverage, not a buzzword",
  "Systems Builder — I create repeatable processes before I scale effort",
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
