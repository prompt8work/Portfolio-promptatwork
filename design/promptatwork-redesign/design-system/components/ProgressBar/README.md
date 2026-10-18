# ProgressBar

A subtle 4px course-progress track that sits at the bottom of a course card: a `border-subtle` track holding a gradient fill.

- Markup: `<div class="paw-progress" role="progressbar" aria-valuenow="68">` with `<div class="paw-progress__fill" style="width:68%">` inside it.
- `paw-progress-row` adds the optional mono caption above the track ("PROGRESS · 68%").
- Show it only to signed-in learners who have started the course. Leave it out for portfolio cards and unstarted courses.
