import type { SectionId } from "@/components/hud/NavigationProvider";

export const SECTION_PROMPTS: Record<SectionId | "default", string[]> = {
  about: [
    "What makes Ethan different from other candidates?",
    "Summarize Ethan's background in 30 seconds",
    "What's Ethan's leadership style?",
  ],
  timeline: [
    "Walk me through Ethan's career progression",
    "What was the most impactful role Ethan has held?",
    "How did the Perplexity AI experience shape Ethan?",
  ],
  augmentations: [
    "What are Ethan's strongest technical skills?",
    "How does Ethan apply AI in real-world settings?",
    "Rate Ethan's GTM strategy experience",
  ],
  projects: [
    "Pitch me on Ethan's best project",
    "What's the tech stack behind this portfolio?",
    "How do these projects demonstrate business value?",
  ],
  games: [
    "How would you sell Verdant Siege to a VC in 60 seconds?",
    "What game design principles did Ethan use?",
    "Which game best shows Ethan's coding ability?",
  ],
  contact: [
    "Draft a compelling intro email for Ethan",
    "Why should I hire Ethan for my team?",
    "What's the best way to reach Ethan?",
  ],
  default: [
    "Pitch me on Ethan like I'm a skeptical recruiter",
    "Build me a 67% conversion GTM playbook for AI tools",
    "What should I know about Ethan in 60 seconds?",
    "Help me improve my resume for AI roles",
  ],
};
