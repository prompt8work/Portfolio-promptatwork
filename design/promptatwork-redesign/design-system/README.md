PromptAtWork is Niharika Dhande's AI-instructor platform. It brings courses, tools, the TV video library and the portfolio together in one product. The system is **Luminous SaaS**: dark, precise and developer-facing. Depth comes from frosted glass and a single blue-to-violet accent, never from heavy shadows or a crowd of colours.

## Content fundamentals

- **Voice:** a practitioner teaching practitioners. Be direct, concrete and confident without hype. Show the mechanism ("plan → retrieve → act"). Avoid adjectives like "revolutionary".
- **Person:** address the learner as *you*. Niharika speaks as *I* only in her own videos and notes. The product never says *we*.
- **Casing:** Title Case for page titles, section headers and CTAs ("Start Learning", "Latest Frameworks", "View Portfolio"). Sentence case for body copy, chip labels ("Agentic AI") and video titles. Set mono labels and tags in caps (LANGCHAIN, PDF · 12 PAGES).
- **Tech names:** spell them as their makers do in running text (LangChain, n8n, MCP, Claude Code). Only the mono `paw-tag` uppercases them.
- **No emoji** anywhere in the UI. Use Lucide icons instead.
- **Real over filler:** no invented stats or testimonials. Course titles come from the live course catalogue (e.g. "Prompt Engineering Fundamentals", "Advanced AI Tools Mastery").

## Visual foundations

