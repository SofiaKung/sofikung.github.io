// Injects shared navbar HTML into #site-nav and notifies other scripts
document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("site-nav");
  if (!mount) return;
  try {
    const res = await fetch("partials/nav.html", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    mount.innerHTML = html;
  } catch (e) {
    console.warn("Failed to load nav partial", e);
  }
  // Signal to other scripts that nav exists now
  window.dispatchEvent(new Event("nav-injected"));
});

