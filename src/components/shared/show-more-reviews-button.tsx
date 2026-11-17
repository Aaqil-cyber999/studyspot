"use client";

import { MessageSquare } from "lucide-react";

interface ShowMoreReviewsButtonProps {
  /** How many unshown items remain after the current page. */
  remaining: number;
  onLoadMore: () => void;
}

/**
 * Shared "Show more reviews (n more)" button used by every lazy-loaded review
 * list — one visual form: a rounded-outline pill with the reviews icon and
 * the remaining count.
 */
export function ShowMoreReviewsButton({ remaining, onLoadMore }: ShowMoreReviewsButtonProps) {
  return (
    <button
      type="button"
      onClick={onLoadMore}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <MessageSquare className="size-4 text-[#f97316]" aria-hidden="true" />
      Show more reviews{" "}
      <span className="tabular-nums font-bold text-[#c2410c]">({remaining} more)</span>
    </button>
  );
}
