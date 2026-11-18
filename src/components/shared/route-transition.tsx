"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

const LAST_ROUTE_KEY = "spotwise:lastRoute";
const PREVIOUS_ROUTE_KEY = "spotwise:previousRoute";

/**
 * Wraps each screen's content (not the layout's chrome) so navigations play
 * an Android-style transition. Untyped transitions slide forward from the
 * right; transitions tagged `nav-back` slide in from the left instead.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const last = window.sessionStorage.getItem(LAST_ROUTE_KEY);
      if (last && last !== pathname) {
        window.sessionStorage.setItem(PREVIOUS_ROUTE_KEY, last);
      }
      window.sessionStorage.setItem(LAST_ROUTE_KEY, pathname);
      prevRef.current = last ?? null;
    } catch {
      // Best-effort; session storage may be unavailable.
    }
  }, [pathname]);

  return (
    <ViewTransition
      key={pathname}
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "nav-forward",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "nav-forward",
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
