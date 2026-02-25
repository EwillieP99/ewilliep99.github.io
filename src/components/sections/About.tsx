import { motion } from "framer-motion";
import { Linkedin, Github, Twitter, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bio, holoStats } from "@/data/bio";

/** Holographic photo card with floating stats and glitch border */
function HolographicPhoto() {
  return (
    <Card padding="p-3" hover className="relative group">
      {/* HUD brackets */}
      <div className="hud-bracket hud-bracket-tl" />
      <div className="hud-bracket hud-bracket-tr" />
      <div className="hud-bracket hud-bracket-bl" />
      <div className="hud-bracket hud-bracket-br" />

      {/* Photo */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={bio.avatar}
          alt={`${bio.name} — ${bio.headline}`}
          className="w-full object-cover aspect-square"
          loading="lazy"
        />
        {/* Scan line overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-[scanLine_4s_linear_infinite] pointer-events-none" />
        {/* Color overlay on hover */}
        <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Name + title */}
      <div className="mt-3 px-1 pb-1">
        <p className="text-sm font-semibold text-slate-200 font-display">{bio.name}</p>
        <p className="text-xs text-neon-cyan/60 font-mono mt-0.5">
          {bio.major} · {bio.university}
        </p>
      </div>

      {/* Floating stats */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {holoStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-navy-950/80 border border-neon-cyan/15 rounded-lg px-2.5 py-2 text-center"
          >
            <p className="text-sm font-bold text-neon-cyan font-display">{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-mono">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24" aria-label="About section">
      <AnimatedSection>
        <SectionHeader
          codename="// 01"
          label="Operator Profile"
          sub="Origin story + operating system"
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Holographic photo */}
        <AnimatedSection className="md:col-span-2" delay={0.05}>
          <HolographicPhoto />
        </AnimatedSection>

        {/* Story + traits */}
        <AnimatedSection className="md:col-span-3 flex flex-col gap-6" delay={0.1}>
          <p className="text-slate-300 leading-relaxed text-lg">{bio.originStory}</p>
          <p className="text-slate-400 leading-relaxed">{bio.originStory2}</p>

          {/* Operating style card */}
          <Card padding="p-5">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
              Operating Style
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {bio.traits.map((trait, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-neon-cyan mt-0.5 flex-shrink-0">&gt;</span>
                  {trait}
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Education badge */}
          <Card padding="p-5">
            <p className="text-xs font-mono text-neon-purple/70 uppercase tracking-widest mb-3">
              Education
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-200 font-semibold">{bio.education.degree}</p>
              <p className="text-xs text-slate-400">{bio.education.university} · {bio.education.gradDate}</p>
              <p className="text-xs text-neon-cyan/80 mt-1">{bio.education.certificate}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {bio.education.certCourses.map((course) => (
                  <span
                    key={course}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple/80"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Social links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {bio.linkedinUrl && (
              <a
                href={bio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {bio.githubUrl && (
              <a
                href={bio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="GitHub profile"
              >
                <Github size={14} /> GitHub
              </a>
            )}
            {bio.twitterUrl && (
              <a
                href={bio.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                aria-label="Twitter profile"
              >
                <Twitter size={14} /> Twitter/X
              </a>
            )}
            <a
              href={`mailto:${bio.email}`}
              className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
              aria-label="Send email"
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
