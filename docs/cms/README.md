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

## Project Filtering

The projects page (`/projects`) includes a filter system that categorizes projects by type. Projects are filtered using category tags in their `tags` array.

### Filter Categories

Three filter categories are available:
- **Data** — data visualization and analytics projects
- **ML** — machine learning and AI projects
- **Web App** — web applications

### How to Use Filter Tags

To make a project appear in a filter category, add the category tag to the project's `tags` array in the frontmatter:

```yaml
project:
  tags:
    - "data"        # Makes it appear in the Data filter
    - "Dashboard"   # Additional descriptive tags
    - "R Shiny"
```

**Available category tags:**
- `"data"` — for data visualization, dashboards, analytics projects
- `"ml"` — for machine learning, AI, fraud detection projects
- `"web"` — for web applications

**Multiple categories:**
Projects can belong to multiple categories by including multiple category tags:

```yaml
project:
  tags:
    - "web"
    - "ml"
    - "Featured"
    - "AI Tarot"
```

**Important notes:**
- Category tags are **case-insensitive** (both `"web"` and `"Web"` work)
- You can combine category tags with descriptive tags
- Projects without category tags will still appear in the "All" view
- The filtering uses substring matching, so ensure category tags are lowercase for consistency

See Update Instructions for how to add or edit content.
