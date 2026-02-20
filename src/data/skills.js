// ─── SKILLS ───────────────────────────────────────────────────────────────────
// level: "core" = cyan bar, "proficient" = purple bar, "familiar" = subtle gray bar
// value: numeric percentage for the animated bar width
// Edit freely — add, remove, or reorder items in each column.

export const skills = {
  gtmSales: {
    label: "GTM / Sales",
    icon: "📈",
    items: [
      { label: "Outbound Prospecting", level: "core", value: 95 },
      { label: "Cold Outreach & Follow-Up", level: "core", value: 95 },
      { label: "Ambassador Program Design", level: "core", value: 95 },
      { label: "Discovery & Qualification", level: "core", value: 95 },
      { label: "Event-Led Growth", level: "proficient", value: 75 },
      { label: "Workshop Facilitation", level: "proficient", value: 75 },
      { label: "CRM (HubSpot / Salesforce)", level: "proficient", value: 75 },
      { label: "Community GTM", level: "core", value: 95 },
    ],
  },
  aiTools: {
    label: "AI / Tools",
    icon: "🤖",
    items: [
      { label: "Perplexity AI", level: "core", value: 95 },
      { label: "ChatGPT / Claude", level: "core", value: 95 },
      { label: "AI Workflow Design", level: "proficient", value: 75 },
      { label: "Prompt Engineering", level: "proficient", value: 75 },
      { label: "Notion / Notion AI", level: "core", value: 95 },
      { label: "Zapier / Make", level: "proficient", value: 75 },
      { label: "Comet Dashboards", level: "proficient", value: 75 },
      { label: "HiperGator (UF)", level: "familiar", value: 50 },
    ],
  },
  techLiteracy: {
    label: "Tech Literacy",
    icon: "💡",
    items: [
      { label: "Data Storytelling", level: "core", value: 95 },
      { label: "Dashboard Design", level: "proficient", value: 75 },
      { label: "Product Intuition", level: "proficient", value: 75 },
      { label: "Research & Synthesis", level: "core", value: 95 },
      { label: "Spreadsheet Modeling", level: "proficient", value: 75 },
      { label: "HTML / CSS basics", level: "familiar", value: 50 },
      { label: "Python / SQL basics", level: "familiar", value: 50 },
      { label: "Node / CLI", level: "familiar", value: 50 },
    ],
  },
};
