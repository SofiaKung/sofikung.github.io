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
  // No JSON data fetch; all metadata comes from Markdown front matter
  async function fetchContentHTML(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (_) {
      return null;
    }
  }

  function extractFrontMatter(md) {
    if (!md) return { frontmatter: null, body: "" };
    const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) return { frontmatter: null, body: md };
    return { frontmatter: m[1], body: md.slice(m[0].length) };
  }

  function stripFrontMatter(md) {
    const { body } = extractFrontMatter(md);
    return { body };
  }

  function bodyHasContent(mdBody) {
    if (!mdBody) return false;
    // Remove HTML comments and trim
    const cleaned = mdBody.replace(/<!--[\s\S]*?-->/g, "").trim();
    return cleaned.length > 0;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function inlineFormat(text) {
    const raw = String(text || "");
    const linkPlaceholders = [];
    function safeAttr(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    // Replace explicit Markdown links with placeholders first, supporting optional title
    const withMdLinks = raw.replace(/\[([^\]]+)\]\((\S+?)(?:\s+("[^"]*"|'[^']*'))?\)/g, (m, label, href, titleQuoted) => {
      const urlRaw = href.trim();
      const url = /^www\./i.test(urlRaw) ? `http://${urlRaw}` : urlRaw;
      const title = titleQuoted ? titleQuoted.slice(1, -1) : "";
      const isExternal = /^https?:\/\//i.test(url);
      const attrs = [];
      attrs.push(`href="${safeAttr(url)}"`);
      if (title) attrs.push(`title="${safeAttr(title)}"`);
      if (isExternal) attrs.push('target="_blank" rel="noopener"');
      const html = `<a ${attrs.join(' ')}>${escapeHtml(label)}</a>`;
      const idx = linkPlaceholders.push(html) - 1;
      return `@@LINK_${idx}@@`;
    });
    // Escape everything else
    let escaped = escapeHtml(withMdLinks);
    // Auto-link bare URLs in the escaped text
    escaped = escaped.replace(/(https?:\/\/[^\s<]+|www\.[^\s<]+\.[^\s<]+)/g, (m) => {
      let display = m;
      let url = m.startsWith('http') ? m : `http://${m}`;
      let suffix = '';
      while(/[.,);:!?]$/.test(url)) { suffix = url.slice(-1) + suffix; url = url.slice(0, -1); display = display.slice(0, -1); }
      const openCount = (url.match(/\(/g) || []).length;
      const closeCount = (url.match(/\)/g) || []).length;
      while (closeCount > openCount && url.endsWith(')')) { url = url.slice(0, -1); display = display.slice(0, -1); }
      return `<a href="${safeAttr(url)}" target=\"_blank\" rel=\"noopener\">${display}</a>${suffix}`;
    });
    // Inject placeholders back as anchors
    escaped = escaped.replace(/@@LINK_(\d+)@@/g, (_, i) => linkPlaceholders[Number(i)] || '');
    return escaped;
  }

  function mdToHtml(md) {
    if (!md) return "";
    const { body } = stripFrontMatter(md);
    if (!bodyHasContent(body)) return "";
    let text = body.replace(/\r\n/g, "\n");

    // Fenced code blocks ```
    const codeBlocks = [];
    text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
      const idx = codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`) - 1;
      return `@@CODE_BLOCK_${idx}@@`;
    });

    // Images ![alt](src)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<figure><img src="${src}" alt="${alt}"> </figure>`);

    // Headings
    const lines = text.split(/\n/);
    const out = [];
    let listBuf = [];
    function flushList() {
      if (!listBuf.length) return;
      out.push("<ul>" + listBuf.map(li => `<li>${inlineFormat(li)}</li>`).join("") + "</ul>");
      listBuf = [];
    }
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!l.trim()) { flushList(); continue; }
      const h = l.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flushList();
        const level = Math.min(6, h[1].length);
        out.push(`<h${level}>${inlineFormat(h[2].trim())}</h${level}>`);
        continue;
      }
      const li = l.match(/^\s*[-*]\s+(.*)$/);
      if (li) {
        listBuf.push(li[1]);
        continue;
      }
      // Paragraph
      flushList();
      out.push(`<p>${inlineFormat(l)}</p>`);
    }
    flushList();

    let html = out.join("\n");
    // Restore code blocks
    html = html.replace(/@@CODE_BLOCK_(\d+)@@/g, (_, idx) => codeBlocks[Number(idx)] || "");
    return html;
  }

  function parseContentBlocksFromFM(md) {
    const { frontmatter } = extractFrontMatter(md || "");
    if (!frontmatter) return [];
    const lines = frontmatter.split(/\r?\n/);
    let start = -1;
    let baseIndent = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^\s*content_blocks:\s*$/.test(l)) {
        start = i; baseIndent = (l.match(/^\s*/)[0] || '').length; break;
      }
    }
    if (start === -1) return [];
    const blocks = [];
    let i = start + 1;
    while (i < lines.length) {
      let l = lines[i];
      const indent = (l.match(/^\s*/)[0] || '').length;
      if (indent <= baseIndent && /\w/.test(l)) break; // end of section
      const itemMatch = l.match(/^\s*-\s*(.*)$/);
      if (!itemMatch) { i++; continue; }
      // Parse one item block
      const itemIndent = (l.match(/^\s*/)[0] || '').length;
      const obj = {};
      // Inline like: - type: "heading"
      const inlineKV = itemMatch[1].match(/^([A-Za-z0-9_\-\.]+):\s*(.*)$/);
      if (inlineKV) {
        obj[inlineKV[1]] = inlineKV[2].replace(/^['\"]|['\"]$/g, '');
      }
      i++;
      while (i < lines.length) {
        l = lines[i];
        const ind2 = (l.match(/^\s*/)[0] || '').length;
        if (ind2 <= itemIndent) break; // next item or end
        const mk = l.match(/^\s*([A-Za-z0-9_\-\.]+):\s*(.*)$/);
        if (mk) {
          const k = mk[1];
          let v = mk[2].trim();
          v = v.replace(/^['\"]|['\"]$/g, '');
          if (k === 'level') {
            const n = Number(v); obj[k] = isNaN(n) ? v : n;
          } else {
            obj[k] = v;
          }
        }
        i++;
      }
      // Normalize keys (type/text)
      if (obj.type && (obj.text || obj.content)) {
        blocks.push({ type: obj.type, level: obj.level, text: obj.text || obj.content });
      }
    }
    return blocks;
  }

  function parseGalleryFromFM(md) {
    const { frontmatter } = extractFrontMatter(md || "");
    if (!frontmatter) return [];
    const lines = frontmatter.split(/\r?\n/);
    // Locate 'gallery:'
    let start = -1; let baseIndent = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^\s*gallery:\s*$/.test(l)) { start = i; baseIndent = (l.match(/^\s*/)[0]||'').length; break; }
    }
    if (start === -1) return [];
    // Locate 'items:' under gallery
    let itemsLine = -1; let itemsIndent = 0;
    for (let i = start + 1; i < lines.length; i++) {
      const l = lines[i];
      const ind = (l.match(/^\s*/)[0]||'').length;
      if (ind <= baseIndent && /\w/.test(l)) break; // left gallery block
      if (/^\s*items:\s*$/.test(l)) { itemsLine = i; itemsIndent = ind; break; }
    }
    if (itemsLine === -1) return [];
    const items = [];
    let i = itemsLine + 1;
    while (i < lines.length) {
      let l = lines[i];
      const ind = (l.match(/^\s*/)[0]||'').length;
      if (ind <= baseIndent && /\w/.test(l)) break; // left gallery block
      const dash = l.match(/^\s*-\s*(.*)$/);
      if (!dash) { i++; continue; }
      const itemIndent = (l.match(/^\s*/)[0]||'').length;
      const obj = {};
      // Inline key on same line e.g. "- src: '..." (rare)
      const inlineKV = dash[1].match(/^([A-Za-z0-9_\-\.]+):\s*(.*)$/);
      if (inlineKV) {
        let v = inlineKV[2].trim();
        v = v.replace(/^['\"]|['\"]$/g, '');
        obj[inlineKV[1]] = v;
      }
      i++;
      while (i < lines.length) {
        l = lines[i];
        const ind2 = (l.match(/^\s*/)[0]||'').length;
        if (ind2 <= itemIndent) break; // next item or end
        const mk = l.match(/^\s*([A-Za-z0-9_\-\.]+):\s*(.*)$/);
        if (mk) {
          const k = mk[1];
          let v = mk[2].trim();
          v = v.replace(/^['\"]|['\"]$/g, '');
          obj[k] = v;
        }
        i++;
      }
      if (obj.src) items.push({ src: obj.src, title: obj.title, alt: obj.alt, caption: obj.caption });
    }
    return items;
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
        h.innerHTML = inlineFormat(String(b.text || b.content || ""));
        h.className = "article-subtitle";
        container.appendChild(h);
      } else if (type === "paragraph") {
        const p = document.createElement("p");
        p.innerHTML = inlineFormat(String(b.text || b.content || ""));
        container.appendChild(p);
      } else if (type === "list") {
        const items = Array.isArray(b.items) ? b.items : [];
        const ul = document.createElement(b.ordered ? "ol" : "ul");
        items.forEach((t) => {
          const li = document.createElement("li");
          li.innerHTML = inlineFormat(String(t || ""));
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else if (type === "quote") {
        const q = document.createElement("blockquote");
        const p = document.createElement("p");
        p.innerHTML = inlineFormat(String(b.text || b.content || ""));
        q.appendChild(p);
        if (b.cite) {
          const c = document.createElement("cite");
          c.innerHTML = inlineFormat(String(b.cite));
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
    // Read the Markdown file for this slug and parse metadata from front matter
    const contentPathHtml = `content/${type}s/${slug}.html`;
    const contentPathMd = `content/${type}s/${slug}.md`;
    const html = await fetchContentHTML(contentPathHtml);
    const md = await fetchContentHTML(contentPathMd);
    if (!md && !html) {
      if (contentEl) contentEl.innerHTML = "<p>Content not found.</p>";
      return;
    }
    // Minimal front matter parser for title/date/hero/tags/description
    function parseMeta(md) {
      const { frontmatter } = extractFrontMatter(md || "");
      const meta = { title: '', slug, tags: [] };
      if (!frontmatter) return meta;
      const lines = frontmatter.split(/\r?\n/);
      const stack = [{ name: 'root', indent: -1, obj: meta }];
      function ctxFor(indent) {
        while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
        return stack[stack.length - 1];
      }
      for (let raw of lines) {
        const line = raw.replace(/\t/g, '  ');
        if (!line.trim() || /^\s*#/.test(line)) continue;
        const indent = (line.match(/^\s*/)[0] || '').length;
        const ctx = ctxFor(indent);
        const at = ctx.obj;
        const arr = line.match(/^\s*-\s*(.*)$/);
        if (arr) {
          const parent = ctx.name;
          if ((parent === 'tags' || parent === 'project.tags') && Array.isArray(at)) {
            const v = arr[1].trim().replace(/^['\"]|['\"]$/g, '');
            at.push(v);
          }
          continue;
        }
        const mk = line.match(/^\s*([A-Za-z0-9_\-\.]+):\s*(.*)$/);
        if (!mk) continue;
        const key = mk[1];
        let val = mk[2].trim();
        const deq = (s) => s.replace(/^['\"]|['\"]$/g, '');
        if (val === '') {
          if (key === 'hero' || key === 'project' || key === 'seo') {
            const obj = at[key] = at[key] || {};
            stack.push({ name: key, indent, obj });
          } else if (key === 'tags') {
            const arr = at[key] = at[key] || [];
            stack.push({ name: ctx.name === 'project' ? 'project.tags' : 'tags', indent, obj: arr });
          } else {
            const obj = at[key] = at[key] || {};
            stack.push({ name: key, indent, obj });
          }
          continue;
        }
        const v = deq(val);
        if (ctx.name === 'root') {
          if (key === 'title') meta.title = v;
          else if (key === 'date') meta.date = v;
          else if (key === 'date_pretty') meta.datePretty = v;
          else if (key === 'description') meta.description = v;
          else if (key === 'type') meta.type = v;
        } else if (ctx.name === 'hero') {
          if (key === 'image') meta.image = v;
          else if (key === 'alt') meta.alt = v;
          else if (key === 'link') meta.imageLink = v;
        } else if (ctx.name === 'project') {
          if (key === 'tags') { /* handled above */ }
        } else if (ctx.name === 'tags' || ctx.name === 'project.tags') {
          // handled above
        }
      }
      // collect tags from project.tags or root tags
      if (meta.project && Array.isArray(meta.project.tags)) meta.tags = meta.project.tags;
      if (!Array.isArray(meta.tags) || !meta.tags.length) {
        if (Array.isArray(meta.tags)) meta.tags = meta.tags; // already root tags
      }
      return meta;
    }
    const item = md ? parseMeta(md) : { title: slug, slug };

    // Title
    titleEl.textContent = item.title || "Untitled";

    // Meta (date + tags)
    if (dateEl && (item.datePretty || item.date)) {
      if (item.date) dateEl.setAttribute('datetime', item.date);
      dateEl.textContent = item.datePretty || item.date;
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

    // Body content already loaded above (md/html)
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
      // Prefer gallery from Markdown front matter if available
      let galleryItems = [];
      if (md) {
        try { galleryItems = parseGalleryFromFM(md); } catch (_) { /* ignore */ }
      }
      if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
        galleryItems = Array.isArray(item.gallery) ? item.gallery : [];
      }
      if (detailsWrap && detailsGrid && Array.isArray(galleryItems) && galleryItems.length) {
        detailsGrid.innerHTML = '';
        galleryItems.forEach((g) => {
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
      const mdHtml = md ? mdToHtml(md) : "";
      if (mdHtml) {
        contentEl.innerHTML = mdHtml;
        if (writingWrap) writingWrap.hidden = false;
      } else if (md) {
        const blocks = parseContentBlocksFromFM(md);
        if (blocks && blocks.length) {
          renderBodyBlocks(blocks, contentEl);
          if (writingWrap) writingWrap.hidden = false;
        } else if (html) {
          contentEl.innerHTML = html;
          if (writingWrap) writingWrap.hidden = false;
        } else if (writingWrap) {
          writingWrap.hidden = true;
        }
      } else if (html) {
        contentEl.innerHTML = html;
        if (writingWrap) writingWrap.hidden = false;
      } else {
        // No writing provided; keep section hidden
        if (writingWrap) writingWrap.hidden = true;
      }
    } else {
      const mdHtml = md ? mdToHtml(md) : "";
      if (mdHtml) {
        contentEl.innerHTML = mdHtml;
      } else if (md) {
        const blocks = parseContentBlocksFromFM(md);
        if (blocks && blocks.length) {
          renderBodyBlocks(blocks, contentEl);
        } else if (html) {
          contentEl.innerHTML = html;
        } else if (type === "post") {
          contentEl.innerHTML = `<p>${item.excerpt || item.description || ""}</p>`;
        }
      } else if (html) {
        contentEl.innerHTML = html;
      } else if (type === "post") {
        contentEl.innerHTML = `<p>${item.excerpt || item.description || ""}</p>`;
      }
    }
  })();
})();
