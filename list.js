// Listing renderer for all posts/projects pages
document.addEventListener("DOMContentLoaded", () => {
  // Normalize relative asset paths to root-absolute so they work on nested routes
  function toAbs(path) {
    if (!path) return path;
    if (/^(?:https?:)?\/\//.test(path)) return path; // http(s) or protocol-relative
    if (path.startsWith("/")) return path; // already absolute
    return "/" + path.replace(/^\/+/, "");
  }
function setActiveNavBasedOnPath() {
  const p = location.pathname || "";
  const isBlog = /(?:^|\/)blog(?:\/|$)/.test(p) || p.endsWith("posts.html");
  const isProjects = /(?:^|\/)projects(?:\/|$)/.test(p) || p.endsWith("projects.html");
  if (isBlog) {
    const link = document.querySelector('.nav-links a[data-nav="blog"], .nav-links a[href$="/blog/"], .nav-links a[href="posts.html"]');
    if (link) link.classList.add("active");
  }
  if (isProjects) {
    const link = document.querySelector('.nav-links a[data-nav="projects"], .nav-links a[href$="/projects/"], .nav-links a[href="projects.html"]');
    if (link) link.classList.add("active");
  }
}
  function bindNavInteractions() {
    // Active highlight
    setActiveNavBasedOnPath();
    // Mobile menu
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksEl = document.getElementById("primary-nav");
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
  // Initial bind (in case nav already present)
  bindNavInteractions();
  // Rebind when nav partial is injected
  window.addEventListener("nav-injected", bindNavInteractions);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  function getIndex(kind) {
    const idx = (window.CONTENT_INDEX && (kind === 'projects' ? window.CONTENT_INDEX.projects : window.CONTENT_INDEX.posts)) || [];
    return Array.isArray(idx) ? idx : [];
  }

  function computeLink(item, type) {
    // Only use explicit card-level links; hero.image link should not affect cards
    const direct = item.link || item.externalUrl;
    if (direct) {
      return { href: direct, external: /^https?:\/\//.test(direct) };
    }
    const slug = item.slug || (item.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (slug) return { href: `/${type}.html?slug=${encodeURIComponent(slug)}`, external: false };
    const fallback = item.url || "";
    if (fallback) return { href: fallback, external: /^https?:\/\//.test(fallback) };
    return { href: "#", external: false };
  }

  function slugify(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function renderProjects(items, rootSel) {
    const grid = document.querySelector(rootSel || ".project-grid");
    if (!grid || !Array.isArray(items)) return;
    grid.innerHTML = "";
    items.forEach((p) => {
      const article = document.createElement("article");
      article.className = "project-card";
      const link = document.createElement("a");
      link.className = "project-link";
      const { href: projHref, external: projExternal } = computeLink(p, 'project');
      link.href = projHref;
      if (projExternal) { link.target = "_blank"; link.rel = "noopener"; }

      const media = document.createElement("div");
      media.className = "project-media";
      const cover = p.cover || p.coverImage || p.image;
      if (cover) {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = p.coverAlt || p.alt || p.title || "Project image";
        img.src = toAbs(cover);
        media.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "project-body";
      const h3 = document.createElement("h3");
      h3.className = "project-title";
      h3.textContent = p.title || "Untitled";
      const desc = document.createElement("p");
      desc.className = "project-desc";
      desc.textContent = p.description || "";

      // Tags (project-specific styling)
      const meta = document.createElement("div");
      meta.className = "project-meta";
      (p.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "project-tag";
        span.textContent = t;
        meta.appendChild(span);
      });

      // Keep tags first, then title, then description
      body.appendChild(meta);
      body.appendChild(h3);
      body.appendChild(desc);

      link.appendChild(media);
      link.appendChild(body);
      article.appendChild(link);

      article.style.opacity = "0";
      article.style.transform = "translateY(16px)";
      article.style.transition = "all 0.5s ease";
      observer.observe(article);

      grid.appendChild(article);
    });
  }

  function renderPosts(items, rootSel) {
    const list = document.querySelector(rootSel || ".post-list");
    if (!list || !Array.isArray(items)) return;
    list.innerHTML = "";
    items.forEach((p) => {
      const article = document.createElement("article");
      article.className = "post-card";
      const link = document.createElement("a");
      link.className = "post-link";
      const { href: postHref, external: postExternal } = computeLink(p, 'post');
      link.href = postHref;
      if (postExternal) { link.target = "_blank"; link.rel = "noopener"; }

      // Optional cover image (match detail hero `image`)
      if (p.image) {
        const media = document.createElement("div");
        media.className = "post-media";
        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = p.alt || p.title || "Post image";
        img.src = toAbs(p.image);
        img.onerror = () => img.remove();
        media.appendChild(img);
        link.appendChild(media);
      }

      const header = document.createElement("header");
      header.className = "post-header";
      const h3 = document.createElement("h3");
      h3.className = "post-title";
      h3.textContent = p.title || "Untitled";
      const time = document.createElement("time");
      time.className = "post-date";
      if (p.date) time.setAttribute("datetime", p.date);
      time.textContent = p.datePretty || p.date || "";
      header.appendChild(h3);
      header.appendChild(time);

      const excerpt = document.createElement("p");
      excerpt.className = "post-excerpt";
      excerpt.textContent = p.excerpt || "";

      const tags = document.createElement("div");
      tags.className = "post-tags";
      (p.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "post-tag";
        span.textContent = t;
        tags.appendChild(span);
      });

      link.appendChild(header);
      link.appendChild(excerpt);
      link.appendChild(tags);
      article.appendChild(link);

      article.style.opacity = "0";
      article.style.transform = "translateY(16px)";
      article.style.transition = "all 0.5s ease";
      observer.observe(article);

      list.appendChild(article);
    });
  }

  (function () {
    if (document.getElementById("all-projects") || document.querySelector(".project-grid")) {
      const projects = getIndex('projects');
      if (projects) renderProjects(projects, "#all-projects");
    }
    if (document.getElementById("all-posts") || document.querySelector(".post-list")) {
      const posts = getIndex('posts');
      if (posts) renderPosts(posts, "#all-posts");
    }
  })();
});
