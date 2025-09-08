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
- Content bodies (optional, HTML):
  - Posts: `content/posts/<slug>.html`
  - Projects: `content/projects/<slug>.html`
- Homepage rendering: `script.js` fetches JSON and builds cards.
- Detail rendering: `detail.js` loads JSON, then injects the HTML body if present.

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
