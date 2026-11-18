/**
 * theme-toggle.rdsx.dev "circle blur, top-left" theme transition.
 *
 * Implementation note: the View Transitions API was tried and proved flaky —
 * Chrome renders the transition but the reveal animation silently no-ops in
 * some installs, leaving an instant swap with no animation at all. This
 * version uses a hand-rolled overlay wipe instead: universally supported,
 * one code path, deterministic behavior.
 *
 * The overlay is an opaque cover in the NEW theme's page color. We paint it
 * BEFORE flipping the theme so the swap happens entirely underneath it —
 * then the cover sweeps away with a clip-path circle shrinking into the
 * top-left corner, revealing the already-flipped UI from that corner. A
 * backdrop blur matches the "circle blur" feel. Reduced-motion users get an
 * instant swap.
 */
export function flipThemeWithCircleBlurTopLeft(apply: () => void) {
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
  const radius = Math.hypot(window.innerWidth, window.innerHeight);

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  // Start with the clip-path covering the whole screen.
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "pointer-events:none",
    `background:${bg}`,
    "backdrop-filter:blur(14px)",
    "-webkit-backdrop-filter:blur(14px)",
    `clip-path:circle(${radius}px at 0px 0px)`,
    "transition:clip-path 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
  ].join(";");
  document.body.appendChild(overlay);

  // Flip while the cover is up — the color change happens entirely behind it.
  apply();

  // Shrink the cover into the top-left corner, revealing the new UI.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.clipPath = "circle(0px at 0px 0px)";
      overlay.style.opacity = "0.25";
    });
  });

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    overlay.style.opacity = "0";
    window.setTimeout(() => overlay.remove(), 260);
  };
  overlay.addEventListener(
    "transitionend",
    (event) => {
      if (event.propertyName === "clip-path") finish();
    },
  );
  // Safety net in case transitionend doesn't fire (tab hidden, etc.).
  window.setTimeout(finish, 1200);
}
