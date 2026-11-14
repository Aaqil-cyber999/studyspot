import { create } from "zustand";

export type Role = "student" | "university-admin" | "super-admin";

interface AuthState {
  role: Role | null;
  userName: string;
  setAuth: (auth: { role: Role; userName: string; email: string; university: string; image?: string }) => void;
  setRole: (role: Role) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userName: "Mohamed",
  setAuth: (auth) => set({ role: auth.role, userName: auth.userName }),
  setRole: (role) => set({ role }),
  signOut: () => set({ role: null, userName: "Mohamed" }),
}));