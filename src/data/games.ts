export interface GameLink {
  label: string;
  href: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  status: "live" | "coming-soon";
  tech: string[];
  links: GameLink[];
  highlight: string;
}

export const games: Game[] = [
  {
    id: "signal-breach",
    title: "Signal Breach",
    description:
      "Neon typing-defense arcade game with wave progression, combo scoring, and integrity decay. Built as a fast replay loop with cyber-terminal UI.",
    status: "live",
    tech: ["JavaScript", "Tailwind", "Arcade Loop"],
    links: [
      { label: "Play", href: "/games/signal-breach/" },
    ],
    highlight: "Live now · wave + accuracy + combo systems",
  },
  {
    id: "aether-descent",
    title: "Aether Descent",
    description:
      "Physics-based precision lander with 12 planets, upgradeable probe, hazard systems, and endless mode. Land gently, collect shards, survive everything.",
    status: "live",
    tech: ["Phaser 3", "Matter.js", "Web Audio"],
    links: [
      { label: "Play", href: "/games/aether-descent/" },
    ],
    highlight: "Live now · 12 planets · upgrades · endless mode",
  },
  {
    id: "verdant-siege",
    title: "Verdant Siege",
    description:
      "Wave tower defense with 5 tower types, 12 maps, 6 enemy classes, upgrade tree, and boss battles. Defend the Ancient Tree from the Blight.",
    status: "live",
    tech: ["Phaser 3", "Arcade Physics", "Procedural Gen"],
    links: [
      { label: "Play", href: "/games/verdant-siege/" },
    ],
    highlight: "Live now · 12 maps · 5 towers · boss waves · upgrades",
  },
];
