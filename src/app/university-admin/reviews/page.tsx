"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Star, User, Eye, EyeOff } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaReviews, moderateUaReview } from "@/services/university-admin";
import toast from "react-hot-toast";

type FeedbackFilter = "All" | "Hidden";

export default function UaReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isPending } = useQuery({
    queryKey: ["ua", "reviews"],
    queryFn: getUaReviews,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FeedbackFilter>("All");
  const [reviewToHide, setReviewToHide] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesQuery = `${review.text} ${review.locationName}`.toLowerCase().includes(normalizedQuery);
        return matchesQuery && (filter === "All" || (filter === "Hidden" && review.status === "Hidden"));
      }),
    [reviews, filter, normalizedQuery],
  );

  async function setReviewStatus(id: string, status: "Visible" | "Hidden") {
    try {
      await moderateUaReview(id, status);
      await queryClient.invalidateQueries({ queryKey: ["ua", "reviews"] });
      toast.success(status === "Visible" ? "Review kept visible" : "Review hidden");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the review.");
    }
  }

  return (
    <main className="bg-[#E2E8F0]">
      <header className="px-6 pb-4 pt-[16px]">
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Reviews</h1>
      </header>

      <section className="px-6">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] text-slate-400" />
          <span className="sr-only">Search feedback</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by location or text" className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Feedback type">
          {(["All", "Hidden"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"} `}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="px-6 pb-[90px] pt-4">
        {isPending ? (
          <PageLoader className="min-h-[40vh]" />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white">
                    <User className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-semibold text-[#0f172a] truncate min-w-0">{review.author}</h3>
                      <span className="text-[12px] text-[#94a3b8]">{review.createdAt}</span>
                    </div>
                    <p className="text-[13px] text-[#64748b] truncate">{review.locationName}</p>
                  </div>
                </div>

                <p className="flex-1 text-[14px] leading-relaxed text-[#334155] mb-4">
                  {review.text}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span className="text-[14px] font-semibold text-[#0f172a]">{review.rating.toFixed(1)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => review.status === "Visible" ? setReviewToHide(review.id) : setReviewStatus(review.id, "Visible")}
                    className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
                      review.status === "Visible" ? "text-red-600 hover:text-red-700" : "text-orange-600 hover:text-orange-700"
                    }`}
                  >
                    {review.status === "Visible" ? (
                      <>
                        <EyeOff className="size-3.5" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" /> Show
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AdminConfirmDialog
        open={!!reviewToHide}
        onOpenChange={(open) => !open && setReviewToHide(null)}
        title="Hide Review"
        description="Are you sure you want to hide this review? It will no longer be visible to students."
        confirmLabel="Hide"
        destructive
        onConfirm={() => {
          if (reviewToHide) {
            setReviewStatus(reviewToHide, "Hidden");
            setReviewToHide(null);
          }
        }}
      />

      {!isPending && filteredReviews.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center text-center text-sm text-slate-500">
          <div>
            <Star className="size-6 text-amber-500 mb-3 mx-auto" />
            <p>No reviews match this filter.</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
