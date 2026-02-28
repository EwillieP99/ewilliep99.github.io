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
    id: "next-drop",
    title: "Classified Drop #2",
    description:
      "Reserved slot for the next mini-game module in the arcade. Keep this as a scaffold so you can plug in future projects fast.",
    status: "coming-soon",
    tech: ["TBD"],
    links: [],
    highlight: "Coming soon",
  },
];
