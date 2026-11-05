import { create } from "zustand";

interface UniversityAdminThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useUniversityAdminThemeStore = create<UniversityAdminThemeState>((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
