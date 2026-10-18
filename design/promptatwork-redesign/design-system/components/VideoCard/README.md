# VideoCard

A video tile in YouTube's familiar shape: a 16:9 thumbnail with a black duration badge, the channel avatar, a two-line bold title, the channel name, views and upload date.

- Markup: `<article class="paw-video">` → `.paw-thumb` with a `<span class="paw-duration">14:20</span>` → `.paw-video__row` (`img.paw-avatar`, then `h3.paw-video__title`, `.paw-video__channel`, `.paw-video__stats`).
- The duration badge is `badge-bg` at 80% with `badge-ink` mono text in the bottom-right corner, `rounded-sm`.
- Thumbnails are the most colourful thing on the page. Everything around them stays neutral, so don't add tags or colour to the text block.
- The consumer provides the thumbnail, duration (m:ss or h:mm:ss), title (2 lines at most, clamped), view count (12K, 1.2M) and a relative date.
- The video titles in these previews are sample content.
