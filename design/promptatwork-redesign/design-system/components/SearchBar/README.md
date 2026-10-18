# SearchBar

The centred, pill-shaped search field in the TV header: a `border-subtle` fill, with the magnifier button attached on the right.

- Markup: `<div class="paw-search"><input …><button class="paw-search__btn">…</button></div>`. Its maximum width is 640px.
- On focus it sinks to `canvas` and gains an `accent-blue` border with a soft blue ring. Add `is-focus` to show this state in mocks.
- Write the placeholder as a list of what can be found: "Search tutorials, bootcamps, notes".
- For ordinary form fields, use `paw-input` (sunken `canvas` with a `rounded` corner).
