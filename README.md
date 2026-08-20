# StudyForge AI

An AI-native study planner: give it a messy topic, get back a clear,
actionable study plan you can save and revisit.

This repository is the **Setup Sprint — Builder Infrastructure** submission:
free-stack infrastructure (GitHub, Vercel, Supabase, Next.js, Tailwind, a
coding agent) wired together and deployed, with a homepage, navigation,
footer, and a `/docs` placeholder.

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
    layout.js       # Root layout, wraps every page with Navbar + Footer
    page.js          # Homepage (hero, problem/user, roadmap)
    docs/page.js      # /docs placeholder
    globals.css
  components/
    Navbar.js
    Footer.js
  lib/
    supabaseClient.js # Supabase client (safe no-op if env vars are missing)
```

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

Setup Sprint (Week 1) — infrastructure only. No AI calls are made yet; when
simulated AI output is introduced in a later week it will be clearly
labeled as simulated per course rules (no paid APIs required).
