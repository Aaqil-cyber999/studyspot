"use client";

import type { SpotDetail } from "@/features/student/types/spot-detail";
import { useState } from "react";
import { AmenitiesSection } from "./amenities-section";
import { CurrentStatusSection } from "./current-status-section";
import { OperatingHoursCard } from "./operating-hours-card";
import { ReviewsSection } from "./reviews-section";
import { SpotDetailTopBar } from "./spot-detail-top-bar";
import { SpotHeading } from "./spot-heading";
import { SpotHero } from "./spot-hero";
import { AddReviewDialog } from "./add-review-dialog";

export function SpotDetailView({ spot }: { spot: SpotDetail }) {
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9ff]">
      <SpotDetailTopBar
        slug={spot.slug}
        onAddReview={() => setReviewOpen(true)}
      />

      <main className="flex flex-col gap-[15px] px-4 pb-8 pt-1">
        <SpotHero hero={spot.hero} />
        <SpotHeading spot={spot} />
        <OperatingHoursCard hours={spot.hours} />
        <CurrentStatusSection metrics={spot.metrics} lastUpdated={spot.lastUpdated} />
        <AmenitiesSection amenities={spot.amenities} />
        <ReviewsSection reviews={spot.reviews} spotName={spot.name} />
      </main>

      <AddReviewDialog
        spotName={spot.name}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        showTrigger={false}
      />
    </div>
  );
}
