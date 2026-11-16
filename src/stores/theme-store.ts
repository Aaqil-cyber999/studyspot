import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * App-wide light/dark preference shared by the student and university-admin
 * shells. The value is applied as `data-admin-theme` and every visual override
 * lives in `src/app/globals.css`. The toggle also stamps it on <body> so the
 * outer margins (left/right of the centered student column) color correctly —
 * that region sits outside the themed shell and needs its own hook.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const isDark = !state.isDark;
      if (typeof document !== "undefined") {
        document.body.dataset.adminTheme = isDark ? "dark" : "light";
      }
      return { isDark };
    }),
}));
