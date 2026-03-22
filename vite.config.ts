import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "vite-plugin-vercel";
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

// Plugin to serve Vercel serverless functions in dev mode
function devApiPlugin() {
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        // Dynamic import the handler
        const route = req.url.split("?")[0].replace(/^\/api\//, "");
        const handlerPath = path.resolve(__dirname, `api/${route}.ts`);
        if (!fs.existsSync(handlerPath)) return next();

        try {
          // Use Vite's SSR module loader for TypeScript support
          const mod = await server.ssrLoadModule(`/api/${route}.ts`);
          const handler = mod.default;
          if (typeof handler !== "function") return next();

          // Collect request body
          let body = "";
          req.on("data", (chunk) => { body += chunk; });
          req.on("end", async () => {
            let parsedBody: Record<string, unknown> = {};
            if (body) {
              try {
                parsedBody = JSON.parse(body) as Record<string, unknown>;
              } catch {
                parsedBody = {};
              }
            }
            // Build a minimal VercelRequest/VercelResponse-like object
            const fakeReq = Object.assign(req, {
              body: parsedBody,
              query: Object.fromEntries(new URL(req.url!, `http://${req.headers.host}`).searchParams),
            });
            const headers: Record<string, string> = {};
            let headersSent = false;
            const flushHeaders = () => {
              if (!headersSent) {
                res.writeHead(fakeRes.statusCode, headers);
                headersSent = true;
              }
            };
            const fakeRes = {
              statusCode: 200,
              setHeader(k: string, v: string) { headers[k] = v; return fakeRes; },
              status(code: number) { fakeRes.statusCode = code; return fakeRes; },
              json(data: unknown) {
                headers["Content-Type"] = "application/json";
                flushHeaders();
                res.end(JSON.stringify(data));
                return fakeRes;
              },
              send(data: string) {
                flushHeaders();
                res.end(data);
                return fakeRes;
              },
              end() { flushHeaders(); res.end(); return fakeRes; },
              write(chunk: string) { flushHeaders(); res.write(chunk); return fakeRes; },
            };

            await handler(fakeReq, fakeRes);
          });
        } catch (err) {
          console.error("Dev API error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Dev API handler error" }));
        }
      });
    },
  };
}

// Load all env vars (not just VITE_ prefixed) so API handlers can use process.env
const env = loadEnv("development", process.cwd(), "");
Object.assign(process.env, env);

export default defineConfig({
  plugins: [
    serveGamesPlugin(),
    devApiPlugin(),
    react(),
    tailwindcss(),
    vercel(),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "three"],
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