"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SpotDetail } from "@/features/student/types/spot-detail";
import { AddReviewDialog, type SubmittedReview } from "./add-review-dialog";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { AmenitiesSection } from "./amenities-section";
import { CurrentStatusSection } from "./current-status-section";
import { OperatingHoursCard } from "./operating-hours-card";
import { ReviewsSection } from "./reviews-section";
import { SpotDetailTopBar } from "./spot-detail-top-bar";
import { SpotHeading } from "./spot-heading";
import { api } from "@/services/api";

export function SpotDetailView({ spot }: { spot: SpotDetail }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async ({ rating, comment }: SubmittedReview) =>
      api.post("/reviews", { locationId: spot.slug, rating, text: comment || "No comment added." }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["student", "reviews", spot.slug] });
      void queryClient.invalidateQueries({ queryKey: ["location", spot.slug] });
    },
  });

  function addReview({ rating, comment }: SubmittedReview) {
    createReview.mutate({ rating, comment });
  }

  return (
    <div className="relative min-h-screen w-full bg-[#E2E8F0]">
      <SpotDetailTopBar
        slug={spot.slug}
        onAddReview={() => setReviewOpen(true)}
      />

      <main className="flex flex-col gap-[15px] px-4 pb-4 pt-1">
        <ImageCarousel
          previewUrls={spot.hero.images}
          currentIdx={currentIdx}
          onRemove={() => {}}
          onPrev={() => setCurrentIdx((index) => (index - 1 + spot.hero.images.length) % spot.hero.images.length)}
          onNext={() => setCurrentIdx((index) => (index + 1) % spot.hero.images.length)}
          showRemoveButton={false}
        />
        <SpotHeading spot={spot} />
        <OperatingHoursCard hours={spot.hours} />
        <CurrentStatusSection
          metrics={spot.metrics}
          lastUpdated={spot.lastUpdated}
          locationId={spot.slug}
          spotName={spot.name}
          reportComment={spot.reportComment}
          lastReportedByName={spot.lastReportedByName}
          lastReportedByFaculty={spot.lastReportedByFaculty}
        />
        <AmenitiesSection amenities={spot.amenities} />
        <ReviewsSection
          reviews={spot.reviews}
          items={spot.reviews.items}
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
