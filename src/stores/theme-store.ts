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
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const isDark = !state.isDark;
          stampBody(isDark);
          return { isDark };
        }),
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
