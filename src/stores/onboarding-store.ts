import { create } from "zustand";

interface OnboardingState {
  /** Display name of the chosen university (for the picker + info rows). */
  university: string;
  /** FK persisted on /api/users/me when onboarding completes. */
  universityId: string | null;
  setUniversity: (university: string, universityId: string | null) => void;
}

/**
 * Keeps the chosen university while the user moves between the university
 * picker and the "Your details" step. In memory only; the info page persists
 * it to /api/users/me on submit.
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  university: "",
  universityId: null,
  setUniversity: (university, universityId) => set({ university, universityId }),
}));
