// Simple portfolio script for smooth scrolling and interactivity

document.addEventListener("DOMContentLoaded", function () {
  // Normalize relative asset paths to root-absolute so they work on nested routes
  function toAbs(path) {
    if (!path) return path;
    if (/^(?:https?:)?\/\//.test(path)) return path; // http(s) or protocol-relative
    if (path.startsWith("/")) return path; // already absolute
    return "/" + path.replace(/^\/+/, "");
  }
  // Helper to (re)bind nav interactions once nav exists
  function bindNavInteractions() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
      // Avoid duplicate handlers
      link.__boundScroll = link.__boundScroll || false;
      if (link.__boundScroll) return;
      link.__boundScroll = true;
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href") || "";
        // Support "#id", "index.html#id" and "/#id" when on the homepage
        const onHome = /^(?:\/?|\/index\.html)$/.test(location.pathname);
        const hashOnly = href.startsWith("#");
        const homeHashIdx = onHome && href.startsWith("index.html#");
        const homeHashRoot = onHome && href.startsWith("/#");
        if (!hashOnly && !homeHashIdx && !homeHashRoot) return;
        e.preventDefault();
        const targetSelector = hashOnly ? href : href.replace(/^(?:index\.html|\/)/, "");
        const targetSection = document.querySelector(targetSelector);
        if (targetSection) {
          const navHeight = (document.querySelector(".navbar")?.offsetHeight) || 0;
          const targetPosition = targetSection.offsetTop - navHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      });
    });

    // Mobile nav toggle
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksEl = document.getElementById("primary-nav");
    if (navToggle && navLinksEl && !navToggle.__boundToggle) {
      navToggle.__boundToggle = true;
      navToggle.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
      // Close menu when a nav link is clicked
      navLinksEl.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          document.body.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        })
      );
    }
  }

  // Add active state to navigation based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navHeight = (document.querySelector(".navbar")?.offsetHeight) || 0;
    const scrollPos = window.scrollY + navHeight + 50;
    const navLinks = document.querySelectorAll(".nav-links a");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));
        // Add active class to current link (match href="#id", "index.html#id" and "/#id")
        const idSel = `a[href="#${sectionId}"]`;
        const homeSel = `a[href="index.html#${sectionId}"]`;
        const rootSel = `a[href="/#${sectionId}"]`;
        const candidate = document.querySelector(idSel) || document.querySelector(homeSel) || document.querySelector(rootSel);
        if (candidate) candidate.classList.add("active");
      }
    });
  }

  // Listen for scroll events
  window.addEventListener("scroll", updateActiveNavLink, { passive: true });

  // Initial call to set active state
  updateActiveNavLink();

  // Initial bind (in case nav is already present)
  bindNavInteractions();
  // Re-bind after nav partial is injected
  window.addEventListener("nav-injected", () => {
    bindNavInteractions();
    updateActiveNavLink();
  });

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (!navbar) return; // no nav yet
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down & past hero
      if (navbar) navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      if (navbar) navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  // Add entrance animations for experience items
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe experience items for animation
  const experienceItems = document.querySelectorAll(".experience-item");
  experienceItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "all 0.6s ease";
    observer.observe(item);
  });

  // Observe skill categories for animation
  const skillCategories = document.querySelectorAll(".skill-category");
  skillCategories.forEach((category) => {
    category.style.opacity = "0";
    category.style.transform = "translateY(20px)";
    category.style.transition = "all 0.6s ease";
    observer.observe(category);
  });

  // Observe project and post cards for entrance animation
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = "all 0.5s ease";
    observer.observe(card);
  });

  const postCards = document.querySelectorAll(".post-card");
  postCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = "all 0.5s ease";
    observer.observe(card);
  });

  // Content index comes from /content/manifest.js (global window.CONTENT_INDEX)

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

  function renderProjects(items) {
    const grid = document.querySelector(".project-grid");
    if (!grid || !Array.isArray(items)) return;
    grid.innerHTML = "";
    items.forEach((p) => {
      const article = document.createElement("article");
      article.className = "project-card";
      const link = document.createElement("a");
      link.className = "project-link";
      const { href: projHref, external: projExternal } = computeLink(p, 'project');
      link.href = projHref;
      if (projExternal) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      link.setAttribute("aria-label", `View project: ${p.title || "Project"}`);

      const media = document.createElement("div");
      media.className = "project-media";
      const cover = p.cover || p.coverImage || p.image;
      if (cover) {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = p.coverAlt || p.alt || p.title || "Project image";
        img.src = toAbs(cover);
        img.onerror = () => {
          img.remove();
        };
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

      // animate on scroll
      article.style.opacity = "0";
      article.style.transform = "translateY(16px)";
      article.style.transition = "all 0.5s ease";
      observer.observe(article);

      grid.appendChild(article);
    });
  }

  function renderPosts(items) {
    const list = document.querySelector(".post-list");
    if (!list || !Array.isArray(items)) return;
    list.innerHTML = "";
    items.forEach((p) => {
      const article = document.createElement("article");
      article.className = "post-card";
      const link = document.createElement("a");
      link.className = "post-link";
      const { href: postHref, external: postExternal } = computeLink(p, 'post');
      link.href = postHref;
      if (postExternal) {
        link.target = "_blank";
        link.rel = "noopener";
      }

      // Optional cover image (use same `image` field as detail hero)
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

      // animate on scroll
      article.style.opacity = "0";
      article.style.transform = "translateY(16px)";
      article.style.transition = "all 0.5s ease";
      observer.observe(article);

      list.appendChild(article);
    });
  }

  (function () {
    const idx = (window.CONTENT_INDEX || {});
    const projects = Array.isArray(idx.projects) ? idx.projects : [];
    const posts = Array.isArray(idx.posts) ? idx.posts : [];
    if (projects.length) renderProjects(projects);
    if (posts.length) renderPosts(posts);
  })();

  // Hero toggle: Data Analyst vs Risk Analytics
  const blurb = document.getElementById("hero-blurb");
  const seg = document.getElementById("profile-toggle");
  const toggleButtons = document.querySelectorAll(
    ".segmented-toggle .seg-item"
  );
  // Sentence rotator content (short sentences per mode)
  const copy = {
    data: [
      "I’m a senior data analyst with 6+ years of experience across crypto, tech, e-commerce and consulting.",
      //   "I specialize in dashboard development, statistical analysis, and metrics design—helping teams make smarter, faster, and more impactful decisions.",
      "Proven track record in designing intuitive, visually compelling dashboards, building scalable fraud prevention systems, streamlining operational workflows, and driving data-informed decisions that deliver measurable business impact.",
    ],
    risk: [
      "I specialize in connecting data analytics with risk strategy to help companies fight fraud at scale.",
      "At Binance, Gojek, and Lazada, I’ve designed fraud detection systems, developed dashboards that reveal hidden fraud patterns, and created risk frameworks that saved six figures annually.",
      "I’m driven by leading teams to strike the right balance between growth and trust & safety—delivering solutions where user experience, risk, and innovation align.",
    ],
  };

  let mode = "data";
  let idx = 0;
  let timerId = null;

  function render() {
    // fade out, swap text, fade in
    blurb.classList.add("fade-out");
    setTimeout(() => {
      blurb.textContent = (copy[mode] && copy[mode][idx]) || copy.data[0];
      blurb.classList.remove("fade-out");
      blurb.classList.add("fade-in");
      setTimeout(() => blurb.classList.remove("fade-in"), 220);
    }, 180);
  }

  function nextSentence() {
    const list = copy[mode] || copy.data;
    idx = (idx + 1) % list.length;
    render();
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(nextSentence, 6000);
  }
  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  // Hook up toggle
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      mode = btn.getAttribute("data-mode") || "data";
      idx = 0;
      render();
      seg.classList.toggle("mode-risk", mode === "risk");
      seg.classList.toggle("mode-data", mode !== "risk");
      startTimer();
    });
  });

  // Pause on hover/focus of blurb
  [blurb].forEach((el) => {
    if (!el) return;
    el.addEventListener("mouseenter", stopTimer);
    el.addEventListener("mouseleave", startTimer);
    el.addEventListener("focus", stopTimer);
    el.addEventListener("blur", startTimer);
  });

  // Initial render
  render();
  startTimer();

  // Photo deck drag/swipe
  const deck = document.getElementById("photo-deck");
  const againBtn = document.getElementById("deck-again");
  let initialPhotos = [];
  function layoutDeck() {
    if (!deck) return;
    const cards = Array.from(deck.querySelectorAll(".deck-card"));
    cards.forEach((c) => c.classList.remove("top"));
    if (cards[0]) cards[0].classList.add("top");
  }
  layoutDeck();

  if (deck) {
    // Capture initial images so we can restore the deck
    initialPhotos = Array.from(deck.querySelectorAll("img")).map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "Photo",
    }));

    function showAgainButtonIfEmpty() {
      if (!deck.querySelector(".deck-card")) {
        if (againBtn) againBtn.hidden = false;
      }
    }

    function restoreDeck() {
      if (!deck) return;
      deck.innerHTML = "";
      initialPhotos.forEach((p) => {
        const card = document.createElement("div");
        card.className = "deck-card";
        const img = document.createElement("img");
        img.src = p.src;
        img.alt = p.alt;
        img.loading = "lazy";
        img.setAttribute("draggable", "false");
        card.appendChild(img);
        deck.appendChild(card);
      });
      // Keep Again button always present behind the deck
      layoutDeck();
    }

    if (againBtn) {
      againBtn.addEventListener("click", restoreDeck);
    }
    let startX = 0,
      startY = 0,
      dx = 0,
      dy = 0,
      dragging = false,
      topCard = null,
      activePointerId = null;
    // Prevent native image drag ghosting which can block first drag
    deck.addEventListener("dragstart", (ev) => ev.preventDefault());
    // Ensure images are not draggable by the browser
    deck.querySelectorAll("img").forEach((img) => img.setAttribute("draggable", "false"));

    function onPointerDown(e) {
      topCard = deck.querySelector(".deck-card.top");
      if (!topCard) return;
      // Prevent default to avoid initiating native drag/image behaviors
      e.preventDefault();
      dragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      dx = 0;
      dy = 0;
      activePointerId = e.pointerId != null ? e.pointerId : null;
      try {
        if (activePointerId != null && topCard.setPointerCapture) {
          topCard.setPointerCapture(activePointerId);
        }
      } catch (_) {}
      topCard.style.transition = "none";
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerup", onPointerUp, { once: true });
      document.addEventListener("pointercancel", onPointerUp, { once: true });
    }
    function onPointerMove(e) {
      if (!dragging || !topCard) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || startX;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || startY;
      dx = x - startX;
      dy = (y - startY) * 0.3; // damped vertical movement
      const w = deck.clientWidth;
      const p = Math.max(-1, Math.min(1, dx / (w * 0.6)));
      const rot = p * 12;
      const opacity = 1 - Math.min(1, Math.abs(p)) * 0.7;
      topCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      topCard.style.opacity = String(opacity);
    }
    function onPointerUp() {
      if (!topCard) return;
      dragging = false;
      try {
        if (activePointerId != null && topCard && topCard.releasePointerCapture) {
          topCard.releasePointerCapture(activePointerId);
        }
      } catch (_) {}
      const rect = topCard.getBoundingClientRect();
      const cardW = rect.width;
      const w = deck.clientWidth;
      const threshold = Math.min(120, cardW * 0.25);
      const shouldDismiss = Math.abs(dx) > threshold;
      const spring = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      topCard.style.transition = `transform .25s ${spring}, opacity .25s ease`;
      if (shouldDismiss) {
        const dir = Math.sign(dx) || 1;
        const y = dy;
        topCard.style.transform = `translate(${
          dir * w * 1.2
        }px, ${y}px) rotate(${dir * 30}deg)`;
        topCard.style.opacity = "0";
        topCard.addEventListener(
          "transitionend",
          () => {
            // Remove card instead of recycling, then hide deck if empty
            if (topCard && topCard.parentElement === deck) {
              topCard.remove();
            }
            topCard = null;
            layoutDeck();
            showAgainButtonIfEmpty();
          },
          { once: true }
        );
      } else {
        topCard.style.transform = "translate(0,0) rotate(0deg)";
        topCard.style.opacity = "1";
        topCard.addEventListener(
          "transitionend",
          () => {
            topCard.style.transition = "none";
          },
          { once: true }
        );
      }
      dx = 0;
      dy = 0;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    }
    deck.addEventListener("pointerdown", onPointerDown);
  }
});
