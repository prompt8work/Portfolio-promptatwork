# Sidebar

The fixed 240px left rail in PromptAtWork TV: a Lucide icon plus a label for Home, Shorts, Playlists, AI Bootcamps and Library.

- Markup: `<aside class="paw-sidebar">` holding `<a class="paw-sidebar__item">` elements.
- The active item sits on `surface-card` with a hairline ring, and its icon turns `primary`. Hover uses `surface-container-high`.
- Separate groups with `paw-sidebar__rule` and give each group a mono `paw-sidebar__label`.
- Below 1024px it collapses to a 72px icon rail. Below 640px it becomes a bottom tab bar.
