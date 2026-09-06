/**
 * /rss.xml — the blog and guides feed (03 §0 launch gate).
 *
 * Hand-built rather than pulled from a dependency: the feed is thirty lines of
 * XML and adding a package for it would cost more than it saves (CLAUDE.md §16).
 * Content is escaped, dates are RFC-822, and guides are included because they
 * are the pages most worth subscribing to.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/lib/schema/ids';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  const guides = (await getCollection('guides')).filter((g) => !g.data.draft);

  const items = [
    ...posts.map((p) => ({ ...p.data, url: `${SITE}/blog/${p.id}/` })),
    ...guides.map((g) => ({ ...g.data, url: `${SITE}/guides/${g.id}/` })),
  ].sort((a, b) => b.published.getTime() - a.published.getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Scaling Socials — D2C growth notes</title>
    <link>${SITE}/blog/</link>
    <description>Practical notes on Meta and Google Ads, unit economics, creative and CRO for Indian D2C brands.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <pubDate>${i.published.toUTCString()}</pubDate>
      <description>${esc(i.description)}</description>
${i.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
