import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // root — correct for username.github.io repos
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          "framer-motion": ["framer-motion"],
          "react-vendor": ["react", "react-dom"],
          "react-router": ["react-router-dom"],
        },
      },
    },
  },
});
