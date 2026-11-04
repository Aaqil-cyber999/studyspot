import { create } from "zustand";
import { DEFAULT_SAVED_SLUGS } from "@/mocks/data/saved-spots";

interface SavedState {
  /** Saved place slugs in display order (new saves are appended). */
  savedSlugs: string[];
  saveLocation: (slug: string) => void;
  removeLocation: (slug: string) => void;
  toggleSaved: (slug: string) => void;
  resetSaved: () => void;
}

const initialSavedSlugs = [...DEFAULT_SAVED_SLUGS];

/**
 * Mock-only saved list held in memory so toggling a bookmark on Discover or
 * the spot info page survives switching tabs and shows up on the Saved tab.
 * A reload restores the two mock saved places.
 */
export const useSavedStore = create<SavedState>((set) => ({
  savedSlugs: initialSavedSlugs,
  saveLocation: (slug) =>
    set((state) =>
      state.savedSlugs.includes(slug)
        ? state
        : { savedSlugs: [...state.savedSlugs, slug] },
    ),
  removeLocation: (slug) =>
    set((state) => ({
      savedSlugs: state.savedSlugs.filter((item) => item !== slug),
    })),
  toggleSaved: (slug) =>
    set((state) =>
      state.savedSlugs.includes(slug)
        ? { savedSlugs: state.savedSlugs.filter((item) => item !== slug) }
        : { savedSlugs: [...state.savedSlugs, slug] },
    ),
  resetSaved: () => set({ savedSlugs: [...initialSavedSlugs] }),
}));
