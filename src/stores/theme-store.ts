import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

function stampBody(isDark: boolean) {
  if (typeof document !== "undefined") {
    document.body.dataset.adminTheme = isDark ? "dark" : "light";
  }
}

/**
 * App-wide light/dark preference shared by the student, university-admin and
 * super-admin shells. The value is applied as `data-admin-theme` and every
 * visual override lives in `src/app/globals.css`. The toggle also stamps it on
 * <body> so the outer margins (left/right of the centered student column)
 * color correctly — that region sits outside the themed shell and needs its
 * own hook. The preference is persisted to localStorage ("spotwise-theme")
 * and restored on reload; the <body> attribute is re-applied on rehydrate so
 * the margins come up in the right theme too.
 */
// `document.startViewTransition` is not yet in every TS DOM lib version, so
// describe it loosely; the runtime feature-detect below is the real guard.
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => void;
};

function applyTheme(set: (fn: (state: ThemeState) => Partial<ThemeState>) => void) {
  set((state) => {
    const isDark = !state.isDark;
    stampBody(isDark);
    return { isDark };
  });
}

/**
 * Flip light/dark with the theme-toggle.rdsx.dev "circle blur, top-left"
 * animation: the new theme is revealed by a clip-path circle expanding from
 * the top-left corner while it de-blurs. Falls back to an instant swap when
 * the View Transitions API is unavailable or the user prefers reduced motion.
 */
function toggleThemeWithTransition(set: (fn: (state: ThemeState) => Partial<ThemeState>) => void) {
  const apply = () => applyTheme(set);

  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    apply();
    return;
  }

  const doc = document as DocumentWithViewTransition;
  if (typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }

  doc.startViewTransition(apply);

  const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
  document.documentElement.animate(
    [
      { clipPath: "circle(0px at 0px 0px)", filter: "blur(12px)" },
      { clipPath: `circle(${maxRadius}px at 0px 0px)`, filter: "blur(0px)" },
    ],
    {
      duration: 750,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      pseudoElement: "::view-transition-new(root)",
    } as KeyframeAnimationOptions,
  );
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => toggleThemeWithTransition(set),
    }),
    {
      name: "spotwise-theme",
      partialize: (state) => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state) => {
        if (state) stampBody(state.isDark);
      },
    },
  ),
);
