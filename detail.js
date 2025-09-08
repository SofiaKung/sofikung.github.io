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

  // Render a flexible JSON body: array of blocks
  function renderBodyBlocks(blocks, container) {
    if (!Array.isArray(blocks) || !container) return false;
    container.innerHTML = "";
    blocks.forEach((b) => {
      const type = (b && b.type) || "paragraph";
      if (type === "heading") {
        const level = Math.min(4, Math.max(2, Number(b.level) || 2));
        const h = document.createElement("h" + level);
        h.textContent = String(b.text || b.content || "");
        h.className = "article-subtitle";
        container.appendChild(h);
      } else if (type === "paragraph") {
        const p = document.createElement("p");
        p.textContent = String(b.text || b.content || "");
        container.appendChild(p);
      } else if (type === "list") {
        const items = Array.isArray(b.items) ? b.items : [];
        const ul = document.createElement(b.ordered ? "ol" : "ul");
        items.forEach((t) => {
          const li = document.createElement("li");
          li.textContent = String(t || "");
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else if (type === "quote") {
        const q = document.createElement("blockquote");
        const p = document.createElement("p");
        p.textContent = String(b.text || b.content || "");
        q.appendChild(p);
        if (b.cite) {
          const c = document.createElement("cite");
          c.textContent = String(b.cite);
          q.appendChild(c);
        }
        container.appendChild(q);
      } else if (type === "image") {
        const fig = document.createElement("figure");
        const img = document.createElement("img");
        img.src = String(b.src || b.image || "");
        img.alt = String(b.alt || "");
        img.loading = "lazy";
        fig.appendChild(img);
        if (b.caption) {
          const cap = document.createElement("figcaption");
          cap.textContent = String(b.caption);
          fig.appendChild(cap);
        }
        container.appendChild(fig);
      }
    });
    return true;
  }

  // Simple mobile nav toggle (keeps header consistent with index)
  function bindNavInteractions() {
    const navToggle = qs(".nav-toggle");
    const navLinksEl = qs("#primary-nav");
    if (navToggle && navLinksEl && !navToggle.__boundToggle) {
      navToggle.__boundToggle = true;
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
  }
  bindNavInteractions();
  window.addEventListener('nav-injected', bindNavInteractions);

  const root = qs("#article-root");
  const type = root ? root.getAttribute("data-type") : null;
  const slug = qsp("slug");
  if (!root || !type || !slug) {
    if (root) root.innerHTML = '<div class="container"><p>Content not found.</p></div>';
    return;
  }

  // Mark the appropriate nav item active
  function setActiveNav() {
  const navPosts = qs('.nav-links a[data-nav="blog"], .nav-links a[href$="/blog/"], .nav-links a[href="posts.html"]');
  const navProjects = qs('.nav-links a[data-nav="projects"], .nav-links a[href$="/projects/"], .nav-links a[href="projects.html"]');
  if (type === 'post' && navPosts) navPosts.classList.add('active');
  if (type === 'project' && navProjects) navProjects.classList.add('active');
  }
  setActiveNav();
  window.addEventListener('nav-injected', setActiveNav);

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
    const dataPath = type === "post" ? "/data/posts.json" : "/data/projects.json";
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
    const cover = item.cover || item.coverImage || item.image;
    if (heroEl && cover) {
      const img = document.createElement("img");
      img.src = cover;
      img.alt = item.coverAlt || item.alt || item.title || "";
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
      // Ensure lightbox overlay exists
      let overlay = document.querySelector('.lightbox-overlay');
      let overlayImg = overlay ? overlay.querySelector('img') : null;
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlayImg = document.createElement('img');
        overlay.appendChild(overlayImg);
        overlay.addEventListener('click', () => {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && overlay.classList.contains('open')) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
          }
        });
        document.body.appendChild(overlay);
      }
      function attachLightbox(root) {
        if (!root) return;
        root.querySelectorAll('img').forEach((img) => {
          // Skip if image is wrapped with a link (respect direct links)
          if (img.closest('a')) return;
          img.addEventListener('click', () => {
            overlayImg.src = img.src;
            overlayImg.alt = img.alt || '';
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          });
        });
      }
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
        attachLightbox(detailsGrid);
      }
      // Writing
      if (Array.isArray(item.body) && item.body.length) {
        renderBodyBlocks(item.body, contentEl);
        if (writingWrap) writingWrap.hidden = false;
      } else if (html) {
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
      if (Array.isArray(item.body) && item.body.length) {
        renderBodyBlocks(item.body, contentEl);
      } else if (html) {
        contentEl.innerHTML = html;
      } else if (type === "post") {
        contentEl.innerHTML = `<p>${item.excerpt || ""}</p>`;
      }
    }
  })();
})();
