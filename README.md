# Website Project

A clean portfolio site with a lightweight, GitHub-based CMS. Homepage lists Projects and Posts; list pages render the same data; detail pages are rendered from JSON lists and optional HTML or JSON block content.

## Quick Start
- Installation:
  - Clone: `git clone <your-fork-or-repo-url>` and open the folder.
- Development setup (fetch requires HTTP):
  - Python: `python3 -m http.server 8000`
  - Node: `npx http-server -p 8000` or `npx serve .`
  - VS Code: use the “Live Server” extension
  - Visit: `http://localhost:8000/`

## CMS System
Content is stored in-repo and loaded at runtime.

- Data lists (current runtime source of truth):
  - Posts: `data/posts.json`
  - Projects: `data/projects.json`
- Detail pages (routing by slug):
  - Post page: `/post.html?slug=<post-slug>`
  - Project page: `/project.html?slug=<project-slug>`
- Direct links (skip detail page):
  - Provide `link` (or `externalUrl`) in the JSON item to link cards directly to that URL.
  - External URLs (`http(s)://…`) open in a new tab; internal paths work too.
- Content bodies (optional):
  - HTML file: `content/posts/<slug>.html` or `content/projects/<slug>.html`
  - JSON blocks: set `body` in your JSON item (see Flexible Content Blocks below)
- Rendering entry points:
  - Homepage: `script.js` fetches JSON and builds cards for Projects and Posts.
  - List pages: `list.js` renders `/projects/` and `/blog/` from the same JSON data.
  - Detail pages: `detail.js` loads JSON, then injects HTML or JSON blocks if present.

### Markdown + YAML Front Matter (new authoring format)
You can author posts and projects as one Markdown file per item with a YAML front matter block. Files live in:

- Projects: `content/projects/<slug>.md`
- Posts: `content/posts/<slug>.md`

These files follow a schema inspired by the existing JSON data:

```yaml
---
title: "Example Title"
slug: "example-slug"
date: "2024-01-01"
date_pretty: "Jan 1, 2024"
description: "Short summary for cards and detail lede"
type: "project" # or "post"

hero:
  image: "assets/cover.png"
  alt: "Accessible alt text"
  link: "https://example.com"
  link_text: "View Live Project"

project:
  tags: ["Tag A", "Tag B"]

content_blocks:
  - type: "heading"
    level: 3
    text: "The Challenge"
  - type: "paragraph"
    text: "Body text…"

gallery:
  layout: "masonry"
  columns: 2
  items:
    - src: "assets/example-1.png"
      title: "Caption title"
      alt: "Alt"
      caption: "Longer caption text"

seo:
  keywords: ["keyword1", "keyword2"]
  og_image: "assets/cover.png"
---

Optional markdown body can go here…
```

Note: the current site still renders from the JSON lists at runtime. To fully switch rendering to Markdown + YAML, either add a build step that converts front matter to JSON before deploy, or update the client JS to fetch and parse these files directly.

### Clean URLs
- List pages live at:
  - Blog: `/blog/` (`blog/index.html`)
  - Projects: `/projects/` (`projects/index.html`)
- Nav and footer are injected from partials so paths work on nested routes:
  - Navbar: `partials/nav.html` via `nav.js`
  - Footer: `partials/footer.html` via `footer.js`

## Projects & Posts Data

Shared core fields per item:
- `title` (string)
- `slug` (string) — used for detail page routing
- `tags` (string[])
- `description` (string) — short overview (used on projects detail page)
- Cover image (all views): use one of
  - `cover` (preferred)
  - `coverImage`
  - `image` (fallback)
- Alt text (cover):
  - `coverAlt` (preferred) → `alt` → `title`
- Optional direct link:
  - `link` or `externalUrl`

Project-only extras:
- `gallery`: array of images with optional captions (rendered as Project Details)
  - Each item: `{ src, title?, caption?, alt?, link? }`

Post-only extras:
- `date` (ISO), `datePretty` (display string), `excerpt` (fallback snippet)

### Flexible Content Blocks (JSON `body`)
Use a `body` array for long-form writing (works for both Projects and Posts). If present, it takes precedence over HTML and `writings`/`excerpt`.

Supported blocks:
- heading: `{ "type": "heading", "level": 2, "text": "The Challenge" }` (level: 2–4)
- paragraph: `{ "type": "paragraph", "text": "How do you make sense…" }`
- list: `{ "type": "list", "ordered": false, "items": ["A", "B"] }`
- quote: `{ "type": "quote", "text": "A key insight", "cite": "Someone" }`
- image: `{ "type": "image", "src": "assets/foo.jpg", "alt": "desc", "caption": "optional" }`

Example body for a project:

```json
{
  "title": "Visualizing Singapore Government Spending",
  "slug": "visualise-spending",
  "cover": "assets/Geviz_project_cover.png",
  "tags": ["Dashboard", "R Shiny"],
  "description": "Insights into the spending pattern...",
  "body": [
    { "type": "heading", "level": 2, "text": "The Challenge" },
    { "type": "paragraph", "text": "How do you make sense of billions in government spending? Singapore's government budget data is publicly available, but buried in dense PDF reports and spreadsheets. Citizens deserve to understand where their tax dollars go—but who has time to parse through hundreds of pages of financial documents?" },
    { "type": "heading", "level": 2, "text": "The Solution" },
    { "type": "paragraph", "text": "I built an interactive dashboard that transforms Singapore's complex budget data into clear, explorable visualizations. Think of it as Google Analytics, but for government spending." }
  ]
}
```

Fallback behavior:
- Projects: if no `body`, use `content/projects/<slug>.html`; else use `writings` (string array paragraphs) if provided.
- Posts: if no `body`, use `content/posts/<slug>.html`; else show `excerpt`.

## Project Structure (high level)
- `index.html` — Homepage (hero, Projects, Posts)
- `blog/index.html`, `projects/index.html` — List pages
- `post.html`, `project.html` — Detail templates (shared nav/footer)
- `nav.js`, `footer.js` — Inject shared nav/footer from `partials/`
- `script.js` — Homepage interaction + list rendering
- `list.js` — List page rendering
- `detail.js` — Detail page renderer
- `styles.css` — Site styles (cards, article typography, responsive)
- `data/` — JSON data for lists
- `content/` — Optional HTML bodies per slug
- `content/` — Optional HTML or Markdown (`.md` with YAML front matter) per slug
- `assets/` — Images and icons

## Scripts

### Convert existing JSON to Markdown files
Generate one Markdown-with-YAML file per Project/Post from the existing `data/*.json`:

```
node scripts/convert-to-yaml.js
```

Outputs:
- `content/projects/<slug>.md`
- `content/posts/<slug>.md`

Notes:
- Running the script is idempotent; it will overwrite existing generated `.md` files with the same slug.
- Fields not present in JSON are omitted (e.g., `status`, `tech_stack`). You can add them manually after generation.

### Add a new Project/Post (Markdown-first)
1) Create `content/projects/<your-slug>.md` or `content/posts/<your-slug>.md` with front matter similar to the template above.
2) Commit the file. If you rely on runtime JSON today, mirror the entry in `data/projects.json` or `data/posts.json` until the frontend is updated to read Markdown directly.

## Deployment
- Any static host works (GitHub Pages, Netlify, Vercel).
- Paths are root-absolute (e.g., `/data/...`, `/partials/...`). Deploy at the domain root (recommended; e.g., with a CNAME) for these to work as-is. If deploying under a subpath, adjust the fetch/links to be relative.
- After pushing content changes (JSON/HTML), pages update on next load (no build step required).
