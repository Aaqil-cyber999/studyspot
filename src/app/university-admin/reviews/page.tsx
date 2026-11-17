"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Star, MapPin, Eye, EyeOff } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaReviews, moderateUaReview } from "@/services/university-admin";
import { timeAgo } from "@/lib/time-ago";
import { ShowMoreReviewsButton } from "@/components/shared/show-more-reviews-button";
import toast from "react-hot-toast";

type FeedbackFilter = "All" | "Hidden";

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  return `${Array.from(words[0])[0] ?? ""}${Array.from(words[words.length - 1])[0] ?? ""}`.toUpperCase();
}

const PAGE_SIZE = 10;

export default function UaReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isPending } = useQuery({
    queryKey: ["ua", "reviews"],
    queryFn: getUaReviews,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FeedbackFilter>("All");
  const [reviewToHide, setReviewToHide] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesQuery = `${review.text} ${review.locationName}`.toLowerCase().includes(normalizedQuery);
        return matchesQuery && (filter === "All" || (filter === "Hidden" && review.status === "Hidden"));
      }),
    [reviews, filter, normalizedQuery],
  );

  const shownReviews = useMemo(() => filteredReviews.slice(0, visible), [filteredReviews, visible]);
  const hasMore = filteredReviews.length > visible;

  // Infinite scroll: load the next batch when the sentinel scrolls into view.
  useEffect(() => {
    if (!hasMore) return;
    const element = sentinelRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible((current) => Math.min(current + PAGE_SIZE, filteredReviews.length));
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, filteredReviews.length]);

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
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }} placeholder="Search by location or text" className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Feedback type">
          {(["All", "Hidden"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => { setFilter(item); setVisible(PAGE_SIZE); }} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"} `}>
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
            {shownReviews.map((review) => (
              <article key={review.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="mb-3 flex items-center gap-3">
                  {review.authorImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.authorImg}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-9 shrink-0 rounded-full object-cover bg-[#f1f5f9]"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffdbca] text-[12px] font-bold leading-5 text-[#9d4300]"
                    >
                      {initials(review.author)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="min-w-0 truncate text-[15px] font-semibold text-[#0f172a]">{review.author}</h3>
                      <span className="shrink-0 text-[11px] text-[#94a3b8]">{timeAgo(review.createdAt)}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#64748b]">{review.authorFaculty ?? "Faculty not set"}</p>
                  </div>
                </div>

                {/* Location as a map-pin chip that points at the spot */}
                <div className="mb-2 inline-flex max-w-full items-center gap-1.5 self-start rounded-full border border-[#fed7aa] bg-[#fff7ed] py-1 pl-2 pr-2.5 text-[11px] font-semibold leading-4 text-[#c2410c]">
                  <MapPin className="size-3 shrink-0 text-[#f97316]" aria-hidden="true" />
                  <span className="min-w-0 truncate">{review.locationName}</span>
                </div>

                <p className="flex-1 text-[14px] leading-relaxed text-[#334155] mb-1">{review.text}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span className="text-[14px] font-semibold text-[#0f172a]">{Math.round(review.rating)}</span>
                  </div>

                  <button type="button" onClick={() => (review.status === "Visible" ? setReviewToHide(review.id) : setReviewStatus(review.id, "Visible"))} className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${review.status === "Visible" ? "text-red-600 hover:text-red-700" : "text-orange-600 hover:text-orange-700"}`}>
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
            {hasMore ? (
              <>
                <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
                <div className="flex flex-col items-center gap-1.5 pb-2">
                  <ShowMoreReviewsButton
                    remaining={filteredReviews.length - visible}
                    onLoadMore={() => setVisible((current) => Math.min(current + PAGE_SIZE, filteredReviews.length))}
                  />
                  <p className="text-[11px] text-slate-400">{shownReviews.length} of {filteredReviews.length} shown</p>
                </div>
              </>
            ) : null}
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
