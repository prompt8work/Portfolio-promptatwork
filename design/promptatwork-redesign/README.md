# PromptAtWork redesign — implementation handoff

Everything designed for the promptatwork.com redesign, exported for implementation with Claude Code in VS Code.

- **Live canvas (view every board rendered):** https://claude.ai/artifact/GxwwnQJuiiLkF9zkLqmkZp
- **Live design system:** https://claude.ai/artifact/DW915gK7aifwKcu6XNGuya
- **Brief and token source:** `../DESIGN.md` (Luminous SaaS). The visual references in `../stitch_promptatwork_ai_hub/` were used for patterns only.

## Folder map

| Path | What it is |
| --- | --- |
| `design-system/tokens.json` | The source of truth for every colour (Dark + Light themes), type style, spacing, radius, shadow and blur value. |
| `design-system/tokens.css` | The same tokens as CSS custom properties. Dark is the default; `<html data-theme="light">` switches to light. Includes `.display-lg`, `.headline-md` and the other type classes. |
| `design-system/components/bundle.css` | Reference component CSS (`paw-` classes): buttons, tags, chips, search, progress, cards, nav, sidebar and code. |
| `design-system/components/<Name>/README.md` | Usage rules per component. `preview.html` beside it shows the markup. |
| `design-system/README.md` | The brand book: voice, colour, type, spacing, states, light theme, logo and icon rules. **Read this first.** |
| `canvas/*.dc.html` | One file per designed section or page (see the board list below). |
| `canvas/canvas.json` | Board titles, sizes and canvas grouping. |
| `assets/` | The logo mark and lockup, Niharika's headshot and portrait, and the institute logos (BIA, Bignalytics, NIIT). |

## Reading a `.dc.html` board

Each board is HTML with inline styles: copy the exact values (px, hex, radius) from there. A few template conventions:

- `{{ name }}` is filled from `renderVals()` in the `<script type="text/x-dc">` block at the bottom of the file. Look there for the data (video lists, projects, theme palettes).
- `<sc-for list="{{ items }}" as="x">` repeats its children for each item. `<sc-if>` is a conditional.
- `<dc-import name="Page-Portfolio" theme="light">` renders another board with props. The `Light-Page-*` boards are just the dark page with `theme="light"`.
- Image paths point at `../assets/…`.
- `./support.js` is the canvas runtime and isn't included, so the files won't render by double-clicking. View them on the live canvas link above, and treat these files as the spec.

## Boards → site routes

The live site is the Next.js app in `../../MyProfile` (Next 16, React 19, Tailwind v4). Suggested mapping:

| Board(s) | Route / component |
| --- | --- |
| `Hub-Nav` | `src/components/Nav.tsx`: logo tile and wordmark, Courses / AI Lab / TV / Portfolio, ⌘K search, "Let's Connect", avatar. |
| `Hub-Hero`, `Hub-Courses`, `Hub-Notes`, `Hub-Portfolio` | Home `/` (LMS & Portfolio Hub), in that order. |
| `New-Instructor`, `New-Testimonials`, `New-Blog`, `New-Newsletter`, `New-Footer` | Further home sections; the footer goes in `SiteFooter.tsx`. |
| `TV-Header`, `TV-Browse`, `TV-Sidebar`, `TV-VideoStates` | `/videos` (PromptAtWork TV), YouTube-style layout fed by the existing YouTube sync. |
| `Page-AILab` | `/ai-lab` overview and its layout sidebar (`src/app/ai-lab/layout.tsx`). |
| `New-Automations` | `/ai-lab/automations` header and flow pattern. |
| `New-Tools` | `/ai-lab/tools`, when published. |
| `Page-Portfolio` | `/portfolio` overview (both profiles). |
| `New-LearningPaths`, `New-Teams` | `/training`. |
| `New-Contact` | `/contact`. |
| `New-MobileHub` | The home page below 640px (mobile behaviour reference). |
| `Light-*` | The same sections in the Light theme. Implement once with tokens and switch with `data-theme`. |
| `Main` | The section index (not a site page). |

## Implementation notes

1. **Tokens first.** Import `tokens.css` globally, then map the variables into Tailwind v4's `@theme` in `globals.css` (e.g. `--color-canvas: var(--canvas)`). This replaces the current plum/ivory palette. Keep Geist, and keep JetBrains Mono for labels. Playfair is no longer used.
2. **Theme switch.** Dark is the default. Add a toggle that sets `data-theme="light"` on `<html>` and respects `prefers-color-scheme`. Only token values change between themes. Thumbnails and code panels stay dark in both.
3. **Logo.** Use `assets/logos/promptatwork-mark.png` as a 36px tile with a 10px radius, beside the live wordmark "Prompt" + "AtWork" (`--brand-accent`). It also replaces the `P/` favicon in `src/app/icon.tsx`.
4. **Components.** Build them in React from `bundle.css` and the component READMEs: Button, Tag, FilterChip, SearchBar, ProgressBar, Avatar, SectionHeader, CourseCard, NoteCard, VideoCard, TopNav and Sidebar.
5. **Accessibility.**
   - Keep the 2px `--focus-ring` outline on every control.
   - White text on `#3B82F6` is only 3.7:1, so primary button labels stay 16px/600, or use the light theme's `#2563EB`.
   - Icon-only buttons need an `aria-label`.
   - Turn off motion under `prefers-reduced-motion`.
6. **Content rule.** Keep the site's existing "nothing invented" rule (`MyProfile/CLAUDE.md`). Most copy in the boards comes from the site's data and Sanity seeds.

## Placeholders to replace with real content

These are written as `[…]` in the boards, or marked as sample content here:

- Testimonials: two more quotes beside Monika Rathore's (the real one).
- Blog list titles and dates; the YouTube video's duration, views and date.
- TV grid video titles, views and dates. Everything except "The Engineer's Survival Guide to the AI Era" is sample content; feed the grid from the YouTube sync.
- Downloadable note file sizes, and which notes exist beyond the Claude Code Quick Reference.
- Course progress percentages (per-learner data).
- AI Lab: the case-study and flow counts, the Agentic AI evidence project, and the meeting assistant's future scope.
- Portfolio: the Pharmaceutical Management System summary and stack.
- Live video viewer count, and the newsletter (needs a real provider).
