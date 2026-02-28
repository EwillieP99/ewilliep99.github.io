// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Bio & Site Metadata
// ═══════════════════════════════════════════════════════════════════════════════

export const bio = {
  name: "Ethan Pecora",
  firstName: "Ethan",
  initials: "EP",

  // Hero
  headline: "Neon Operator",
  tagline: "Closing Tomorrow's Deals Today",
  heroOneLiner:
    "I build communities, sell ideas, and make AI make sense.",
  heroSub:
    "Business Administration @ UF · Graduating Fall 2026 · AI Certificate · Tech sales & GTM operator.",

  // Recruiter-facing blurb
  recruiterBlurb:
    "Generated $110K ARR in B2B SaaS sales, drove 400+ new users at Perplexity AI with a 67% conversion rate, and organized a 500+ attendee AI mixer. Graduating Fall 2026 with an AI Certificate from the University of Florida. Open to full-time roles in tech sales, GTM, and AI strategy.",

  // About / origin story
  originStory: `I didn't take the straight road. I went from real estate to computer science to entrepreneurship to professional selling and finally landed in Mass Communications — not because I was lost, but because I was building a toolkit. Each pivot taught me something: how products get built, how they get sold, and how complex ideas become stories that move people to action.`,

  originStory2: `That winding path turned into real results. I generated $110K in ARR as a sales development intern at Geotarget, drove 400+ new users at Perplexity AI with a 67% conversion rate across 15 workshops, and organized a 500+ attendee AI mixer that brought together 8 student orgs, 12 campus partners, and 5 industry sponsors. I sell, I build systems, and I get things across the finish line.`,

  traits: [
    "Solution Seller — I listen first, then prescribe",
    "Public Speaker — 15 workshops, 600+ students, comfortable on stage",
    "AI-Fluent — I use AI as daily leverage, not a buzzword",
    "Systems Builder — I create repeatable processes before I scale effort",
  ],

  // Education
  education: {
    degree: "B.S. Business Administration",
    university: "University of Florida",
    gradDate: "Fall 2026",
    certificate: "Artificial Intelligence Certificate",
    certCourses: ["AI Fundamentals", "Business Analytics & AI", "AI Ethics"],
  },

  // Contact & links
  email: "ethan.pecora@ufl.edu",
  phone: "6303346574",
  linkedinUrl: "https://linkedin.com/in/ethan-pecora",
  githubUrl: "https://github.com/ewilliep99",
  twitterUrl: "https://twitter.com/EwillieP",
  calendlyUrl: "https://calendly.com/YOUR_HANDLE",

  // Assets
  resumePdf: "/resume.pdf",
  avatar: "/assets/IMG_5245.jpeg",

  // Location
  university: "University of Florida",
  major: "Business Administration",
  location: "Gainesville, FL",
} as const;

// Floating stats displayed on the holographic photo card
export const holoStats = [
  { label: "Years in Sales", value: "3+" },
  { label: "AI Club", value: "Director" },
  { label: "ARR Generated", value: "$110K" },
  { label: "Users Driven", value: "400+" },
] as const;
