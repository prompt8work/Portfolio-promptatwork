# FilterChip

A rounded chip that filters a grid (used in TV). It has a `border-subtle` fill, and the selected chip inverts to `text-primary` with `canvas` text.

- Markup: `<div class="paw-chips" role="tablist">` holding `<button class="paw-chip" role="tab">`. Mark the active chip with `is-selected` and `aria-selected="true"`.
- The first chip is always "All". Use sentence case for topic names: "Agentic AI", "Prompt Engineering".
- The row scrolls horizontally and never wraps.
