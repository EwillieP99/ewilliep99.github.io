import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from "fs";

// Plugin to serve public/ game folders directly instead of SPA fallback
function serveGamesPlugin() {
  return {
    name: "serve-games",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/games/") && !req.url.includes(".")) {
          // Check if there's an index.html in public/ for this path
          const cleanUrl = req.url.replace(/\/$/, "");
          const filePath = path.resolve(__dirname, "public" + cleanUrl + "/index.html");
          if (fs.existsSync(filePath)) {
            req.url = cleanUrl + "/index.html";
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    serveGamesPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "assets/IMG_5245.jpeg"],
      manifest: {
        name: "Neon Operator — Ethan Pecora",
        short_name: "NEON_OP",
        description: "AI-fluent tech sales operator. $110K ARR, 400+ users, communities built from scratch.",
        theme_color: "#0a0f1e",
        background_color: "#0a0f1e",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        // Don't cache game assets or large images in service worker
        globIgnores: ["games/**/*"],
      },
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "three"],   // ← THIS FIXES THE THREE.JS ERROR
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          "framer-motion": ["framer-motion"],
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
