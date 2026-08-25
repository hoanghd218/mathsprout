import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
// Vite plugin: mounts /api/*.js handlers (Vercel-style) into the dev server
// so we can run locally with `npm run dev` without needing `vercel dev` (no
// Vercel login / project link required). Production still uses the same
// handler files via Vercel Functions.
function apiHandlerPlugin() {
  return {
    name: 'mathsprout-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const route = req.url.split('?')[0].replace(/\/$/, '');
        const apiFile = path.resolve(process.cwd(), '.' + route + '.js');

        // Polyfill Vercel's res.status() / res.json() helpers on Node res.
        res.status = function (code) { this.statusCode = code; return this; };
        res.json = function (obj) {
          if (!this.getHeader('Content-Type')) this.setHeader('Content-Type', 'application/json');
          this.end(JSON.stringify(obj));
          return this;
        };

        // Read + parse JSON body for POST (Vercel does this automatically).
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          const chunks = [];
          for await (const c of req) chunks.push(c);
          const raw = Buffer.concat(chunks).toString('utf-8');
          try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
        }

        try {
          const mod = await import(pathToFileURL(apiFile).href);
          const handler = mod.default;
          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: `No default export in ${route}.js` }));
            return;
          }
          await handler(req, res);
        } catch (err) {
          console.error('[api middleware]', route, err);
          if (!res.headersSent) {
            res.statusCode = err?.code === 'ERR_MODULE_NOT_FOUND' ? 404 : 500;
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load .env / .env.local into process.env so api/ handlers can read
  // ANTHROPIC_API_KEY (Vite normally only exposes VITE_* to the client).
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of Object.keys(env)) {
    if (process.env[k] === undefined) process.env[k] = env[k];
  }

  return {
    plugins: [react(), tailwindcss(), apiHandlerPlugin()],
    server: {
      port: 5173,
      open: true
    }
  };
});
