"use client";

import { useMemo, useState } from "react";
import { Search, Star, User, Eye, EyeOff, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useSuperAdminStore } from "@/stores/super-admin-store";

type StatusFilter = "All" | "Visible" | "Hidden";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${Math.round(rating)} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`size-3 ${index < Math.round(rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1.5 text-[10px] font-semibold tabular-nums text-[#64748b]">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export default function SaReviewsPage() {
  const comments = useSuperAdminStore((state) => state.comments);
  const moderateComment = useSuperAdminStore((state) => state.moderateComment);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredComments = useMemo(
    () =>
      comments.filter((comment) => {
        const matchesQuery =
          !normalizedQuery ||
          `${comment.text} ${comment.locationName} ${comment.author}`.toLowerCase().includes(normalizedQuery);
        const matchesFilter = filter === "All" || comment.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [comments, filter, normalizedQuery],
  );

  const visibleCount = comments.filter((comment) => comment.status === "Visible").length;

  function toggleVisibility(id: string, status: "Visible" | "Hidden") {
    moderateComment(id, status === "Visible" ? "Hidden" : "Visible");
    toast.success(status === "Visible" ? "Review hidden" : "Review shown");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Reviews</h1>
        <p className="mt-1 text-xs text-[#64748b]">
          {comments.length} reviews · {visibleCount} visible
        </p>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search reviews</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reviews, locations or students"
            className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 flex gap-2 pb-1" role="group" aria-label="Filter reviews by status">
          {(["All", "Visible", "Hidden"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${
                filter === item
                  ? "bg-orange-500 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col pb-4 pt-3">
        {filteredComments.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <MessageSquare className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No reviews found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              {normalizedQuery ? "Try a different search." : `No ${filter.toLowerCase()} reviews.`}
            </p>
          </div>
        ) : (
          <div className="space-y-[12px]">
            {filteredComments.map((comment) => (
              <article
                key={comment.id}
                className={`rounded-2xl border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
                  comment.status === "Hidden" ? "border-dashed border-slate-300 opacity-70" : "border-[#e2e8f0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white" aria-hidden="true">
                    <User className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[14px] font-semibold text-[#0f172a]">{comment.author}</p>
                      <span className="shrink-0 text-[11px] text-[#94a3b8]">{comment.createdAt}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#64748b]">{comment.locationName}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-700">&ldquo;{comment.text}&rdquo;</p>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <Stars rating={comment.rating} />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(comment.id, comment.status)}
                    className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${
                      comment.status === "Visible" ? "text-red-600 hover:text-red-700" : "text-orange-600 hover:text-orange-700"
                    }`}
                  >
                    {comment.status === "Visible" ? (
                      <>
                        <EyeOff className="size-3.5" aria-hidden="true" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" aria-hidden="true" /> Show
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
