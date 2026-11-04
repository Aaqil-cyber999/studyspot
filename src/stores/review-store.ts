import { create } from "zustand";
import type { SpotReview } from "@/features/student/types/spot-detail";

interface ReviewStore {
  reviewsBySpot: Record<string, SpotReview[]>;
  addReview: (spotSlug: string, review: SpotReview) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviewsBySpot: {},
  addReview: (spotSlug, review) =>
    set((state) => ({
      reviewsBySpot: {
        ...state.reviewsBySpot,
        [spotSlug]: [review, ...(state.reviewsBySpot[spotSlug] ?? [])],
      },
    })),
}));
