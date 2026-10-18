# CourseCard

A glass card for a course or portfolio project: a 16:9 thumbnail, a mono meta line, a bold title, tech tags and an optional progress bar.

- Markup: `<a class="paw-card">` → `.paw-thumb` → `.paw-card__body` (`.paw-card__meta`, `h3.paw-card__title`, an optional `.paw-card__desc`, `.paw-tags`) → an optional `.paw-card__foot` holding a ProgressBar.
- On hover the card lifts 6px, its border turns violet and it takes the `glow-md` shadow. A play button also fades in over the thumbnail. Add `is-hover` to show this state in mocks (the middle card above).
- The consumer provides the thumbnail (a real image in a `.paw-thumb`, or the token-built art variants `--blue`, `--violet`, `--warm`, `--teal`, `--mono`), the meta (level · duration), the title, at most 3 tags, and the progress percentage.
- Portfolio cards use the same card with a one-line `.paw-card__desc` and no progress bar.
- Lay cards out in a 3-column grid with a `gutter` gap. Go to 2 columns below 1024px and 1 column below 640px.
