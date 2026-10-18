# TopNav

The sticky glass bar across the hub. It holds the Brand on the left, then the primary links (Courses, Tools, TV, Portfolio), with search and the profile avatar on the right.

- Markup: `<nav class="paw-topnav paw-glass">`. It's 68px tall, with a `surface-card` fill at 80%, `blur-glass`, a `border-subtle` bottom edge and `elevation-glass`.
- The active link turns `text-primary` and gets a 2px gradient underline that sits on the bar's bottom edge. Inactive links are `text-secondary`.
- `paw-live` (the `tertiary` dot) next to TV means a stream or new upload is live.
- Below 768px, collapse the links into a menu button. The brand and avatar stay visible.
