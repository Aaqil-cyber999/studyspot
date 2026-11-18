"use client";

import { useEffect } from "react";

const SESSION_KEY = "spotwise:address-bar-collapsed";

/**
 * Chrome for Android collapses the address bar to a thinner strip once the
 * page has been scrolled past the threshold. We nudge it on the first load
 * of the session so the user sees the mobile chrome collapse to the compact
 * bar automatically. On iOS (no auto-collapse JS API), this is a no-op.
 *
 * In an installed PWA (display-mode: standalone) no browser chrome exists;
 * we do nothing there to avoid jarring the user.
 */
export function AddressBarHide() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Standalone (installed) PWA — nothing to hide.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).standalone === true;
    if (standalone) return;

    // Only on phones/tablets; desktop browsers are not expected to collapse.
    const isMobile = window.matchMedia?.("(max-width: 768px)").matches;
    if (!isMobile) return;

    // Only once per session.
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Best-effort.
    }

    // Give the layout paint + fonts a beat to settle, then nudge 1px.
    const id = window.setTimeout(() => {
      try {
        window.scrollTo({ top: 1, behavior: "auto" });
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 1);
      }
    }, 120);

    return () => window.clearTimeout(id);
  }, []);

  return null;
}
