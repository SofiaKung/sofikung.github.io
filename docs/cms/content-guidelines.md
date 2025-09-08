# Content Guidelines

Keep posts/projects readable, accessible, and visually consistent with the site.

## Slugs and File Names
- Use lowercase letters, numbers, and hyphens: `my-new-item`.
- The slug must be unique and map to the body file path:
  - Post body: `content/posts/<slug>.html`
  - Project body: `content/projects/<slug>.html`

## Writing
- Use short paragraphs and clear headings (`<h2>`, `<h3>`).
- Prefer lists for steps or highlights.
- Keep excerpts concise (1–2 sentences) — they appear on cards.

## HTML Elements
- Paragraphs: `<p>...</p>`
- Headings: `<h2>`, `<h3>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Quotes: `<blockquote>...</blockquote>`
- Code: inline `<code>`, blocks inside `<pre><code>...</code></pre>`
- Links: `<a href="..." target="_blank" rel="noopener">Text</a>`

## Images
- Place images in `assets/` and reference relatively (e.g., `assets/my-image.jpg`).
- Add `alt` text to describe the image’s purpose.
- Avoid extremely large images; prefer ≤ 2000px width and reasonable file size.

## Do Not
- Inline CSS or scripts inside content files (the site handles styles/JS).
- Use `<h1>` in content — the page title already renders as H1.

## Accessibility
- Descriptive link text (avoid “click here”).
- Use semantic headings in order.
