import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Role = "student" | "university-admin" | "super-admin";

interface AuthState {
  role: Role | null;
  userName: string;
  hasHydrated: boolean;
  setRole: (role: Role) => void;
  signOut: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

// Auth is mock-only, but the role is persisted to localStorage so a page
// reload keeps the signed-in admin on their protected routes instead of
// bouncing them back to the login screen. Hydration is skipped on purpose and
// triggered from <AuthStoreHydrator /> after mount, which keeps the first
// client render identical to the server render (no role yet) and avoids
// hydration mismatches and redirect flashes.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      userName: "Mohamed",
      hasHydrated: false,
      setRole: (role) => set({ role }),
      signOut: () => set({ role: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "spotwise-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ role: state.role, userName: state.userName }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
