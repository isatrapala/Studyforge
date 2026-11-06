# StudyForge AI

An AI-native study planner: give it a messy topic, get back a clear,
actionable study plan you can save and revisit.

This repository now covers four weekly submissions:

- **Setup Sprint — Builder Infrastructure** (done): free-stack infrastructure
  (GitHub, Vercel, Supabase, Next.js, Tailwind, a coding agent) wired
  together and deployed, with a homepage, navigation, footer, and a `/docs`
  placeholder.
- **Week 1 — Generative Core Agent** (done): a working `/core` page that
  turns a messy pasted topic into a structured "core extraction" — topic,
  key concepts, and a suggested study order — using a **simulated** engine
  (no paid AI API), with results saved to Supabase and shown in a small
  dashboard preview.
- **Week 2 — Research + Benchmarking Dashboard** (done): a working
  `/research` page with 5 global example products, 8 direct competitors, a
  risk map (overlap vs. competitive threat), a search/filter, and a research
  log for recording real human validation of the core "messy notes" problem.
- **Week 3 — Product Architecture + Pricing Simulator** (done): a `/product`
  page (3 pricing tiers, feature map, 2 customer segments) and a `/pricing`
  simulator (revenue calculator, scenario toggle, assumptions table, saved
  scenarios in Supabase).
- **Week 4 — Marketing Engine + Content System** (current): an upgraded
  homepage and a `/marketing` page with a brand system, a target persona
  (Mariana, an archetype), landing page copy, 10 social posts, 3 video
  scripts, a 14-day calendar, copy and export buttons, saved assets in
  Supabase, and 2 A/B tests with real votes. The content is **simulated**
  from templates (no paid AI API) and is labeled that way on the page.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) | Free, fast, first-class Vercel support |
| Styling | Tailwind CSS | Fast to build with, no design system to maintain |
| Hosting | Vercel (free tier) | Zero-config deploys straight from GitHub |
| Database | Supabase (free tier) | Managed Postgres + free auth for future weeks |
| Version control | GitHub | Required for commit/deploy evidence |
| Coding agent | Claude Code | Used to scaffold and iterate on this app |

## Getting started locally

```bash
npm install
cp .env.example .env.local   # fill in your real Supabase values
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored) and fill in the values
from your Supabase project (**Project Settings → API**):

| Variable | Where it's used | Required this week? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabaseClient.js` | For evidence only; app runs without it |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabaseClient.js` | For evidence only; app runs without it |

The same two variables need to be added in **Vercel → Project → Settings →
Environment Variables** before/after the first deploy (Production **and**
Preview).

## Project structure

```
src/
  app/
    layout.js          # Root layout, wraps every page with Navbar + Footer
    page.js             # Homepage (hero, problem/user, roadmap)
    core/page.js         # /core — Generative Core Agent (Week 1)
    research/page.js      # /research — Research + Benchmarking Dashboard (Week 2)
    product/page.js        # /product — tiers, feature map, segments (Week 3)
    pricing/page.js         # /pricing — pricing simulator (Week 3)
    marketing/page.js        # /marketing — Marketing Engine (Week 4)
    docs/page.js            # /docs — prompt library + data model reference
    globals.css
  components/
    Navbar.js
    Footer.js
    CopyButton.js        # Copy to clipboard, shows "Copied" (Week 4)
    SaveAssetButton.js    # Save a piece of content with a title (Week 4)
    AbTester.js            # A/B test with real votes in Supabase (Week 4)
  lib/
    supabaseClient.js  # Supabase client + core_outputs/research_outputs helpers
    coreEngine.js        # Simulated core-extraction logic (see /docs)
    researchData.js        # Static seed data: 5 global examples + 8 competitors
    pricingData.js          # Tiers, segments, feature map, scenarios, assumptions
    pricingEngine.js         # Pure revenue functions (tested)
    pricingEngine.test.js     # Pricing logic tests (npm test)
    brandData.js               # Brand system, persona, A/B test texts (Week 4)
    marketingEngine.js          # Template-based marketing kit, export, A/B rule
    marketingEngine.test.js      # Marketing logic tests (npm test)
sql/
  core_outputs.sql      # Run once in Supabase SQL editor to create the table
  research_outputs.sql   # Run once in Supabase SQL editor to create the table
  pricing_scenarios.sql   # Run once in Supabase SQL editor (safe to run again)
  marketing.sql            # Week 4: marketing_assets + ab_votes (safe to run again)
