# Website Project

A clean portfolio site with a lightweight, GitHub-based CMS. Homepage lists Projects and Posts; detail pages are rendered from JSON lists and optional HTML content files.

## Quick Start
- Installation:
  - Clone: `git clone <your-fork-or-repo-url>` and open the folder.
- Development setup:
  - Serve locally (required for `fetch`):
    - Python: `python3 -m http.server 8000`
    - Node: `npx http-server -p 8000` or `npx serve .`
    - VS Code: use the “Live Server” extension
  - Visit: `http://localhost:8000/`

## CMS System
Content is stored in the repo and loaded at runtime.

- Data lists:
  - Posts: `data/posts.json`
  - Projects: `data/projects.json`
- Detail pages (routing by slug):
  - Post page: `post.html?slug=<post-slug>`
  - Project page: `project.html?slug=<project-slug>`
- Direct links (no detail page):
  - Provide `link` (or `externalUrl`) in the JSON item to send cards directly to that URL.
  - External URLs (`http(s)://…`) open in a new tab; internal paths can be used as well.
- Content bodies (optional, HTML):
  - Posts: `content/posts/<slug>.html`
  - Projects: `content/projects/<slug>.html`
- Homepage rendering: `script.js` fetches JSON and builds cards.
- Detail rendering: `detail.js` loads JSON, then injects the HTML body if present.

### Project Pages (Overview, Gallery, Writing)
- Sections on `project.html` are populated from `data/projects.json` and optional HTML files:
  - Overview: uses `description` (short summary at top).
  - Gallery: renders a responsive grid when `gallery` items are present.
  - Writing: long-form case study. If `content/projects/<slug>.html` exists, it is used. Otherwise, if a `writings` array is provided, each string is rendered as a paragraph.
- Auto-hide: Overview shows when `description` exists; Gallery shows only if `gallery` has items; Writing shows only if HTML exists or `writings` has at least one paragraph.

Project JSON fields (in addition to `title`, `slug`, `tags`, `image`, `alt`):
- `description`: string — short overview shown near the top of the page.
- `writings`: string[] — optional multi-paragraph content used when there is no HTML file.
- `gallery`: array of objects (optional) with the following keys:
  - `src`: string — image path under `assets/...`
  - `title`: string (optional) — small heading displayed above the caption
  - `caption`: string (optional) — descriptive text under the title
  - `alt`: string (optional) — accessible description for the image

Example project entry:

```json
{
  "title": "Fraud Detection Pipeline",
  "slug": "fraud-detection-pipeline",
  "description": "End-to-end pipeline for real-time risk decisions.",
  "image": "assets/fraud-cover.jpg",
  "alt": "Architecture diagram",
  "tags": ["Risk", "Streaming"],
  "link": "https://medium.com/your-article" ,
  "writings": [
    "Signals run on event streams for proactive prevention.",
    "Feedback loops connect investigator actions to models and rules."
  ],
  "gallery": [
    { "src": "assets/pipeline-overview.jpg", "title": "Overview", "caption": "Events → features → rules/models → decisions." },
    { "src": "assets/feature-store.jpg", "title": "Feature Store", "caption": "Low-latency features available to rules and models." }
  ]
}
```

### Posts & Listings
- Posts are stacked into a rounded container with subtle dividers on the homepage and `posts.html`.
- Each post’s date appears on the same line as the title.

### Hero Photo Deck
- The hero’s photo deck supports drag/swipe. When all cards are swiped away, an “Again” button anchored to the deck’s right-center restores the original stack.

### Docs
- [CMS Documentation](./docs/cms/)
- [Update Instructions](./docs/cms/updating.md)
- [Content Guidelines](./docs/cms/content-guidelines.md)

## Project Structure (high level)
- `index.html` — Homepage (hero, Projects, Posts)
- `post.html`, `project.html` — Detail templates (shared nav/footer)
- `script.js` — Homepage interaction + list rendering
- `detail.js` — Detail page renderer
- `styles.css` — Site styles (cards, article typography, responsive)
- `data/` — JSON data for lists
- `content/` — HTML bodies per slug
- `assets/` — Images and icons

## Deployment
- Any static host works (GitHub Pages, Netlify, Vercel). Ensure the site is served from the repo root or adjust fetch paths if deploying to a subpath.
- After pushing content changes (JSON/HTML), pages update on next load (no build step required).
