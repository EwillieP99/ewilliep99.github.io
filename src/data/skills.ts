// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Skills (Augmentations)
// 25+ skills across 5 categories with proficiency + usage context
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
    id: "frontend",
    label: "Frontend",
    icon: "Monitor",
    color: "#00f5ff",
    skills: [
      { label: "React", proficiency: 85, usedIn: "This portfolio + projects" },
      { label: "TypeScript", proficiency: 80, usedIn: "Portfolio, AI workflows" },
      { label: "Tailwind CSS", proficiency: 90, usedIn: "All web projects" },
      { label: "Framer Motion", proficiency: 82, usedIn: "Portfolio animations" },
      { label: "Three.js / R3F", proficiency: 70, usedIn: "3D hero scene" },
      { label: "Next.js", proficiency: 65, usedIn: "Learning, side projects" },
    ],
  },
  {
    id: "backend-ai",
    label: "Backend & AI",
    icon: "Brain",
    color: "#a855f7",
    skills: [
      { label: "Python", proficiency: 80, usedIn: "AI workflows, scripts" },
      { label: "Node.js", proficiency: 75, usedIn: "API integrations" },
      { label: "LangChain", proficiency: 70, usedIn: "AI agent prototypes" },
      { label: "OpenAI API", proficiency: 85, usedIn: "AI workflow stack" },
      { label: "Prompt Engineering", proficiency: 90, usedIn: "Daily AI leverage" },
      { label: "Basic TensorFlow", proficiency: 55, usedIn: "AI certificate coursework" },
    ],
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    icon: "Cloud",
    color: "#38bdf8",
    skills: [
      { label: "Vercel", proficiency: 85, usedIn: "Deployment pipeline" },
      { label: "GitHub Actions", proficiency: 80, usedIn: "CI/CD for portfolio" },
      { label: "AWS (S3/EC2)", proficiency: 60, usedIn: "Basic cloud ops" },
      { label: "Docker", proficiency: 55, usedIn: "Dev environments" },
      { label: "Vite", proficiency: 90, usedIn: "All frontend builds" },
    ],
  },
  {
    id: "business-sales",
    label: "Business & Tech Sales",
    icon: "TrendingUp",
    color: "#f472b6",
    skills: [
      { label: "Solution Selling", proficiency: 95, usedIn: "Geotarget, Perplexity" },
      { label: "Cold Outreach", proficiency: 95, usedIn: "$110K ARR pipeline" },
      { label: "Salesforce / HubSpot", proficiency: 80, usedIn: "CRM management" },
      { label: "Pipeline Management", proficiency: 90, usedIn: "B2B SaaS sales" },
      { label: "Tech Demos", proficiency: 90, usedIn: "15 workshops, 600+ students" },
      { label: "Negotiation", proficiency: 85, usedIn: "Deal closing, partnerships" },
    ],
  },
  {
    id: "tools-design",
    label: "Tools & Design",
    icon: "Wrench",
    color: "#22c55e",
    skills: [
      { label: "Notion", proficiency: 95, usedIn: "Life OS, team docs" },
      { label: "Figma", proficiency: 70, usedIn: "UI mockups, wireframes" },
      { label: "Canva", proficiency: 85, usedIn: "Event graphics, decks" },
      { label: "Excel / Sheets", proficiency: 90, usedIn: "Analytics, reporting" },
      { label: "Tableau", proficiency: 70, usedIn: "Data visualization" },
    ],
  },
];
