# Church Scripture Display

A lightweight Bible website you can run locally or host on any static web host. It is designed to quickly load passages and switch to a clean projection mode during services.

## Features

- Passage search (e.g., `John 3:16-18`, `Psalm 23`)
- Translation selector (KJV, WEB, ASV, BBE)
- Recent passage shortcuts
- Projection mode for large on-screen verse display

## Run locally

Because this app uses `fetch`, run it with a local web server instead of opening the HTML file directly.

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Notes

- Scripture text is loaded from [bible-api.com](https://bible-api.com), so internet access is required.
- You can customize default passage and visual styles in `index.html` and `styles.css`.
