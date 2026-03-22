import type { SectionId } from "@/data/navSections";

export const SECTION_PROMPTS: Record<SectionId | "default", string[]> = {
  home: [
    "Give me a 30-second intro for Ethan",
    "What role is Ethan best suited for?",
    "Summarize this portfolio quickly",
  ],
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
    "Which capabilities are strongest and why?",
    "What evidence supports Ethan's GTM depth?",
    "How technical is Ethan for a GTM role?",
  ],
  projects: [
    "Which project best shows Ethan's ability to ship end-to-end?",
    "Summarize Resonate for a technical stakeholder in 60 seconds.",
    "What metrics from the mission archive matter most for a GTM hire?",
  ],
  games: [
    "What makes Signal Breach a strong portfolio piece?",
    "How does the arcade section reflect Ethan's product taste?",
    "What would you build as a second browser game for this portfolio?",
  ],
  contact: [
    "Draft a compelling intro email for Ethan",
    "Why should I hire Ethan for my team?",
    "What's the best way to reach Ethan?",
  ],
  ai: [
    "Draft a recruiter outreach message for Ethan",
    "Write interview questions for this profile",
    "Create a 90-day onboarding plan for Ethan",
  ],
  default: [
    "Pitch me on Ethan like I'm a skeptical recruiter",
    "Build me a 67% conversion GTM playbook for AI tools",
    "What should I know about Ethan in 60 seconds?",
    "Help me improve my resume for AI roles",
  ],
};
