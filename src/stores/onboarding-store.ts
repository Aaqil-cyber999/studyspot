import { create } from "zustand";

interface OnboardingState {
  university: string;
  setUniversity: (university: string) => void;
}

/**
 * Keeps the chosen university while the user moves between the university
 * picker and the "Your details" step. In memory only (mock onboarding).
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  university: "",
  setUniversity: (university) => set({ university }),
}));
