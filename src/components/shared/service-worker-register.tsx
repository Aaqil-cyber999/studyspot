"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js so the PWA can go offline and the browser can show the
 * install prompt. next-pwa's auto-injection doesn't reach the App Router
 * entry, so we do it explicitly here.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const swPath = "/sw.js";

    navigator.serviceWorker
      .register(swPath, { scope: "/" })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });

    const onControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return null;
}
