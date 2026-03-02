import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
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
  plugins: [serveGamesPlugin(), react(), tailwindcss()],
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
