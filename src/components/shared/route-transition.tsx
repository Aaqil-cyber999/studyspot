"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * Wrap each screen's content (not the layout's chrome) so navigations play
 * a directional slide animation. Android-style. Remount keyed by pathname so
 * the enter/exit animations fire on every route change.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="route-enter" exit="route-exit" default="none">
      {children}
    </ViewTransition>
  );
}
