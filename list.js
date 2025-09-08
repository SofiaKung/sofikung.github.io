// Listing renderer for all posts/projects pages
document.addEventListener("DOMContentLoaded", () => {
  // Set active nav based on listing page
  const path = (location.pathname || "").split("/").pop();
  if (path === "posts.html") {
    const link = document.querySelector('.nav-links a[href="posts.html"]');
    if (link) link.classList.add("active");
  } else if (path === "projects.html") {
    const link = document.querySelector('.nav-links a[href="projects.html"]');
    if (link) link.classList.add("active");
  }
  // Mobile nav toggle (shared with other pages)
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksEl = document.getElementById("primary-nav");
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Failed to load", path, e);
      return null;
    }
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
      const slug = p.slug || slugify(p.title);
      link.href = slug ? `project.html?slug=${encodeURIComponent(slug)}` : (p.url || "#");

      const media = document.createElement("div");
      media.className = "project-media";
      if (p.image) {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = p.alt || p.title || "Project image";
        img.src = p.image;
        media.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "project-body";
      const meta = document.createElement("div");
      meta.className = "project-meta";
      (p.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "project-tag";
        span.textContent = t;
        meta.appendChild(span);
      });
      const h3 = document.createElement("h3");
      h3.className = "project-title";
      h3.textContent = p.title || "Untitled";
      const desc = document.createElement("p");
      desc.className = "project-desc";
      desc.textContent = p.description || "";

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
      const slug = p.slug || slugify(p.title);
      link.href = slug ? `post.html?slug=${encodeURIComponent(slug)}` : (p.url || "#");

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

  (async () => {
    if (document.getElementById("all-projects") || document.querySelector(".project-grid")) {
      const projects = await fetchJSON("data/projects.json");
      if (projects) renderProjects(projects, "#all-projects");
    }
    if (document.getElementById("all-posts") || document.querySelector(".post-list")) {
      const posts = await fetchJSON("data/posts.json");
      if (posts) renderPosts(posts, "#all-posts");
    }
  })();
});
