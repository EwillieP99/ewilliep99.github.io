import { motion } from "framer-motion";
import { CTAButton } from "../ui/CTAButton.jsx";
import { meta } from "../../data/meta.js";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="orb w-[500px] h-[500px] bg-purple-500"
        style={{ top: "-10%", right: "-15%", animationDelay: "0s" }}
      />
      <div
        className="orb w-[400px] h-[400px] bg-cyan-400"
        style={{ bottom: "5%", left: "-10%", animationDelay: "3s", opacity: 0.09 }}
      />
      <div
        className="orb w-[300px] h-[300px] bg-accent-blue"
        style={{ top: "40%", left: "25%", animationDelay: "1.5s", opacity: 0.07 }}
      />

      <motion.div
        className="relative z-10 max-w-3xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={item} className="mb-4">
          <span className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-accent-cyan/80">
            {meta.university} · {meta.major} · {meta.location}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">{meta.name}</span>
        </motion.h1>

        {/* One-liner */}
        <motion.p
          variants={item}
          className="text-xl sm:text-2xl font-light text-slate-300 leading-relaxed mb-4"
        >
          {meta.heroOneLiner}
        </motion.p>

        {/* Sub-line */}
        <motion.p
          variants={item}
          className="text-sm text-slate-500 mb-10"
        >
          {meta.heroSub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <CTAButton
            label="View Resume"
            href={meta.resumePdf}
            variant="primary"
            download
            icon="↓"
          />
          <CTAButton
            label="Book Time"
            href={meta.calendlyUrl}
            variant="secondary"
            icon="📅"
          />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-xs text-slate-600 font-mono tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
        />
      </motion.div>
    </section>
  );
}
