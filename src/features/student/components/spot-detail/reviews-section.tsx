import { Star } from "lucide-react";
import type { SpotDetail } from "@/features/student/types/spot-detail";
import { AddReviewDialog } from "./add-review-dialog";
import { ReviewCard } from "./review-card";

interface ReviewsSectionProps {
  reviews: SpotDetail["reviews"];
  spotName: string;
}

export function ReviewsSection({ reviews, spotName }: ReviewsSectionProps) {
  return (
    <section aria-labelledby="reviews-heading" className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex flex-col items-start">
          <h2 id="reviews-heading" className="font-body text-[18px] font-bold leading-6 text-[#0b1c30]">
            Student Reviews
          </h2>
          <p className="font-body text-[11px] font-medium leading-[14px] tracking-[0.33px] text-[#515f74]">
            Verified campus peer feedback
          </p>
        </div>

        <AddReviewDialog spotName={spotName} />
      </div>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-[15px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)]">
        <div className="flex w-full items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-[rgba(245,158,11,0.14)]">
            <Star aria-hidden="true" className="size-[22px] text-[#f59e0b]" fill="#f59e0b" strokeWidth={0} />
          </span>
          <div className="flex flex-col items-start gap-[3px]">
            <p className="font-body text-[18px] font-semibold leading-6 text-[#0b1c30]">{reviews.verdict}</p>
            <p className="font-body text-[12px] leading-4 text-[#64748b]">{reviews.verdictDetail}</p>
          </div>
        </div>

        <span aria-hidden="true" className="h-px w-full bg-[#e2e8f0]" />

        <div className="flex w-full flex-col items-start gap-1.5">
          <p className="font-body text-[11px] font-medium leading-[14px] text-[#64748b]">Most mentioned</p>
          <ul className="flex flex-wrap items-center gap-2">
            {reviews.mentions.map((mention) => (
              <li
                key={mention}
                className="flex h-[30px] items-center justify-center rounded-[15px] bg-[#f0f0f0] px-3 text-[13px] font-medium leading-[18px] text-[#333]"
              >
                {mention}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
