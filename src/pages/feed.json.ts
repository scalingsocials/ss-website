/**
 * /feed.json — JSON Feed 1.1 (03 §0 launch gate). Same content as the RSS feed.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/lib/schema/ids';
import { PARTNER_BY_SLUG } from '@/lib/team';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  const guides = (await getCollection('guides')).filter((g) => !g.data.draft);

  const items = [
    ...posts.map((p) => ({ ...p.data, url: `${SITE}/blog/${p.id}/` })),
    ...guides.map((g) => ({ ...g.data, url: `${SITE}/guides/${g.id}/` })),
  ]
    .sort((a, b) => b.published.getTime() - a.published.getTime())
    .map((i) => ({
      id: i.url,
      url: i.url,
      title: i.title,
      summary: i.description,
      content_text: i.answer,
      date_published: i.published.toISOString(),
      date_modified: (i.updated ?? i.published).toISOString(),
      tags: i.tags,
      authors: [
        {
          name: PARTNER_BY_SLUG[i.author]?.name ?? 'Scaling Socials',
          url: PARTNER_BY_SLUG[i.author]?.linkedin,
        },
      ],
    }));

  return new Response(
    JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Scaling Socials — D2C growth notes',
        home_page_url: `${SITE}/blog/`,
        feed_url: `${SITE}/feed.json`,
        description:
          'Practical notes on Meta and Google Ads, unit economics, creative and CRO for Indian D2C brands.',
        language: 'en-IN',
        items,
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/feed+json; charset=utf-8' } },
  );
};
