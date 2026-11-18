/**
 * Simple fade theme transition.
 *
 * An opaque fixed overlay in the NEW theme's page color is painted, the
 * theme flips behind it, then the overlay fades out — a quick cross-fade
 * instead of a wipe. Reduced-motion users get an instant swap.
 */
export function flipThemeWithFade(apply: () => void) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    apply();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }

  const nextIsDark = !(document.body.dataset.adminTheme === "dark");
  const bg = nextIsDark ? "#0b1120" : "#e2e8f0";

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "pointer-events:none",
    `background:${bg}`,
    "opacity:1",
    "transition:opacity 0.22s ease-in-out",
  ].join(";");
  document.body.appendChild(overlay);

  // Flip while the overlay is up so the swap is invisible underneath it.
  apply();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity = "0";
    });
  });

  window.setTimeout(() => overlay.remove(), 300);
}