### Colour
- Every page sits on `canvas` (#0F172A). Cards, the nav and panels use `surface-card` (#1E293B) with a 1px `border-subtle` (#334155) edge.
- Set text in `text-primary` for headlines and body, and `text-secondary` for metadata, on `canvas` or `surface-card`. Never put `text-secondary` on a `border-subtle` fill (4.0:1). Use `text-primary` there.
- The accent is the gradient from `accent-blue` to `accent-violet`. Keep it for the primary CTA, progress fills, the active-nav underline, the brand tile and hover glows. Inside copy, only the one key phrase of the hero headline may carry it (as `primary` → `secondary` text).
- `primary` (light blue) is for links, active icons and the `focus-ring`. `secondary` (light violet) is for secondary tags. `tertiary` (warm) is the single warm note, reserved for downloadables, the "live" dot and notification counts.
- The Material role tokens (`surface-container-*`, `on-*`, `*-fixed`) carry the exact DESIGN.md values. Use them for menus, the sidebar's hover and selected steps, code blocks and error states.
- TV is deliberately neutral: `canvas`, `border-subtle` chips and search, and no glows, so the thumbnails are the colour.

### Type
- **Geist** (400/500/600) for all interface copy. **JetBrains Mono** (500) for tags, eyebrows, chips' meta, duration badges and code. Both load from Google Fonts.
- Use `display-lg` once per page (the hero), `headline-lg` for page titles, `headline-md` for section headers, `headline-sm` for card titles, `body-lg` for subtext, `body-md` for UI and `body-sm` for video meta. Use `label-md` and `label-sm` for mono labels.
- Build hierarchy with 500 and 600 weights only. Never use 700+ or black weights. Large headlines tighten (−0.02 to −0.035em). Mono labels open up (+0.05em).

### Space and layout
- Everything sits on an 8pt rhythm: `space-xs` 4 · `space-sm` 8 · `space-md` 16 · `space-lg` 24 · `space-xl` 40.
- Desktop uses a 12-column grid with a `gutter` of 24px and a `margin` of 32px, on a 1280px content column. Tablet and mobile drop the margin to 16px.
- Content grids are 3-up for cards (Hub) and 4-up for video (TV), stepping down at 1280, 1024 and 640px.
- Glass containers pad with `space-lg`.

### Shape
- `rounded` (8px) for buttons and inputs, `rounded-md` (12px) for thumbnails and sidebar items, `rounded-lg` (16px) for cards, and `rounded-xl` (24px) for modals and the hero panel.
- `rounded-full` is only for pills: tags, chips, the search bar and avatars. The duration badge uses `rounded-sm`.
- Never use 0px corners, except inside code editors and data grids.

### Depth, glass and states
- Glass is `surface-card` at 80% with `backdrop-filter: blur(var(--blur-glass))` (12px) and the `border-subtle` hairline (`.paw-glass`). It's used on the sticky nav, cards and floating panels.
- Shadows are tinted light, not weight. `glow-sm` sits under the primary button at rest. `glow-md` is the hover state of interactive cards and the primary button. `elevation-glass` sits under the sticky nav and floating panels.
- **Hover:** cards lift 6px, the border turns violet and they take `glow-md`. Secondary buttons frost to 6% white. Chips step up to `surface-bright`.
- **Focus:** every control shows a 2px solid `focus-ring` (#ADC6FF) outline, offset 2px. It's ≥8:1 on `canvas` and `surface-card`.
- **Selected:** a filter chip inverts to `text-primary` with `canvas` text. A sidebar item sits on `surface-card` with a `primary` icon.
- **Motion:** use 150–250ms ease-out on transform, shadow and border only. All of it switches off under `prefers-reduced-motion`.

### Imagery
- Thumbnails are 16:9 and are the colourful content. If a course or video has no artwork, use the token-built `.paw-thumb` variants (`--blue`, `--violet`, `--warm`, `--teal`, `--mono`). Each is a radial wash of accent tokens, a faint dot grid, a mono kicker, a 2-to-4-word title and one line glyph.
- The hero shows a live agent-pipeline card (steps, status pill, progress), not decoration. Abstract graphics are agent graphs of nodes and orbits, drawn in tokens. Don't use stock robots, brains or glowing faces.
- People photography is only Niharika's own portrait (`assets/Photos/niharika-headshot.jpg`), used as the channel avatar.

### Accessibility notes
- White on `accent-blue` is 3.7:1, which comes from the brief's colours. Primary button labels stay 16px/600 or larger and lean on the violet end of the gradient. Never set small white text on plain `accent-blue`.
- The duration badge (`badge-ink` on `badge-bg`) is 21:1. Chip and tag text clears 4.5:1 on its fill.

## Iconography

- Use **Lucide** (the site already uses `lucide-react`): outline icons at a 1.75px stroke, 20px in nav and buttons and 24px max. Draw them in `currentColor`, so they inherit `text-secondary`, or `primary` when active.
- The sidebar set is Home (`home`), Shorts (`zap`), Playlists (`list-video`), AI Bootcamps (`graduation-cap`) and Library (`library`). Header icons are `search`, `bell` and `menu`. Actions use `arrow-right`, `download` and `file-text`.
- Icon-only buttons are 40px circles with an `aria-label`.
- The previews inline the Lucide paths as SVG, so there's no icon font to load.

### Light theme
- Dark is the primary theme. The **Light** theme keeps the same structure: `canvas` turns #F8FAFC, cards are white (`surface-card`) with `border-subtle` #E2E8F0 hairlines, and text is `text-primary` #0F172A with `text-secondary` #475569.
- Accents deepen so they read on white: the gradient runs `accent-blue` #2563EB → `accent-violet` #7C3AED (white labels 5.2:1), and links and focus use `primary` #1D4ED8. Tags sit on the pale containers (`primary-container`, `secondary-container`, `tertiary-container`) with the dark role colour as text.
- Glass becomes white at 80% with a soft `elevation-glass`. Glows are halved.
- Thumbnails and code wells stay dark in both themes. They're content, so they don't flip.

## Brand mark

The logo is a chevron (the prompt) opening into a node network (the agent), in electric blue to cyan on deep navy (`assets/Logos/promptatwork-mark.png`). The full lockup with the "NIHARIKA DHANDE" byline is `promptatwork-lockup.png`.
- In UI, show the mark as a 36px tile with a 10px radius, beside the wordmark set live in Geist 600: "Prompt" in `text-primary` and "AtWork" in `brand-accent`.
- The mark's navy ground stays in both themes. On light pages it reads as an app icon.
- Never recolour, redraw or crop into the network. The old `P/` text mark is retired.

## Using the components

Load `tokens.css` and then `components/bundle.css`, then write plain HTML with the `paw-` classes. Each component's guidelines list its markup. The two **Screens** (LmsHub, PromptAtWorkTV) are full reference layouts built only from these parts.
