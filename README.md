# Website Project

A clean portfolio site with a lightweight, GitHub-based CMS. Homepage lists Projects and Posts; list pages render the same data; detail pages render from Markdown (YAML front matter + body) with no JSON dependency.

## Quick Start
- Installation:
  - Clone: `git clone <your-fork-or-repo-url>` and open the folder.
- Development setup (fetch requires HTTP):
  - Python: `python3 -m http.server 8000`
  - Node: `npx http-server -p 8000` or `npx serve .`
  - VS Code: use the “Live Server” extension
  - Visit: `http://localhost:8000/`

## CMS System
Content is stored in-repo and loaded at runtime from Markdown plus a small JS manifest.

- Manifest for lists (runtime source for cards):
  - `content/manifest.js` defines `window.CONTENT_INDEX = { projects, posts }`
- Detail pages (routing by slug):
  - Post page: `/post.html?slug=<post-slug>`
  - Project page: `/project.html?slug=<project-slug>`
- Direct links (skip detail page):
  - Provide `link` (or `externalUrl`) in the JSON item to link cards directly to that URL.
  - External URLs (`http(s)://…`) open in a new tab; internal paths work too.
- Content bodies (optional):
  - HTML file: `content/posts/<slug>.html` or `content/projects/<slug>.html`
  - YAML content blocks in the `.md` front matter (see Flexible Content Blocks below)
- Rendering entry points:
  - Homepage: `script.js` reads `window.CONTENT_INDEX` and builds cards for Projects and Posts.
  - List pages: `list.js` renders `/projects/` and `/blog/` from `window.CONTENT_INDEX`.
  - Detail pages: `detail.js` parses each page’s Markdown front matter directly (no JSON).

### Markdown + YAML Front Matter
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

Note: the site renders lists from a JS manifest and detail pages directly from Markdown + YAML front matter. No `data/*.json` files are used.

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

### Flexible Content Blocks (YAML `content_blocks`)
For structured copy within the front matter, use `content_blocks`. If the Markdown body (below the front matter) is empty, the detail page renders these blocks.

Supported blocks:
- heading: `- type: "heading"`, with `level` and `text`
- paragraph: `- type: "paragraph"`, with `text`
- list: `- type: "list"`, with `items: [..]` and optional `ordered`
- quote: `- type: "quote"`, with `text` and optional `cite`
- image: `- type: "image"`, with `src`, `alt`, `caption`

Example content_blocks in YAML front matter:

```yaml
content_blocks:
  - type: "heading"
    level: 3
    text: "The Challenge"
  - type: "paragraph"
    text: "How do you make sense of billions in government spending? …"
  - type: "heading"
    level: 3
    text: "The Solution"
  - type: "paragraph"
    text: "We built an interactive dashboard using R Shiny …"
```

Fallback behavior:
- Projects and Posts: prefer Markdown body in the `.md` file. If absent, render `content_blocks` from YAML. If neither present, fall back to an HTML body at `content/<type>s/<slug>.html`. Posts finally fall back to `excerpt`.

## Project Structure (high level)
- `index.html` — Homepage (hero, Projects, Posts)
- `blog/index.html`, `projects/index.html` — List pages
- `post.html`, `project.html` — Detail templates (shared nav/footer)
- `nav.js`, `footer.js` — Inject shared nav/footer from `partials/`
- `script.js` — Homepage interaction + list rendering
- `list.js` — List page rendering
- `detail.js` — Detail page renderer
- `styles.css` — Site styles (cards, article typography, responsive)
- `content/` — Optional HTML bodies per slug
- `content/` — Optional HTML or Markdown (`.md` with YAML front matter) per slug
- `content/manifest.js` — Generated manifest for list pages (defines `window.CONTENT_INDEX`)
- `assets/` — Images and icons

## Scripts

### Build manifest from Markdown
Generate `content/manifest.js` from the YAML front matter in your Markdown files (lists/cards use this manifest):

```
node scripts/build-content-index.js
```

Outputs:
- `content/manifest.js` (defines `window.CONTENT_INDEX = { projects, posts }`)

Notes:
- Script reads `content/projects/*.md` and `content/posts/*.md`.
- It extracts core fields (title, slug, dates, description, hero image/alt/link, tags, and gallery for projects).
- Run this after adding or editing Markdown so list pages stay in sync.

### Add a new Project/Post (Markdown-first)
1) Create `content/projects/<your-slug>.md` or `content/posts/<your-slug>.md` with front matter similar to the template above.
2) Commit the file, then run `node scripts/build-content-index.js` to update `content/manifest.js`.

## Deployment
- Any static host works (GitHub Pages, Netlify, Vercel).
- Paths are root-absolute (e.g., `/content/...`, `/partials/...`). Deploy at the domain root (recommended; e.g., with a CNAME) for these to work as-is. If deploying under a subpath, adjust the fetch/links to be relative.
- After pushing content changes (Markdown/HTML), rebuild the manifest (`node scripts/build-content-index.js`) and pages update on next load.
