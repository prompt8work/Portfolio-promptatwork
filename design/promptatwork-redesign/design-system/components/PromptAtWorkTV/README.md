# PromptAtWorkTV

Screen 2 is the in-platform video library. It follows YouTube's layout so learners already know their way around, and everything except the thumbnails stays quiet.

- Layout: a 64px sticky header (menu, Brand plus a `TV` tag, a centred SearchBar, then the notification bell and avatar on the right), a fixed 240px Sidebar, and a main column with a sticky FilterChip row above a 4-column VideoCard grid (40px row gap, 16px column gap).
- The grid drops to 3 columns below 1280px, 2 below 1024px (where the sidebar collapses to icons) and 1 below 640px.
- The bell's count badge uses `tertiary-container` with `on-tertiary-fixed` text, the one warm note in the header.
- No glass panels or glows here: the page is `canvas`, so the thumbnails carry all the colour.
- The video titles, view counts and dates are sample content until the YouTube sync feeds this grid.
