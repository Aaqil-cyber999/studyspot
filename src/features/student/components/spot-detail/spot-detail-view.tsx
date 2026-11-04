"use client";

import type { SpotDetail, SpotReview } from "@/features/student/types/spot-detail";
import { useState } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { useReviewStore } from "@/stores/review-store";
import { AddReviewDialog, type SubmittedReview } from "./add-review-dialog";
import { AmenitiesSection } from "./amenities-section";
import { CurrentStatusSection } from "./current-status-section";
import { OperatingHoursCard } from "./operating-hours-card";
import { ReviewsSection } from "./reviews-section";
import { SpotDetailTopBar } from "./spot-detail-top-bar";
import { SpotHeading } from "./spot-heading";
import { SpotHero } from "./spot-hero";

const EMPTY_REVIEWS: SpotReview[] = [];

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) {
    return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  }

  const first = Array.from(words[0])[0] ?? "";
  const last = Array.from(words[words.length - 1])[0] ?? "";

  return `${first}${last}`.toUpperCase();
}

export function SpotDetailView({ spot }: { spot: SpotDetail }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const submittedReviews = useReviewStore((state) => state.reviewsBySpot[spot.slug]) ?? EMPTY_REVIEWS;
  const addStoredReview = useReviewStore((state) => state.addReview);
  const profileName = useProfileStore((state) => state.name);
  const reviews = [...submittedReviews, ...spot.reviews.items];

  function addReview({ rating, comment }: SubmittedReview) {
    const review: SpotReview = {
      id: `${spot.slug}-review-${Date.now()}`,
      rating,
      initials: getInitials(profileName),
      author: profileName,
      year: "You",
      meta: `Just now • ${rating} star${rating === 1 ? "" : "s"}`,
      text: comment || "No comment added.",
      avatarBackground: "#ffdbca",
      avatarColor: "#9d4300",
    };

    addStoredReview(spot.slug, review);
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9ff]">
      <SpotDetailTopBar
        slug={spot.slug}
        onAddReview={() => setReviewOpen(true)}
      />

      <main className="flex flex-col gap-[15px] px-4 pb-4 pt-1">
        <SpotHero hero={spot.hero} />
        <SpotHeading spot={spot} />
        <OperatingHoursCard hours={spot.hours} />
        <CurrentStatusSection metrics={spot.metrics} lastUpdated={spot.lastUpdated} />
        <AmenitiesSection amenities={spot.amenities} />
        <ReviewsSection
          reviews={spot.reviews}
          items={reviews}
          spotName={spot.name}
          onAddReview={addReview}
        />
      </main>

      <AddReviewDialog
        spotName={spot.name}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        showTrigger={false}
        onSubmit={addReview}
      />
    </div>
  );
}
