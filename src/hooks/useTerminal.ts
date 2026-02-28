import { useState, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "system";
  text: string;
}

interface TerminalReturn {
  lines: TerminalLine[];
  input: string;
  setInput: (val: string) => void;
  handleCommand: (cmd: string) => void;
  clearTerminal: () => void;
}

// Available terminal commands and their responses
const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help      — Show this help menu",
    "  about     — Learn about Ethan",
    "  skills    — View skill categories",
    "  projects  — Browse mission archive",
    "  contact   — Get in touch",
    "  resume    — Download resume",
    "  clear     — Clear terminal",
    "  matrix    — Toggle Matrix mode",
    "  echo      — Talk to AI companion",
  ],
  about: [
    "┌─ OPERATOR PROFILE ─────────────────────────┐",
    "│ Name:     Ethan Pecora                      │",
    "│ Base:     University of Florida              │",
    "│ Degree:   B.S. Business Administration       │",
    "│ Cert:     Artificial Intelligence             │",
    "│ Status:   Graduating Fall 2026                │",
    "│                                               │",
    "│ Sales results meet AI fluency.                │",
    "│ $110K ARR · 400+ users · 67% conversion       │",
    "└───────────────────────────────────────────────┘",
  ],
  skills: [
    "╔═ AUGMENTATION LOADOUT ═══════════════════╗",
    "║ ► Frontend    React, TS, Tailwind, R3F   ║",
    "║ ► Backend/AI  Python, Node, LangChain    ║",
    "║ ► Cloud       Vercel, AWS, GitHub Actions ║",
    "║ ► Sales       Solution Selling, CRM, GTM  ║",
    "║ ► Tools       Notion, Figma, Excel        ║",
    "╚═══════════════════════════════════════════╝",
  ],
  projects: [
    "Loading mission archive...",
    "",
    "[01] Notion Life OS        — 12 templates, 30+ week streak",
    "[02] Comet Analytics       — 400+ user activations tracked",
    "[03] Campus GTM Playbook   — 0→15 ambassadors, 5 universities",
    "[04] AI Workflow Stack     — 80% cognitive load reduced",
    "",
    "Scroll down to view full mission details.",
  ],
  contact: [
    "┌─ UPLINK CHANNELS ────────────────────────┐",
    "│ Email:    ethan.pecora@ufl.edu            │",
    "│ LinkedIn: linkedin.com/in/ethan-pecora    │",
    "│ GitHub:   github.com/ewilliep99           │",
    "└───────────────────────────────────────────┘",
    "",
    "Or scroll to the contact section below.",
  ],
  resume: [
    "Initiating download sequence...",
    "► resume.pdf — deploying to your system...",
  ],
  echo: [
    "Echo AI v1.0 — Ethan's AI companion",
    "",
    "I can tell you about Ethan's experience,",
    "projects, and what makes him tick.",
    "",
    "Try: 'echo tell me about perplexity'",
    "     'echo what are your strengths'",
  ],
};

const BOOT_SEQUENCE: TerminalLine[] = [
  { type: "system", text: "NEON NEXUS Terminal v2.0" },
  { type: "system", text: "System initialized. Welcome, Operator." },
  { type: "system", text: 'Type "help" for available commands.' },
  { type: "system", text: "" },
];

/** Interactive terminal hook with command processing */
export function useTerminal(): TerminalReturn {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_SEQUENCE);
  const [input, setInput] = useState("");

  const handleCommand = useCallback((rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Add input line
    const newLines: TerminalLine[] = [{ type: "input", text: `> ${rawCmd}` }];

    if (cmd === "clear") {
      setLines(BOOT_SEQUENCE);
      setInput("");
      return;
    }

    if (cmd === "resume") {
      newLines.push(
        ...COMMANDS.resume.map((text) => ({ type: "output" as const, text }))
      );
      // Trigger download
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Ethan_Pecora_Resume.pdf";
        link.click();
      }, 500);
    } else if (cmd === "matrix") {
      newLines.push({ type: "system", text: "Toggling Matrix mode..." });
      // Dispatch custom event for theme toggle
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggle-theme", { detail: "matrix" }));
      }, 300);
    } else if (cmd in COMMANDS) {
      newLines.push(
        ...COMMANDS[cmd].map((text) => ({ type: "output" as const, text }))
      );
    } else if (cmd.startsWith("echo ")) {
      newLines.push(
        { type: "output", text: `Echo: Processing query "${cmd.slice(5)}"...` },
        { type: "output", text: "Echo: I'm a mock AI for now. Check back soon for real responses!" },
      );
    } else {
      newLines.push({
        type: "output",
        text: `Command not found: "${cmd}". Type "help" for available commands.`,
      });
    }

    // Scroll navigation for certain commands
    if (["projects", "contact", "skills"].includes(cmd)) {
      setTimeout(() => {
        const el = document.getElementById(cmd === "skills" ? "augmentations" : cmd);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput("");
  }, []);

  const clearTerminal = useCallback(() => {
    setLines(BOOT_SEQUENCE);
  }, []);

  return { lines, input, setInput, handleCommand, clearTerminal };
}
