// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Skills (Augmentations)
// 5 consolidated categories with proficiency + usage context
// ═══════════════════════════════════════════════════════════════════════════════

export interface Skill {
  label: string;
  proficiency: number; // 0-100
  usedIn: string;      // Short context tag
}

export interface SkillGroup {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  color: string; // Neon color for the group
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "technical",
    label: "Technical Skills",
    icon: "Monitor",
    color: "#00f5ff",
    skills: [
      { label: "Python", proficiency: 80, usedIn: "Data scripting, automation, FastAPI" },
      { label: "Excel & Tableau", proficiency: 85, usedIn: "Analytics, dashboards, reporting" },
      { label: "Generative AI Tools", proficiency: 92, usedIn: "Perplexity, ChatGPT, Claude daily" },
      { label: "AI Prompt Engineering", proficiency: 90, usedIn: "Workflow automation, content gen" },
      { label: "CRM Tools", proficiency: 85, usedIn: "Salesforce, HubSpot pipeline mgmt" },
      { label: "Notion Systems", proficiency: 95, usedIn: "Life OS, team docs, workflow design" },
      { label: "Data Analysis", proficiency: 82, usedIn: "Visualization, reporting, insights" },
      { label: "React & TypeScript", proficiency: 85, usedIn: "Portfolio, Resonate, web projects" },
      { label: "Next.js", proficiency: 75, usedIn: "Resonate full-stack app" },
    ],
  },
  {
    id: "gtm-sales",
    label: "GTM & Sales",
    icon: "TrendingUp",
    color: "#f472b6",
    skills: [
      { label: "B2B Prospecting", proficiency: 95, usedIn: "$110K ARR at Geotarget" },
      { label: "Cold Outreach", proficiency: 95, usedIn: "Multi-channel pipeline building" },
      { label: "Pipeline Development", proficiency: 90, usedIn: "B2B SaaS sales cycles" },
      { label: "Objection Handling", proficiency: 90, usedIn: "Demo delivery, deal closing" },
      { label: "Lead Qualification", proficiency: 88, usedIn: "SDR frameworks, scoring" },
      { label: "ARR Generation", proficiency: 92, usedIn: "$110K in one semester" },
      { label: "Sales Workflow Optimization", proficiency: 85, usedIn: "CRM + AI automation" },
    ],
  },
  {
    id: "community",
    label: "Community & Programs",
    icon: "Users",
    color: "#22c55e",
    skills: [
      { label: "Ambassador Program Design", proficiency: 92, usedIn: "Perplexity campus network" },
      { label: "Onboarding Playbooks", proficiency: 90, usedIn: "8 university rollouts" },
      { label: "Event Execution", proficiency: 93, usedIn: "500+ attendee AI mixer" },
      { label: "Stakeholder Management", proficiency: 88, usedIn: "12 partners, 5 sponsors" },
      { label: "University Partnerships", proficiency: 85, usedIn: "5 campus programs" },
      { label: "Tabling & Career Fairs", proficiency: 88, usedIn: "Direct student outreach" },
    ],
  },
  {
    id: "ai-adoption",
    label: "AI Adoption & Education",
    icon: "Brain",
    color: "#a855f7",
    skills: [
      { label: "Workshop Facilitation", proficiency: 92, usedIn: "15 workshops, 600+ students" },
      { label: "AI Use Case Translation", proficiency: 90, usedIn: "CS, Business, Engineering audiences" },
      { label: "Conversion Optimization", proficiency: 88, usedIn: "67% trial-to-signup rate" },
      { label: "Cross-disciplinary Outreach", proficiency: 85, usedIn: "AI Club, multi-org events" },
      { label: "Agentic Workflows", proficiency: 75, usedIn: "LLM orchestration, tool use" },
      { label: "LLM Evaluation", proficiency: 72, usedIn: "Model selection, benchmarking" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Comms",
    icon: "Megaphone",
    color: "#f59e0b",
    skills: [
      { label: "Team Recruiting & Coaching", proficiency: 90, usedIn: "15+ ambassadors managed" },
      { label: "Performance Management", proficiency: 85, usedIn: "KPI tracking, feedback loops" },
      { label: "Panel Moderation", proficiency: 82, usedIn: "AI mixer, campus events" },
      { label: "Public Speaking", proficiency: 88, usedIn: "Workshops, demos, pitches" },
      { label: "Cross-functional Comms", proficiency: 85, usedIn: "Org leads, sponsors, faculty" },
    ],
  },
];
