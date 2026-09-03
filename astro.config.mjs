import { defineConfig } from 'astro/config';
// NOTE: @astrojs/react is intentionally NOT registered yet. It is a pinned
// dependency (01 §1) reserved for the permitted islands — LeadForm, the
// calculators, BenchmarkExplorer, BlogSearch (01 §2.1). None exist in this
// foundational build, and registering the renderer emits react-dom/client
// (~60KB gzipped) as a dead client asset that breaks the JS budget on its own.
// Re-add `react()` below the moment the first real island lands; do not add it
// to enable a disclosure widget that <details> or vanilla JS already handles.
// import react from '@astrojs/react';
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
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/lp/') &&
        !page.includes('/keystatic') &&
        !page.includes('/styleguide') &&
        !page.includes('/thank-you'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: { formats: ['avif', 'webp'] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
