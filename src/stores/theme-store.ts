import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * App-wide light/dark preference shared by the student and university-admin
 * shells. The value is applied as `data-admin-theme` and every visual override
 * lives in `src/app/globals.css`.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
