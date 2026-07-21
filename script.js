document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const stored = localStorage.getItem("theme");
if (stored) {
  root.setAttribute("data-theme", stored);
  toggle.textContent = stored === "dark" ? "☀️" : "🌙";
}

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  toggle.textContent = next === "dark" ? "☀️" : "🌙";
});
