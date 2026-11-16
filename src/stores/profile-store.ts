import { create } from "zustand";
import { api } from "@/services/api";

interface ApiUserProfile {
  name: string;
  address: string | null;
  faculty: string | null;
  studyStyle: string | null;
  noiseLevel: string | null;
  studyType: string | null;
  amenities: string[];
  profileImg: string | null;
}

interface ProfileState {
  name: string;
  location: string;
  faculty: string;
  image: string | null;
  studyStyle: string;
  noiseLevel: string;
  studyType: string;
  amenities: string[];
  /** Populate the cache from /api/auth/me. */
  hydrateFromApi: (user: ApiUserProfile) => void;
  hydrateFromApiPartial: (user: Partial<ApiUserProfile>) => void;
  setDetails: (values: { name: string; location: string; faculty: string; image: string | null }) => void;
  setStudyStyle: (studyStyle: string) => void;
  setNoiseLevel: (noiseLevel: string) => void;
  setStudyType: (studyType: string) => void;
  addAmenity: (amenity: string) => void;
  removeAmenity: (amenity: string) => void;
  resetProfile: () => void;
}

export const DEFAULT_PROFILE = {
  name: "",
  location: "",
  faculty: "",
  image: null as string | null,
  studyStyle: "Quiet",
  noiseLevel: "Low",
  studyType: "Individual",
  amenities: [] as string[],
};

/** Fire a background persist. Optimistic local state is not rolled back on failure — a reload re-reads the truth. */
function persist(partial: Record<string, unknown>) {
  void api.put("/users/me", partial).catch(() => {
    // Best effort; the hydrator re-syncs on mount.
  });
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...DEFAULT_PROFILE,

  hydrateFromApi: (user) =>
    set({
      name: user.name ?? "",
      location: user.address ?? "",
      faculty: user.faculty ?? "",
      image: user.profileImg ?? null,
      studyStyle: user.studyStyle ?? "Quiet",
      noiseLevel: user.noiseLevel ?? "Low",
      studyType: user.studyType ?? "Individual",
      amenities: user.amenities ?? [],
    }),

  hydrateFromApiPartial: (user) =>
    set({
      ...(user.name !== undefined && user.name !== null ? { name: user.name } : {}),
      ...(user.address !== undefined ? { location: user.address ?? "" } : {}),
      ...(user.faculty !== undefined ? { faculty: user.faculty ?? "" } : {}),
      ...(user.profileImg !== undefined ? { image: user.profileImg ?? null } : {}),
      ...(user.studyStyle ? { studyStyle: user.studyStyle } : {}),
      ...(user.noiseLevel ? { noiseLevel: user.noiseLevel } : {}),
      ...(user.studyType ? { studyType: user.studyType } : {}),
      ...(user.amenities ? { amenities: user.amenities } : {}),
    }),

  setDetails: ({ name, location, faculty, image }) => {
    const trimmedLocation = location.trim();
    set({ name, location, faculty, image });
    persist({ name, address: trimmedLocation.length > 0 ? trimmedLocation : null, faculty, profileImg: image });
  },
  setStudyStyle: (studyStyle) => {
    set({ studyStyle });
    persist({ studyStyle });
  },
  setNoiseLevel: (noiseLevel) => {
    set({ noiseLevel });
    persist({ noiseLevel });
  },
  setStudyType: (studyType) => {
    set({ studyType });
    persist({ studyType });
  },
  addAmenity: (amenity) =>
    set((state) => {
      if (state.amenities.includes(amenity)) return state;
      const next = [...state.amenities, amenity];
      persist({ amenities: next });
      return { amenities: next };
    }),
  removeAmenity: (amenity) =>
    set((state) => {
      const next = state.amenities.filter((entry) => entry !== amenity);
      persist({ amenities: next });
      return { amenities: next };
    }),
  resetProfile: () => set(DEFAULT_PROFILE),
}));
