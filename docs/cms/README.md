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

Posts also support:
- `date` (YYYY-MM-DD)
- `datePretty` (e.g., `Mar 1, 2025`)
- `excerpt` (used on list and as fallback body)

Projects also support:
- `description` (used on list and as fallback body)

See Update Instructions for how to add or edit content.
