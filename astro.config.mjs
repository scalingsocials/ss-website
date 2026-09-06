import { defineConfig } from 'astro/config';
// React is registered ONLY for the permitted islands (01 §2.1) — the first is the
// break-even ROAS calculator on /tools/. react-dom/client (~60KB gzipped) loads
// only on pages that hydrate an island; content pages stay React-free. The perf
// gate enforces the two tiers per page (content 60KB, tool 140KB) — see
// scripts/check-perf-budget.mjs. Never add React for a disclosure <details> can do.
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import markdoc from '@keystatic/astro';

/**
 * Keystatic is mounted in `astro dev` ONLY.
 *
 * The site builds `output: 'static'`, so the admin UI has no server to run on in
 * production — and it should not have one. Editors run `npm run dev` and use
 * http://localhost:4321/keystatic, which writes MDX straight into src/content/,
 * so the files the editor touches are the files the build reads.
 *
 * Keeping it out of the production build means the public site ships none of
 * Keystatic's JavaScript and /keystatic cannot be reached or indexed at all.
 */
const inDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://scalingsocials.com',
  // Non-www is canonical. Enforce with a single edge 301, path -> matching path.
  // Production is 'always' — canonicals, the redirect map and every internal
  // link depend on it. Keystatic's SPA router and its /api/keystatic calls omit
  // the trailing slash, so under 'always' the admin's API requests come back as
  // an HTML 404 and every collection fails to load. Relaxing this in dev only
  // leaves the built site, and every gate that runs against it, unchanged.
  trailingSlash: inDev ? 'ignore' : 'always',
  output: 'static',
  // The Cloudflare adapter is a production concern. In dev it also tries to
  // bundle Keystatic's API route, which imports astro:env/server and fails to
  // resolve under its esbuild step — leaving the admin UI unable to reach its
  // API. Dev serves on-demand routes without an adapter perfectly well.
  ...(inDev ? {} : { adapter: cloudflare({ imageService: 'compile' }) }),
  integrations: [
    react(),
    mdx(),
    ...(inDev ? [markdoc()] : []),
    sitemap({
      filter: (page) =>
        !page.includes('/lp/') &&
        !page.includes('/keystatic') &&
        !page.includes('/styleguide') &&
        !page.includes('/thank-you') &&
        !page.includes('/404'),
    }),
  ],
  // Keystatic's API route imports getSecret from astro:env/server, so the env
  // schema has to exist even though local mode needs no secrets.
  env: { schema: {} },
  experimental: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        // frame-ancestors is IGNORED in a <meta> CSP, so it is set as a real
        // header in public/_headers instead. Kept out of here deliberately.
        "object-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
      ],
      scriptDirective: { resources: ["'self'", 'https://challenges.cloudflare.com'] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Keystatic's API entry imports astro:env/server, a virtual module esbuild
    // cannot resolve during dependency pre-bundling. Excluding it leaves the
    // import to Astro at runtime, which does resolve it.
    optimizeDeps: { exclude: ['@keystatic/astro/api', '@keystatic/astro/ui'] },
  },
  image: { formats: ['avif', 'webp'] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
