"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { SpotReview } from "@/features/student/types/spot-detail";

export function ReviewCard({ review }: { review: SpotReview }) {
  const [helpful, setHelpful] = useState(false);

  return (
    <article className="flex w-full flex-col gap-3.5 rounded-xl border border-[#e2e8f0] bg-[#ddd] p-4 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)]">
      <header className="flex h-[38px] w-full items-start gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-[18px] font-body text-[12px] font-bold leading-4"
          style={{ backgroundColor: review.avatarBackground, color: review.avatarColor }}
        >
          {review.initials}
        </span>

        <div className="flex min-w-0 flex-col items-start gap-[3px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-body text-[14px] font-bold leading-5 text-[#0b1c30]">{review.author}</p>
            <span className="inline-flex h-[15px] items-center rounded-[4px] bg-[#e5eeff] px-1.5 font-body text-[10px] font-semibold leading-[15px] text-[#515f74]">
              {review.year}
            </span>
          </div>
          <p className="font-body text-[11px] font-medium leading-[14px] text-[#515f74]">{review.meta}</p>
        </div>
      </header>

      <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          const filled = index < review.rating;

          return (
            <Star
              key={index}
              aria-hidden="true"
              className={cn("size-4", filled ? "text-[#f59e0b]" : "text-[#DDDDDD]")}
              fill={filled ? "#f59e0b" : "#DDDDDD"}
              strokeWidth={0}
            />
          );
        })}
      </div>

      <p className="w-full font-body text-[14px] leading-[22px] text-[#0b1c30]">{review.text}</p>

      <footer className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const next = !helpful;
            setHelpful(next);
            toast.success(next ? "Marked as helpful" : "Helpful mark removed");
          }}
          aria-pressed={helpful}
          className={cn(
            "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[10px] border border-[#e2e8f0] bg-white px-3 transition-colors hover:bg-[#fff7ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2",
            helpful && "bg-[#fff7ed]",
          )}
        >
          <ThumbsUp
            aria-hidden="true"
            className={cn("size-3.5 text-[#515f74]", helpful && "fill-[#f97316] text-[#f97316]")}
            strokeWidth={2}
          />
          <span className={cn("font-body text-[12px] font-medium leading-4 text-[#515f74]", helpful && "text-[#f97316]")}>
            Helpful
          </span>
        </button>
        <span className="h-px min-w-px flex-1" />
      </footer>
    </article>
  );
}
