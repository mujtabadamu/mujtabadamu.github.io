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

/* ---------- Project cards: sequential 3D "pull in" ---------- */

const cardsContainer = document.querySelector(".cards");

if (cardsContainer) {
  const cardEls = Array.from(cardsContainer.querySelectorAll(".card-3d"));

  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cardEls.forEach((card, i) => {
            setTimeout(() => card.classList.add("is-visible"), i * 450);
          });
          cardsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );

  cardsObserver.observe(cardsContainer);
}

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
  const spotlight = document.querySelector(".cursor-spotlight");
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
    spotlight.style.setProperty("--sx", mouseX + "px");
    spotlight.style.setProperty("--sy", mouseY + "px");
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

/* ---------- Particle constellation (hero) ---------- */

(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");
  let particles = [];
  let width, height;
  let pointer = { x: null, y: null };
  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark" ||
    (!document.documentElement.hasAttribute("data-theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.round((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    const dotColor = isDark() ? "129, 140, 248" : "79, 70, 229";
    const lineColor = isDark() ? "129, 140, 248" : "79, 70, 229";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (pointer.x !== null) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, 0.6)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${0.18 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });
  hero.addEventListener("mouseleave", () => {
    pointer.x = null;
    pointer.y = null;
  });

  window.addEventListener("resize", resize);
  resize();
  step();
})();

/* ---------- Animated stat counters ---------- */

(function initStatCounters() {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const duration = 1400;

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(tick);
    }
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => statObserver.observe(stat));
})();

/* ---------- 3D tilt on project cards ---------- */

if (!prefersReducedMotion && isFinePointer) {
  document.querySelectorAll(".card.spotlight").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("tilting");
      card.style.setProperty("--ty", "-4px");
    });
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--ry", `${px * 10}deg`);
      card.style.setProperty("--rx", `${py * -10}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--ty", "0px");
    });
  });
}
