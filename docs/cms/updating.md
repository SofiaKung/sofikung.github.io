# Update Instructions

Follow these steps to add or edit content via GitHub.

## Add a New Post
1. Choose a unique, URL-safe slug (e.g., `my-new-post`).
2. Edit `data/posts.json` and append an object:
   ```json
   {
     "title": "My New Post",
     "slug": "my-new-post",
     "date": "2025-04-01",
     "datePretty": "Apr 1, 2025",
     "excerpt": "One-sentence summary for the list.",
     "image": "assets/my-new-post.jpg",
     "alt": "Preview image description",
     "tags": ["Analytics", "Product"],
     "link": "https://yourblog.com/my-new-post"  // optional: sends users directly to this URL
   }
   ```
3. (Optional) Create a body file at `content/posts/my-new-post.html` with your article HTML.
4. Commit and push. The homepage and `post.html?slug=my-new-post` will update on next load.

## Add a New Project
1. Choose a slug (e.g., `fraud-detection-pipeline`).
2. Edit `data/projects.json` and append an object:
   ```json
   {
     "title": "Fraud Detection Pipeline",
     "slug": "fraud-detection-pipeline",
     "description": "Short overview used at the top of the detail page.",
     "image": "assets/fraud-pipeline.jpg",
     "alt": "Pipeline architecture diagram",
     "tags": ["Risk", "Streaming"],
     "link": "https://example.com/case-study" , // optional: direct URL override
     "writings": [
       "Paragraph one of the case study.",
       "Paragraph two with more details."
     ],
     "gallery": [
       { "src": "assets/pipeline-overview.jpg", "title": "Overview", "caption": "End-to-end flow from events to decisions." },
       { "src": "assets/feature-store.jpg", "title": "Feature store", "caption": "Low-latency features powering rules and models." }
     ]
   }
   ```
3. (Optional) Add `content/projects/fraud-detection-pipeline.html` for full custom writing. If present, it overrides `writings`.
4. Commit and push. The homepage and `project.html?slug=fraud-detection-pipeline` will update.

## Edit Existing Items
- Update the corresponding object in `data/posts.json` or `data/projects.json`.
- Edit the HTML body file if present.

## Images
- Place images under `assets/` and reference with a relative path (e.g., `assets/my-image.jpg`).
- Always add descriptive `alt` text for accessibility.

## Local Preview
Because the site loads content with `fetch`, use a local server:
- Python: `python3 -m http.server 8000` then open `http://localhost:8000/`.
- VS Code: Live Server works too.
