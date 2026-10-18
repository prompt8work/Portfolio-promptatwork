# LmsHub

Screen 1 is the hub for courses, the resource library and the portfolio. It's built only from the components in this system.

- Layout: a sticky TopNav, then a split hero (copy on the left, the abstract agent-graph graphic in a `rounded-xl` glass panel on the right), then three sections on a 1280px column with `margin` side padding and `space-xl`-scale gaps between sections.
- Hero: an eyebrow pill, the `display-lg` headline "Master AI Agents & Prompt Engineering" with a gradient on the key phrase only, `body-lg` subtext in `text-secondary`, the primary "Start Learning" and secondary "View Portfolio" CTAs, then a "Built with" tag row.
- Sections: "Latest Frameworks" (3 CourseCards with progress, the middle one shown in its hover state), "Downloadable Notes" (3 NoteCards), and "Selected Work" (3 portfolio cards with descriptions and no progress).
- The background is `canvas` with two faint radial washes of `accent-violet` and `accent-blue` at the top. Never use a full gradient page.
- Course titles come from the live site's course catalogue. The portfolio projects, note sizes and the hero's floating code are sample content.
