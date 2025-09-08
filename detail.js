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

  const titleEl = qs("#article-title");
  const dateEl = qs("#article-date");
  const tagsEl = qs("#article-tags");
  const heroEl = qs("#article-hero");
  const contentEl = qs("#article-content");

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

    // Hero image (if available)
    if (heroEl && item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt || item.title || "";
      img.loading = "lazy";
      heroEl.appendChild(img);
      heroEl.hidden = false;
    }

    // Body content: try content file first, else fall back to excerpt/description
    const contentPath = `content/${type}s/${slug}.html`;
    const html = await fetchContentHTML(contentPath);
    if (html) {
      contentEl.innerHTML = html;
    } else if (type === "post") {
      contentEl.innerHTML = `<p>${item.excerpt || ""}</p>`;
    } else {
      contentEl.innerHTML = `<p>${item.description || ""}</p>`;
    }
  })();
})();

