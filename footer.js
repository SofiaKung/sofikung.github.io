// Injects shared footer HTML into #site-footer and notifies other scripts
document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  try {
    const res = await fetch("/partials/footer.html", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    mount.innerHTML = html;
  } catch (e) {
    console.warn("Failed to load footer partial", e);
  }
  // Signal to other scripts that footer exists now
  window.dispatchEvent(new Event("footer-injected"));
});

