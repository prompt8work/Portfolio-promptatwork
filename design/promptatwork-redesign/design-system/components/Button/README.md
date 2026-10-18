# Button

Primary carries the blue-to-violet gradient (`accent-blue` → `accent-violet`); use it once per view for the action the page exists for.

| Class | Use |
| --- | --- |
| `paw-btn paw-btn--primary` | The one main CTA: "Start Learning". Gradient fill, `glow-sm` at rest, inner highlight plus `glow-md` on hover. |
| `paw-btn paw-btn--secondary` | The companion action: "View Portfolio". Transparent with a `border-subtle` edge; frosted white on hover. |
| `paw-btn paw-btn--ghost` | Tertiary text actions in toolbars. |
| `paw-btn paw-btn--icon` | 40px round icon-only button (search, bell). Always give it an `aria-label`. |
| `paw-btn--sm` | 36px height for dense rows (note downloads, card actions). |

- The consumer provides the label (verb first, Title Case for CTAs) and an optional trailing Lucide icon.
- Labels stay 16px/600 on primary: white on `accent-blue` is only 3.7:1, which passes for large text only.
- Add `is-hover` to show the hover state in static mocks.
