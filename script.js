document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Theme toggle ---------- */

const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  root.setAttribute("data-theme", storedTheme);
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

/* ---------- Mobile menu ---------- */

const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

navToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Sticky nav shrink + scroll progress ---------- */

const siteNav = document.getElementById("site-nav");
const progressFill = document.getElementById("progress-fill");

function onScroll() {
  siteNav.classList.toggle("scrolled", window.scrollY > 20);

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressFill.style.width = pct + "%";
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Scrollspy ---------- */

const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => spy.observe(section));

/* ---------- Reveal on scroll ---------- */

const revealTargets = document.querySelectorAll(".reveal, .timeline li, .skills-list");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

/* ---------- Timeline progress line ---------- */

const timelineList = document.querySelector(".timeline");
const timelineProgress = document.getElementById("timeline-progress");

function updateTimelineProgress() {
  if (!timelineList || !timelineProgress) return;
  const rect = timelineList.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const start = viewportH * 0.85;
  const total = rect.height;
  const visible = Math.min(Math.max(start - rect.top, 0), total);
  const pct = total > 0 ? (visible / total) * 100 : 0;
  timelineProgress.style.height = pct + "%";
}

window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);
updateTimelineProgress();

/* ---------- Card spotlight ---------- */

document.querySelectorAll(".card.spotlight").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - rect.left + "px");
    card.style.setProperty("--my", e.clientY - rect.top + "px");
  });
});

/* ---------- Reduced motion / touch guards ---------- */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Magnetic buttons ---------- */

if (!prefersReducedMotion && isFinePointer) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
}

/* ---------- Custom cursor ---------- */

if (!prefersReducedMotion && isFinePointer) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
    document.body.classList.add("cursor-ready");
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}
