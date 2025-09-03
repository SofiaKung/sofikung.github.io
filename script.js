// Simple portfolio script for smooth scrolling and interactivity

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Add active state to navigation based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navHeight = document.querySelector(".navbar").offsetHeight;
    const scrollPos = window.scrollY + navHeight + 50;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const correspondingLink = document.querySelector(
        `a[href="#${sectionId}"]`
      );

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));
        // Add active class to current link
        if (correspondingLink) {
          correspondingLink.classList.add("active");
        }
      }
    });
  }

  // Listen for scroll events
  window.addEventListener("scroll", updateActiveNavLink);

  // Initial call to set active state
  updateActiveNavLink();

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksEl = document.getElementById("primary-nav");
  if (navToggle && navLinksEl) {
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

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down & past hero
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)";
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
});

// Add CSS for active nav state
const style = document.createElement("style");
style.textContent = `
    .nav-links a.active {
        color: #2563eb;
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 2px;
        background: #2563eb;
    }
    
    .navbar {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);
