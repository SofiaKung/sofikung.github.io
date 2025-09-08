# CMS Documentation

This site uses a simple GitHub-based CMS: JSON files define lists, and optional HTML files provide full article bodies. No build step required.

## Content Model
- Posts list: `data/posts.json`
- Projects list: `data/projects.json`
- Post body (optional): `content/posts/<slug>.html`
- Project body (optional): `content/projects/<slug>.html`

Each list item uses a unique `slug`. Detail pages resolve by slug:
- `post.html?slug=<post-slug>`
- `project.html?slug=<project-slug>`

## Fields
Common fields across posts/projects:
- `title` (string)
- `slug` (string, URL-safe, unique)
- `tags` (string[])
- `image` (string, optional, path like `assets/your-image.jpg`)
- `alt` (string, optional alt text for the image)
- `link` (string, optional) — direct URL to open when clicking the card. If present, it overrides slug-based routing. External URLs open in a new tab.

Posts also support:
- `date` (YYYY-MM-DD)
- `datePretty` (e.g., `Mar 1, 2025`)
- `excerpt` (used on list and as fallback body)

Projects also support:
- `description` (short overview shown on the detail page)
- `writings` (string[], optional) — multi‑paragraph case‑study content rendered under “Writing” when no HTML content file is present
- `gallery` (optional) — array of items:
  - `src` (string): image path
  - `title` (string, optional): small heading for the image
  - `caption` (string, optional): description shown under the title
  - `alt` (string, optional): alt text for accessibility
  - `link` (string, optional): when provided, clicking the image opens this URL (external links open in a new tab)
  
Project-level optional:
- `imageLink` (string, optional): makes the main hero image clickable on the project detail page; falls back to `link` if present.

See Update Instructions for how to add or edit content.
