/**
 * Content collections. See 02 §5.3 (ArticleLayout), §5.5 (glossary term page)
 * and 03 §6 (why the glossary matters more than it looks).
 *
 * Three collections, all authored as MDX and all editable through Keystatic at
 * /keystatic. The schemas are deliberately strict: the fields the spec requires
 * on every page — an answer, takeaways, an author, both dates — are REQUIRED, so
 * a page that would fail the extraction rules cannot be published by accident.
 *
 * Every date is a real date and renders visibly on the page as well as in
 * schema (03 §3.9). `updated` defaults to `published` rather than to today, so
 * nothing ever claims a freshness it does not have.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Founder slugs from src/lib/team.ts — the byline must be a real person. */
const AUTHORS = ['tayeb-khan', 'jamal-khan', 'maaz-khan', 'khushal-sharma'] as const;

const article = z.object({
  title: z.string().min(10),
  /** <title>. 50–60 chars, enforced by the Meta gate at build. */
  seoTitle: z.string(),
  /** Meta description. 140–158 chars, enforced by the Meta gate at build. */
  description: z.string(),
  /** 40–60 words, self-contained, names "Scaling Socials" (CLAUDE.md §13). */
  answer: z.string(),
  /** 3–5 standalone extractable claims (02 §5.3). */
  takeaways: z.array(z.string()).min(3).max(5),
  author: z.enum(AUTHORS),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).min(1).max(6),
  /** Real outbound links to primary sources (02 §5.3). */
  sources: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
  related: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: article,
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: article.extend({
    /** Guides are pillars: they name the cluster they anchor. */
    hubOf: z.array(z.string()).default([]),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/glossary' }),
  schema: z.object({
    /** The term itself, cased as it should read: "ROAS", "Contribution margin". */
    term: z.string(),
    abbreviation: z.string().optional(),
    seoTitle: z.string(),
    description: z.string(),
    /**
     * ONE sentence. This exact sentence is what gets quoted by an AI answer, so
     * it must stand entirely on its own without the heading above it.
     */
    definition: z.string(),
    category: z.enum([
      'Paid media metrics',
      'Unit economics',
      'Campaign types',
      'Measurement',
      'Creative',
      'Retention',
      'Conversion',
    ]),
    /** Rendered as a formula block when the term is calculable. */
    formula: z.string().optional(),
    /**
     * A worked example in RUPEES. Required — it is what makes these pages
     * non-generic against the thousand US-centric definitions already indexed
     * (03 §6), and it is the reason they get cited.
     */
    example: z.object({
      scenario: z.string(),
      working: z.array(z.string()).min(1),
      result: z.string(),
    }),
    mistakes: z.array(z.string()).min(2).max(4),
    related: z.array(z.string()).default([]),
    /** The service that fixes the problem this term describes (03 §6). */
    service: z.object({ label: z.string(), href: z.string() }).optional(),
    /** A calculator that works the number, in place of the parked Index. */
    tool: z.object({ label: z.string(), href: z.string() }).optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, guides, glossary };
