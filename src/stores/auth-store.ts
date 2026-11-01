import { create } from "zustand";

export type Role = "student" | "university-admin" | "super-admin";

interface AuthState {
  role: Role | null;
  userName: string;
  setRole: (role: Role) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userName: "Mohamed",
  setRole: (role) => set({ role }),
  signOut: () => set({ role: null }),
}));