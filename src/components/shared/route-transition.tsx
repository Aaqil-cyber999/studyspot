"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

const LAST_ROUTE_KEY = "spotwise:lastRoute";
const PREVIOUS_ROUTE_KEY = "spotwise:previousRoute";

/**
 * Wraps each screen's content (not the layout's chrome) so navigations play
 * an Android-style transition. Explicit `nav-forward`/`nav-back` transitionTypes
 * on `<Link>`/router calls slide that way. Bare `ViewTransition` mounts
 * animate in from the right. `popstate` events (browser back / swipe-back)
 * are listened to separately here and tagged as `nav-back`.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Direction of the current navigation; "history" means it came from the
  // browser's back button or a swipe gesture.
  const [direction, setDirection] = useState<"nav-forward" | "nav-back" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persistLast = () => {
      try {
        const last = window.sessionStorage.getItem(LAST_ROUTE_KEY);
        if (last && last !== pathname) {
          window.sessionStorage.setItem(PREVIOUS_ROUTE_KEY, last);
        }
        window.sessionStorage.setItem(LAST_ROUTE_KEY, pathname);
      } catch {
        // Best-effort.
      }
    };
    persistLast();

    // Any popstate event fired by browser back / swipe-back is treated as a
    // backward navigation and tagged so the view-transition slides from the left.
    const onPopState = () => setDirection("nav-back");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pathname]);

  // Reset direction reference once it has been consumed by the current transition.
  useEffect(() => {
    if (!direction) return;
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!cancelled) setDirection(null);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [direction]);

  return (
    <ViewTransition
      key={pathname}
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: direction ?? "nav-forward",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: direction ?? "nav-forward",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/** Returns the pathname visited just before the current route (best-effort). */
export function popPreviousRoute(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(PREVIOUS_ROUTE_KEY);
  } catch {
    return null;
  }
}