docs/week3/               # Week 3 plan, UX mockup, and date/time evidence note
docs/week4/               # Week 4 plan, UX mockup, and date/time evidence note
```

## Marketing Engine (`/marketing`)

Type a brand name, a one-sentence product description and a tone, and the page
builds a marketing kit: landing page copy, 10 social posts, 3 video scripts and
a 14-day calendar where every row points to a real piece. The kit is built from
**templates** in `src/lib/marketingEngine.js` (no AI API) and the page says
"Simulated output (templates, no AI API)". Each piece has a Copy button, the
whole kit can be exported as `.md` or `.json`, and pieces can be saved with a
title to the `marketing_assets` table (`sql/marketing.sql`).

Two A/B tests (homepage headline and button text) save real votes in the
`ab_votes` table. A visitor can vote once per test per browser (a soft limit
kept in `localStorage`). A winner needs at least 10 votes and 60% for one
version; otherwise the page says "No clear winner". The homepage shows version
A until the votes decide.

## Generative Core Agent (`/core`)

Paste a messy topic, chapter, or set of notes and the page returns a
structured "core extraction" card: the core topic, 3-5 key concepts, a
suggested study order, and why the topic matters. This is a **simulated**
AI output — `src/lib/coreEngine.js` uses text heuristics, not a real model
call — clearly labeled in the UI per the course rule on simulated output.
The exact prompt this stands in for is documented on `/docs` so it's a
drop-in swap once a real API is allowed.

Saving a result writes a row to the `core_outputs` table in Supabase
(schema in `sql/core_outputs.sql`); the dashboard preview at the bottom of
`/core` reads the 5 most recent saved rows back.

## Research + Benchmarking Dashboard (`/research`)

`/research` has two parts:

1. **Benchmarking table + risk map** — 5 well-known global tools (Notion AI,
   Obsidian, Anki, Quizlet, RemNote) and 8 more direct competitors (Google
   NotebookLM, Mem, Wisdolia, StudyFetch, Khanmigo, Glasp, Otter.ai,
   Aprende.org), defined as static reference data in
   `src/lib/researchData.js`. A search box filters the table by name,
   country, or description. The risk map plots each entry by how much its
   core mechanic overlaps with StudyForge's and how much of a competitive
   threat it poses right now — a first-pass judgment call meant to be
   revised as real research comes in, not a scientific measurement.
2. **Research log** — a form for recording real human validation (an
   interview, a survey response, a note from trying a competitor's app) and
   whether it supports the "messy notes" problem hypothesis. Entries save to
   the `research_outputs` table (schema in `sql/research_outputs.sql`) and
   show up in a dashboard preview of the 5 most recent entries.

## Product + Pricing Simulator (`/product`, `/pricing`)

- `/product` shows the 3 tiers (Free MXN 0, Plus MXN 79, Pro MXN 149 per
  month), a feature map by tier, and the 2 customer segments: individual
  students and universities/schools (B2B, assumed MXN 99 per seat per month).
- `/pricing` is a calculator. Inputs: number of students, the Free / Plus /
  Pro split (must add up to 100%), number of schools, seats per school and
  price per seat. Output: monthly revenue and annual revenue (monthly x 12).
  The scenario toggle (Conservative / Expected / Optimistic) fills the inputs
  with a preset. Scenarios can be named and saved to the `pricing_scenarios`
  table (`sql/pricing_scenarios.sql`) and are listed below the calculator.
- All numbers are the team's own assumptions. Left out on purpose: payments,
  taxes, churn, discounts.
- The math lives in `src/lib/pricingEngine.js` as pure functions so it can be
  tested without the browser.

## Deployment

Deployed on Vercel from the `main` branch of this GitHub repository.
Every push to `main` triggers a new deployment.

Live URL: **\<add your Vercel URL here after deploying\>**

## Testing

See the Test Plan in the Build Discipline Packet for this week. In short,
self-tests are run against the deployed URL after every deploy:

1. Homepage loads and renders without console errors.
2. `/docs` is reachable from the navbar and loads.
3. Navigation and layout hold up on a mobile-width viewport.
4. `/research` loads with the 5 global examples, 8 competitors, and the risk
   map; the search/filter narrows the table correctly (e.g. searching
   "México" matches Quizlet and Aprende.org); saving a research entry shows
   up in the dashboard preview without duplicating.
5. Week 3, run `npm test` (4 pricing logic tests): Expected preset gives
   30,700 (individual) + 59,400 (B2B) = 90,100 MXN per month; a split that is
   not 100% is blocked.
6. Week 3, on the live site: `/product` and `/pricing` load; the scenario
   toggle changes the numbers; saving a scenario shows it once in the list
   and it is still there after reload.
7. Week 4, run `npm test` (11 tests in total, 7 for marketing): the kit has 10
   posts, 3 scripts and 14 calendar days; invalid input is blocked; the A/B
   winner rule works.
8. Week 4, on the live site: `/` and `/marketing` load; "Generate content"
   builds the kit and Copy shows "Copied"; saving an asset shows it in the
   list and it is still there after reload; an empty title is blocked.
9. Week 4 A/B tests: real people vote on `/marketing` and the counts match the
   rows in the `ab_votes` table.

## Status

Setup Sprint — done. Week 1 (Generative Core Agent) — done. Week 2
(Research + Benchmarking Dashboard) — done. Week 3 (Product Architecture +
Pricing Simulator) — done. Week 4 (Marketing Engine + Content System) — in
progress: `/marketing` is built, with assets and A/B votes saved to Supabase.
Run `sql/marketing.sql` in Supabase before using it. No
paid AI API is used; simulated output is clearly labeled per course rules.
