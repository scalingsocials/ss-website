/**
 * Keystatic — the admin UI for the three content collections.
 *
 * Local mode writes MDX straight to src/content/, so what the editor sees and
 * what the build reads are the same files and there is no sync step to drift.
 * The field definitions mirror src/content.config.ts on purpose: the zod schema
 * is what actually enforces correctness at build time, and these are the inputs
 * that make it hard to violate in the first place.
 *
 * /keystatic is excluded from the sitemap (astro.config.mjs) and carries no
 * public links, so it never enters the index.
 */
import { config, fields, collection } from '@keystatic/core';

const AUTHORS = [
  { label: 'Tayeb Khan', value: 'tayeb-khan' },
  { label: 'Jamal Khan', value: 'jamal-khan' },
  { label: 'Maaz Khan', value: 'maaz-khan' },
  { label: 'Khushal Sharma', value: 'khushal-sharma' },
] as const;

const articleFields = {
  title: fields.slug({ name: { label: 'Title', validation: { length: { min: 10 } } } }),
  seoTitle: fields.text({
    label: 'SEO title',
    description: 'Must be 50–60 characters. The build fails outside that range.',
    validation: { length: { min: 50, max: 60 } },
  }),
  description: fields.text({
    label: 'Meta description',
    description: 'Must be 140–158 characters. The build fails outside that range.',
    multiline: true,
    validation: { length: { min: 140, max: 158 } },
  }),
  answer: fields.text({
    label: 'Answer block',
    description:
      '40–60 words, self-contained, naming "Scaling Socials" rather than "we". This is the passage an AI answer lifts, so it must read correctly out of context.',
    multiline: true,
  }),
  takeaways: fields.array(fields.text({ label: 'Takeaway' }), {
    label: 'Key takeaways',
    description: '3–5 standalone claims. Each must make sense on its own.',
    itemLabel: (props) => props.value ?? 'Takeaway',
  }),
  author: fields.select({ label: 'Author', options: AUTHORS, defaultValue: 'tayeb-khan' }),
  published: fields.date({ label: 'Published' }),
  updated: fields.date({ label: 'Last updated' }),
  tags: fields.array(fields.text({ label: 'Tag' }), {
    label: 'Tags',
    itemLabel: (props) => props.value ?? 'Tag',
  }),
  sources: fields.array(
    fields.object({
      label: fields.text({ label: 'Label' }),
      href: fields.url({ label: 'URL' }),
    }),
    { label: 'Sources', itemLabel: (props) => props.fields.label.value || 'Source' },
  ),
  related: fields.array(fields.text({ label: 'Slug' }), {
    label: 'Related slugs',
    itemLabel: (props) => props.value ?? 'Slug',
  }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  content: fields.mdx({ label: 'Body' }),
};

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Scaling Socials' },
    navigation: { Content: ['blog', 'guides', 'glossary'] },
  },
  collections: {
    blog: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: articleFields,
    }),
    guides: collection({
      label: 'Guides',
      slugField: 'title',
      path: 'src/content/guides/*',
      format: { contentField: 'content' },
      schema: {
        ...articleFields,
        hubOf: fields.array(fields.text({ label: 'Glossary slug' }), {
          label: 'Anchors these glossary terms',
          itemLabel: (props) => props.value ?? 'Term',
        }),
      },
    }),
    glossary: collection({
      label: 'Glossary terms',
      slugField: 'term',
      path: 'src/content/glossary/*',
      format: { contentField: 'content' },
      schema: {
        term: fields.slug({ name: { label: 'Term' } }),
        abbreviation: fields.text({ label: 'Abbreviation' }),
        seoTitle: fields.text({ label: 'SEO title', validation: { length: { min: 50, max: 60 } } }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          validation: { length: { min: 140, max: 158 } },
        }),
        definition: fields.text({
          label: 'One-sentence definition',
          description:
            'This exact sentence is what gets quoted. It must stand alone without the heading above it.',
          multiline: true,
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Paid media metrics', value: 'Paid media metrics' },
            { label: 'Unit economics', value: 'Unit economics' },
            { label: 'Campaign types', value: 'Campaign types' },
            { label: 'Measurement', value: 'Measurement' },
            { label: 'Creative', value: 'Creative' },
            { label: 'Retention', value: 'Retention' },
            { label: 'Conversion', value: 'Conversion' },
          ],
          defaultValue: 'Paid media metrics',
        }),
        formula: fields.text({ label: 'Formula' }),
        example: fields.object(
          {
            scenario: fields.text({ label: 'Scenario', multiline: true }),
            working: fields.array(fields.text({ label: 'Step' }), {
              label: 'Working',
              itemLabel: (props) => props.value ?? 'Step',
            }),
            result: fields.text({ label: 'Result' }),
          },
          { label: 'Worked example (in rupees — required)' },
        ),
        mistakes: fields.array(fields.text({ label: 'Mistake', multiline: true }), {
          label: 'Common mistakes (2–4)',
          itemLabel: (props) => props.value ?? 'Mistake',
        }),
        related: fields.array(fields.text({ label: 'Slug' }), {
          label: 'Related terms',
          itemLabel: (props) => props.value ?? 'Slug',
        }),
        service: fields.object({
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'Href' }),
        }),
        tool: fields.object({
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'Href' }),
        }),
        published: fields.date({ label: 'Published' }),
        updated: fields.date({ label: 'Last updated' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Expanded explanation (150–250 words)' }),
      },
    }),
  },
});
