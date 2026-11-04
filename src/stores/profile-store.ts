import { create } from "zustand";
import { studentProfile } from "@/mocks/data/student";

interface ProfileDetails {
  name: string;
  location: string;
  image: string | null;
}

interface ProfileState {
  /** Editable values shown on the profile tab and in the Discover header. */
  name: string;
  location: string;
  /** Base64 data URL of the uploaded profile photo, or null for the initials fallback. */
  image: string | null;
  studyStyle: string;
  noiseLevel: string;
  studyType: string;
  amenities: string[];
  setDetails: (values: ProfileDetails) => void;
  setImage: (image: string | null) => void;
  setStudyStyle: (value: string) => void;
  setNoiseLevel: (value: string) => void;
  setStudyType: (value: string) => void;
  addAmenity: (amenity: string) => void;
  removeAmenity: (amenity: string) => void;
  resetProfile: () => void;
}

const initialProfile = {
  name: studentProfile.name,
  location: studentProfile.address,
  image: null as string | null,
  studyStyle: studentProfile.studyStyle,
  noiseLevel: studentProfile.noiseLevel,
  studyType: studentProfile.studyType,
  amenities: [...studentProfile.amenities],
};

/**
 * Mock-only profile state held in memory so edits made on the profile tab
 * survive switching between the Discover / Saved / Profile tabs.
 * A reload starts over from the mock profile.
 */
export const useProfileStore = create<ProfileState>((set) => ({
  ...initialProfile,
  setDetails: (values) =>
    set({ name: values.name, location: values.location, image: values.image }),
  setImage: (image) => set({ image }),
  setStudyStyle: (studyStyle) => set({ studyStyle }),
  setNoiseLevel: (noiseLevel) => set({ noiseLevel }),
  setStudyType: (studyType) => set({ studyType }),
  addAmenity: (amenity) =>
    set((state) =>
      state.amenities.includes(amenity)
        ? state
        : { amenities: [...state.amenities, amenity] },
    ),
  removeAmenity: (amenity) =>
    set((state) => ({
      amenities: state.amenities.filter((item) => item !== amenity),
    })),
  resetProfile: () => set({ ...initialProfile, amenities: [...initialProfile.amenities] }),
}));
