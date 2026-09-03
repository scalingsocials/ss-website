# Scaling Socials — website rebuild

Launch: 8 September 2026. See `docs/spec/07-EXECUTION-ROADMAP.md`.

## Start here
1. `npm install`
2. Read `CLAUDE.md` — Claude Code loads it automatically every session
3. Add the fonts (`public/fonts/README.md`) and the brand colours (`src/styles/theme.css`)
4. Run Prompt A from `docs/spec/06-CLAUDE-CODE-PROMPTS.md`
5. Commit after every prompt, with the prompt letter in the message

## Blocking inputs
See `docs/spec/07-EXECUTION-ROADMAP.md` §2. Outstanding: brand hex codes, subset fonts,
three headline numbers, 90 minutes of founder recording, a named transcriber.

## Layout
```
CLAUDE.md                  persistent instructions for Claude Code
docs/spec/                 the specification — 13 documents
docs/reference/            crawl export, NAP checklist
src/styles/theme.css       design tokens, both registers
src/components/            primitives, blocks, islands
src/lib/schema/entity.ts   single source of truth for all org facts
scripts/                   CI gates
```

## Gates
`npm run check` · `check:perf` · `check:schema` · `check:links` · `lh`
Nothing merges that fails them. Nothing deploys that fails the hold conditions in
`docs/spec/07-EXECUTION-ROADMAP.md` §3.
