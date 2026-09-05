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

export default defineConfig({
  site: 'https://scalingsocials.com',
  // Non-www is canonical. Enforce with a single edge 301, path -> matching path.
  trailingSlash: 'always',
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/lp/') &&
        !page.includes('/keystatic') &&
        !page.includes('/styleguide') &&
        !page.includes('/thank-you') &&
        !page.includes('/404') &&
        // noindex landers until their content collections ship (PENDING-WORK §D).
        !page.includes('/blog') &&
        !page.includes('/guides') &&
        !page.includes('/glossary'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: { formats: ['avif', 'webp'] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
