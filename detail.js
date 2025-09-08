// Detail page renderer for posts and projects
(function () {
  function qs(sel) { return document.querySelector(sel); }
  function qsp(param) {
    const u = new URL(location.href);
    return u.searchParams.get(param);
  }
  function slugify(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (e) {
      console.warn("Failed to load", path, e);
      return null;
    }
  }
  async function fetchContentHTML(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (_) {
      return null;
    }
  }

  // Simple mobile nav toggle (keeps header consistent with index)
  const navToggle = qs(".nav-toggle");
  const navLinksEl = qs("#primary-nav");
  if (navToggle && navLinksEl) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinksEl.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const root = qs("#article-root");
  const type = root ? root.getAttribute("data-type") : null;
  const slug = qsp("slug");
  if (!root || !type || !slug) {
    if (root) root.innerHTML = '<div class="container"><p>Content not found.</p></div>';
    return;
  }

  // Mark the appropriate nav item active
  const navPosts = qs('.nav-links a[href="posts.html"]');
  const navProjects = qs('.nav-links a[href="projects.html"]');
  if (type === 'post' && navPosts) navPosts.classList.add('active');
  if (type === 'project' && navProjects) navProjects.classList.add('active');

  const titleEl = qs("#article-title");
  const dateEl = qs("#article-date");
  const tagsEl = qs("#article-tags");
  const heroEl = qs("#article-hero");
  const contentEl = qs("#article-content");
  // Project-only sections
  const ledeEl = qs('#project-lede');
  const overviewWrap = qs('#project-overview');
  const overviewText = qs('#project-overview-text');
  const detailsWrap = qs('#project-details-wrapper');
  const detailsGrid = qs('#project-details-grid');
  const writingWrap = qs('#project-writing');

  (async () => {
    const dataPath = type === "post" ? "data/posts.json" : "data/projects.json";
    const items = await fetchJSON(dataPath);
    if (!Array.isArray(items)) {
      contentEl.innerHTML = "<p>Unable to load content.</p>";
      return;
    }
    const item = items.find((x) => (x.slug || slugify(x.title)) === slug);
    if (!item) {
      contentEl.innerHTML = "<p>Content not found.</p>";
      return;
    }

    // Title
    titleEl.textContent = item.title || "Untitled";

    // Meta (date + tags)
    if (dateEl && item.datePretty) {
      dateEl.textContent = item.datePretty;
    }
    if (tagsEl && Array.isArray(item.tags)) {
      tagsEl.innerHTML = item.tags.map((t) => `<span class="post-tag">${t}</span>`).join("");
    }

    // Hero image (if available). Allow optional link (imageLink or link)
    if (heroEl && item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt || item.title || "";
      img.loading = "lazy";
      const heroHref = item.imageLink || item.link || "";
      if (heroHref) {
        const a = document.createElement("a");
        a.href = heroHref;
        if (/^https?:\/\//.test(heroHref)) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        a.appendChild(img);
        heroEl.appendChild(a);
      } else {
        heroEl.appendChild(img);
      }
      heroEl.hidden = false;
    }

    // Body content: try content file first, else fall back to JSON fields
    const contentPath = `content/${type}s/${slug}.html`;
    const html = await fetchContentHTML(contentPath);
    if (type === 'project') {
      // Description (lede) below the title
      if (ledeEl && item.description) {
        ledeEl.textContent = item.description;
        ledeEl.hidden = false;
      }
      // Overview paragraphs (separate from description)
      if (overviewWrap && overviewText && (Array.isArray(item.overview) ? item.overview.length : !!item.overview)) {
        if (Array.isArray(item.overview)) {
          overviewText.innerHTML = item.overview.map(p => `<p>${String(p)}</p>`).join('');
        } else {
          overviewText.innerHTML = `<p>${String(item.overview)}</p>`;
        }
        overviewWrap.hidden = false;
      }
      // Project Details (images + captions; previously Gallery)
      if (detailsWrap && detailsGrid && Array.isArray(item.gallery) && item.gallery.length) {
        detailsGrid.innerHTML = '';
        item.gallery.forEach((g) => {
          const fig = document.createElement('figure');
          fig.className = 'details-item';
          const img = document.createElement('img');
          img.src = g.src || g.image || '';
          img.alt = g.alt || g.caption || item.title || 'Project image';
          img.loading = 'lazy';
          const mediaLink = g.link || g.href || g.url;
          const cap = document.createElement('figcaption');
          const hasTitle = !!(g.title && String(g.title).trim());
          const hasCaption = !!(g.caption && String(g.caption).trim());
          if (hasTitle) {
            const t = document.createElement('div');
            t.className = 'details-title';
            t.textContent = g.title;
            cap.appendChild(t);
          }
          if (hasCaption || (!hasTitle && g.alt)) {
            const c = document.createElement('div');
            c.className = 'details-caption';
            c.textContent = hasCaption ? g.caption : (g.alt || '');
            cap.appendChild(c);
          }
          if (mediaLink) {
            const a = document.createElement('a');
            a.href = mediaLink;
            if (/^https?:\/\//.test(mediaLink)) { a.target = '_blank'; a.rel = 'noopener'; }
            a.appendChild(img);
            fig.appendChild(a);
          } else {
            fig.appendChild(img);
          }
          if (cap.childNodes.length) fig.appendChild(cap);
          detailsGrid.appendChild(fig);
        });
        detailsWrap.hidden = false;
      }
      // Writing
      if (html) {
        contentEl.innerHTML = html;
        if (writingWrap) writingWrap.hidden = false;
      } else if (Array.isArray(item.writings) && item.writings.length) {
        // Render multi-paragraph writing from JSON array
        contentEl.innerHTML = '';
        item.writings.forEach((para) => {
          const p = document.createElement('p');
          p.textContent = String(para || '');
          contentEl.appendChild(p);
        });
        if (writingWrap) writingWrap.hidden = false;
      } else {
        // No writing provided; keep section hidden
        if (writingWrap) writingWrap.hidden = true;
      }
    } else {
      if (html) {
        contentEl.innerHTML = html;
      } else if (type === "post") {
        contentEl.innerHTML = `<p>${item.excerpt || ""}</p>`;
      }
    }
  })();
})();
