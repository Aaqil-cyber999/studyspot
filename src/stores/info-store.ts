import { create } from "zustand";

/**
 * Store for the onboarding "Your details" page ( /student/info ).
 * It preserves the entered name, address, and UI error/shake state across
 * navigation so that the user does not lose their progress when they leave the
 * page and come back (e.g., to pick a university). All data lives in memory –
 * a page reload will reset to the initial empty values, which matches the mock
 * nature of the app.
 */
interface InfoState {
  /** User's name input */
  name: string;
  /** Optional address input */
  address: string;
  /** Faculty input */
  faculty: string;
  /** Validation error message, if any */
  error: string | null;
  /** Whether the shake animation should be shown */
  shake: boolean;
  /** Update the name */
  setName: (value: string) => void;
  /** Update the address */
  setAddress: (value: string) => void;
  /** Update the faculty */
  setFaculty: (value: string) => void;
  /** Set the current error message */
  setError: (msg: string | null) => void;
  /** Toggle the shake flag */
  setShake: (value: boolean) => void;
  /** Reset the store to its initial state */
  reset: () => void;
}

export const useInfoStore = create<InfoState>((set) => ({
  name: "",
  address: "",
  faculty: "",
  error: null,
  shake: false,
  setName: (value) => set({ name: value }),
  setAddress: (value) => set({ address: value }),
  setFaculty: (value) => set({ faculty: value }),
  setError: (msg) => set({ error: msg }),
  setShake: (value) => set({ shake: value }),
  reset: () =>
    set({ name: "", address: "", faculty: "", error: null, shake: false }),
}));
