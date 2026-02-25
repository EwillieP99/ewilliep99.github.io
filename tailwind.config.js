/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060818",
          900: "#0a0f2e",
          800: "#0d1545",
          700: "#131c5c",
        },
        purple: {
          500: "#7c3aed",
          400: "#a855f7",
          300: "#c084fc",
        },
        cyan: {
          400: "#22d3ee",
          300: "#67e8f9",
          200: "#a5f3fc",
        },
        accent: {
          blue: "#38bdf8",
          purple: "#a855f7",
          cyan: "#22d3ee",
        },
        cyber: {
          blue: "#2b4bee",
          "blue-light": "#4f6ef7",
          surface: "rgba(15, 20, 40, 0.95)",
          card: "rgba(20, 25, 50, 0.8)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #060818 0%, #0a0f2e 40%, #1e0a3c 70%, #0e1a4a 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "accent-gradient": "linear-gradient(90deg, #38bdf8, #a855f7, #22d3ee)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "cursor-blink": "blink 1s step-end infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
        "scan-line": "scanLine 3s linear infinite",
        "hud-flicker": "hudFlicker 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        hudFlicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        glass:
          "0 4px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.08)",
        "glass-hover":
          "0 8px 48px rgba(56, 189, 248, 0.15), inset 0 0 0 1px rgba(255,255,255,0.12)",
        "glow-blue": "0 0 24px rgba(56, 189, 248, 0.3)",
        "glow-purple": "0 0 24px rgba(168, 85, 247, 0.3)",
      },
    },
  },
  plugins: [],
};
