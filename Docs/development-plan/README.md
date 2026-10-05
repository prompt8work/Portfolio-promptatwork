# PromptAtWork — Phased Development Plan

This folder breaks the [PRD](../PRD.md) down into build phases, in order. Each phase file covers one phase: its goal, scope, deliverables, technical tasks, acceptance criteria, and dependencies.

## A path note, read this before any phase doc below

**Every `nextjs-app/...` path in Phases 0–2's docs is stale.** Partway through Phase 3, the repo root changed: `nextjs-app/`'s contents were promoted to the repo root and the old Vite files were removed, via a PR merged into `master` on GitHub, outside any Claude session. Confirmed with the user — the code move was intentional, but it is **not** the same thing as the Phase 6/7 "launched" decision, which is still pending. Full story in [03-dynamic-backend.md](03-dynamic-backend.md)'s Status section. Practically: wherever an earlier doc says `nextjs-app/src/...` or `nextjs-app/data/...`, read it as `src/...` / `data/...` from the repo root instead — nothing else about those decisions changed, only the path prefix.

## The architecture gap

The PRD specifies **Next.js + React + TypeScript + Sanity CMS + Supabase PostgreSQL + Vercel** (PRD §45–48, §107). The current codebase is a **Vite SPA with static JSON/TypeScript data files** — no CMS, no database, no server framework. There is no incremental path from one to the other that avoids a framework migration: Sanity's ISR/webhook revalidation model and Next.js Server Actions are both Next.js-specific. Phase 0 addresses this before any further UI work goes into the old stack.

## Phase order

| Phase | Name | Goal | PRD refs |
|---|---|---|---|
| [0](00-foundation.md) | Foundation | Migrate Vite → Next.js before building further | §45–48, §107 |
| [1](01-static-core.md) | Static Core | Ship the redesigned P0 portfolio pages on real routes | §14–19, §92–95 |
| [2](02-cms-sanity.md) | CMS Integration | Move Projects/Experience/Resume onto Sanity | §63–71, §82, §89 |
| [3](03-dynamic-backend.md) | Dynamic Backend | Supabase Postgres + Contact form end-to-end | §41–42, §54, §63, §76 |
| [4](04-ai-lab-content.md) | AI Lab & Content | Tools & Research, Experiments, Prompts, Automations, Blog, YouTube, LinkedIn (distribution) | §23–36, §65–68, §86–89 |
| [5](05-training-platform.md) | Training Platform | Courses, Batches, Schedule, Registration | §37–42, §69, §74–75 |
| [6](06-hardening-polish.md) | Hardening & Polish | SEO, analytics, accessibility, admin, security | §76–99 |
| [7](07-launch.md) | Launch | Definition of Done checklist, go-live on promptatwork.com | §106 |
| [9](09-v2-data-recuration.md) | V2.0 — Data Re-curation | Content/IA/data-model re-curation per the site's own [master content doc](../v2.0-data-driven-updates/PROMPTATWORK_WEBSITE_DATA_MASTER_CONTEXT.md) — runs *before* Phase 8, per user direction | (site-owned doc, not PRD) |
| [8](08-v2-future.md) | V2 — AI Assistant | Python/FastAPI + RAG over published content — deferred until Phase 9 lands real content | §108 |
| [10](10-v3-admin-crm.md) | V3 — Admin CRM Dashboard | Brainstorm only — unified Sanity + Supabase admin, Google OAuth2 single-user login, dynamic content editor | (site-owned doc, not PRD) |
| [11](11-ai-lab-docs-hub.md) | AI Lab Docs Hub | One docs-style hub for all work (Work, Engineering, Tools, Experiments, Prompts, Automations); light theme sitewide except Resume; homepage de-duplicated; one shared menu | (site-owned doc, not PRD) |
| [12](12-process-diagrams-and-content-skill.md) | Process Diagrams & Content Skill | Required diagrams on every post (flow, loop, analogy, Mermaid); `/case-study` skill turns raw notes into checked Sanity drafts | (site-owned doc, not PRD) |
| [13](13-seo-aeo.md) | SEO & AEO | Keyword bank, AI-assistant question bank, code fixes and off-site steps so the site ranks for Niharika's roles and Indore training searches | §78 (site-owned keyword bank) |

Phase 4 has two follow-on change docs, both already implemented and folded into [04-ai-lab-content.md](04-ai-lab-content.md)'s own Status section — read that file first; the two below are the original change requests, kept for history:
- [4.1](04.1-ai-lab-content-tools.md) — evolved Tools from a simple explorer into a full Tool Research & Learning Repository (research content, best-use-cases, downloadable resources, search/filter).
- [4.2](04.2-ai-lab-content-modification.md) — replaced LinkedIn content importing with website-first blog publishing + LinkedIn share/distribution.

## Priority mapping (PRD §100)

- **P0 (Must Have)** — covered by Phases 0–3: portfolio pages, CMS-driven Projects/Experience/Resume, PostgreSQL, Contact.
- **P1 (Should Have)** — covered by Phases 4–6: AI Lab, Content platform, Training, YouTube sync, LinkedIn distribution, SEO, analytics, moderation.
- **P2 (Future)** — Phase 8: AI content generation, Portfolio AI Assistant, RAG, GitHub integration, newsletter.

## How to use these files

Each phase file is a working checklist. As work completes, check items off in place rather than rewriting the file — these documents are meant to be edited over the life of the project, not regenerated. A phase is done when its **Acceptance Criteria** section is fully satisfied, not just when its tasks are checked.

## Design reference

The visual direction for Phases 1 onward follows the homepage mockup built from PRD §7–12 (light ivory/charcoal base, sage-olive brand accent, cyan reserved for AI/technical zones, Playfair Display + Geist + JetBrains Mono). See the mockup artifact linked in the project conversation history, or rebuild the design tokens from PRD §10–11 if the artifact link has lapsed.
