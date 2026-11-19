# QCON guides: writing rules

These rules are for every guide published on qcon.solutions/guides, whether written by a person or by the scheduled
writing task. Guides publish automatically, so they must be right the first time.

## Who we write for

Renovation contractors, interior designers and fit-out companies in Malaysia who price and quote jobs. They are busy,
practical and often read on a phone. Homeowners also find the guides, so explain trade terms briefly.

Each guide should help a contractor do their job better (price, quote, protect their margin, avoid disputes), and
show, without hard selling, why a proper quotation tool helps.

## One topic per guide

- Pick the next unchecked topic in `CONTENT_PLAN.md`, top to bottom.
- Before writing, read the titles and descriptions of every file in `src/content/guides/`. If the topic overlaps more
  than about a third with an existing guide, choose a narrower angle or skip it and note why in the plan.
- The guide must target a phrase people actually search for, such as "plaster ceiling price per sq ft Malaysia". Put
  that phrase in the title, the first paragraph and one heading, naturally.

## Facts and sources

- Research with web search before writing. Use sources published in the current or previous year where possible.
- Every price, rate, law, tax rule, threshold or date must come from a source listed in the guide's "Sources" section.
  Never invent a figure, a statistic, a quote, a person, a company example or a review.
- Give prices as published ranges ("RM6–15 per sq ft"), with the unit. When sources disagree, show the range or a
  small table by source.
- Worked examples and sample quotations are fine, but say they're **illustrative**, keep each rate inside the published
  range, and check the arithmetic with code before publishing.
- Tax, legal and regulatory topics (SST, CIDB, contracts, permits, e-invoicing): use official sources (RMCD, LHDN,
  CIDB, MOF, local councils) or the big tax firms, add a one-line "general information, not legal/tax advice" note,
  and never state something as settled if sources conflict.
- Don't copy text from sources. Summarise in our own words; at most a few words quoted.
- Never mention competitors by name negatively. Neutral mentions in comparisons are fine.

## Shape of a guide

- File: `src/content/guides/<slug>.md`. The slug is short, lowercase, hyphenated, and usually ends in `-malaysia`.
- Frontmatter (the build rejects the file otherwise):
  - `title`: 70 characters at most; aim for about 60. Specific, with the search phrase and "Malaysia" or "(2026)" when relevant.
  - `description`: 170 characters at most; aim for 140–160. Says what the reader gets.
  - `published`: today's date (YYYY-MM-DD).
  - `faq`: 3–5 questions people really ask, each answered in 1–3 plain sentences that stand on their own.
- Opening paragraph: answer the main question directly in 2–4 sentences, with the key numbers in bold. No preamble.
- Then 4–7 `##` sections. Use tables for rates and samples, short lists for checklists. Length: about 900–1,600 words.
- End with a short section that links to 2–4 related guides and, once, to QCON (`[QCON](/)`) as the tool that keeps
  cost, selling price and margin on every line. No other sales copy. Never promise features QCON doesn't have.
- Finish with `### Sources` listing each source as `Publisher, [Title](URL): what it supports`.

## Style

- Plain British/Malaysian English, short sentences, active voice. Use "you" for the contractor.
- RM with no space ("RM1,500"), "sq ft", "ft run", en dash for ranges ("RM6–15").
- No exclamation marks, no clichés ("in today's fast-paced world", "look no further", "game-changer").
- Don't write about the article itself ("In this article we will..."). Just say it.

## Internal links

- Link to existing guides where they genuinely help, with descriptive link text (not "click here").
- After publishing a new guide, add one natural link to it from the 1–2 most related existing guides.
- Only link to pages that exist. `npm run check` fails on broken internal links.

## Before publishing

1. `npm run build` must succeed.
2. `npm run check` must pass (links, frontmatter, duplicates).
3. Re-read the guide once for facts against the sources and for arithmetic.
4. Commit the Markdown, the rebuilt `dist/` and the updated `CONTENT_PLAN.md` together on `marketing-site`.

If anything can't be verified, leave it out. If the whole topic can't be done well, skip it and note why in the plan.
