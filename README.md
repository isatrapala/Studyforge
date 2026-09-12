# StudyForge AI

An AI-native study planner: give it a messy topic, get back a clear,
actionable study plan you can save and revisit.

This repository now covers two weekly submissions:

- **Setup Sprint — Builder Infrastructure** (done): free-stack infrastructure
  (GitHub, Vercel, Supabase, Next.js, Tailwind, a coding agent) wired
  together and deployed, with a homepage, navigation, footer, and a `/docs`
  placeholder.
- **Week 1 — Generative Core Agent** (current): a working `/core` page that
  turns a messy pasted topic into a structured "core extraction" — topic,
  key concepts, and a suggested study order — using a **simulated** engine
  (no paid AI API), with results saved to Supabase and shown in a small
  dashboard preview.

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
    layout.js        # Root layout, wraps every page with Navbar + Footer
    page.js           # Homepage (hero, problem/user, roadmap)
    core/page.js       # /core — Generative Core Agent (Week 1)
    docs/page.js        # /docs — placeholder + prompt library entry
    globals.css
  components/
    Navbar.js
    Footer.js
  lib/
    supabaseClient.js  # Supabase client + core_outputs save/list helpers
    coreEngine.js        # Simulated core-extraction logic (see /docs)
sql/
  core_outputs.sql      # Run once in Supabase SQL editor to create the table
```

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

## Deployment

Deployed on Vercel from the `main` branch of this GitHub repository.
Every push to `main` triggers a new deployment.

Live URL: **\<add your Vercel URL here after deploying\>**

## Testing

See the Test Plan in the Build Discipline Packet for this week. In short,
three self-tests are run against the deployed URL after every deploy:

1. Homepage loads and renders without console errors.
2. `/docs` is reachable from the navbar and loads.
3. Navigation and layout hold up on a mobile-width viewport.

## Status

Setup Sprint — done. Week 1 (Generative Core Agent) — in progress: `/core`
is live with a simulated core-extraction engine, Supabase save, and a
dashboard preview. No paid AI API is used; simulated output is clearly
labeled per course rules.
