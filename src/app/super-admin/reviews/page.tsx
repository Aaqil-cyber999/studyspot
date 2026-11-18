"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Star, Eye, EyeOff, MessageSquare, MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaReviews, moderateSaReview } from "@/services/super-admin";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { ShowMoreReviewsButton } from "@/components/shared/show-more-reviews-button";

const PAGE_SIZE = 10;

type StatusFilter = "All" | "Visible" | "Hidden";

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  return `${Array.from(words[0])[0] ?? ""}${Array.from(words[words.length - 1])[0] ?? ""}`.toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${Math.round(rating)} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <Star key={index} className={`size-3 ${index < Math.round(rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`} aria-hidden="true" />
      ))}
      <span className="ml-1.5 text-[10px] font-semibold tabular-nums text-[#64748b]">{Math.round(rating)}</span>
    </span>
  );
}

function relativeTime(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}

export default function SaReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isPending } = useQuery({
    queryKey: ["sa", "reviews"],
    queryFn: () => getSaReviews(),
  });
  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Visible" | "Hidden" }) => moderateSaReview(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sa", "reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["sa", "overview"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to update the review."),
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [hideTarget, setHideTarget] = useState<{ id: string; authorName: string } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesQuery = !normalizedQuery || `${review.text} ${review.locationName} ${review.authorName}`.toLowerCase().includes(normalizedQuery);
        const matchesFilter = filter === "All" || review.status === filter;
        return matchesQuery && matchesFilter;
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

  const visibleCount = reviews.filter((review) => review.status === "Visible").length;

  function requestToggle(id: string, status: "Visible" | "Hidden", authorName: string) {
    if (status === "Visible") {
      setHideTarget({ id, authorName });
      return;
    }
    moderateMutation.mutate(
      { id, status: "Visible" },
      {
        onSuccess: (updated) => toast.success(updated.status === "Visible" ? "Review shown" : "Review hidden"),
      },
    );
  }

  function confirmHide() {
    if (!hideTarget) return;
    const { id } = hideTarget;
    setHideTarget(null);
    moderateMutation.mutate(
      { id, status: "Hidden" },
      {
        onSuccess: (updated) => toast.success(updated.status === "Visible" ? "Review shown" : "Review hidden"),
      },
    );
  }

  if (isPending) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Reviews</h1>
        <p className="mt-1 text-xs text-[#64748b]">
          {reviews.length} reviews · {visibleCount} visible
        </p>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search reviews</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
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
              onClick={() => {
                setFilter(item);
                setVisible(PAGE_SIZE);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col pb-4 pt-3">
        {filteredReviews.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <MessageSquare className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No reviews found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">{normalizedQuery ? "Try a different search." : `No ${filter.toLowerCase()} reviews.`}</p>
          </div>
        ) : (
          <div className="space-y-[12px] pb-2">
            {shownReviews.map((review) => (
              <article key={review.id} className={`rounded-2xl border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${review.status === "Hidden" ? "border-dashed border-slate-300 opacity-70" : "border-[#e2e8f0]"}`}>
                <div className="flex items-center gap-3">
                  {review.authorImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.authorImg} alt="" loading="lazy" decoding="async" className="size-9 shrink-0 rounded-full bg-[#f1f5f9] object-cover" />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffdbca] text-[11px] font-bold text-[#9d4300]" aria-hidden="true">
                      {initials(review.authorName)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[14px] font-semibold text-[#0f172a]">{review.authorName}</p>
                      <span className="shrink-0 text-[11px] text-[#94a3b8]">{relativeTime(review.createdAt)}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#64748b]">{[review.authorFaculty, review.universityName].filter(Boolean).join(" - ") || "Faculty not set"}</p>
                  </div>
                </div>

                <Link href={`/super-admin/locations/${review.locationId}`} aria-label={`Open ${review.locationName}`} className="mb-3 mt-3 inline-flex max-w-full items-center gap-1.5 self-start rounded-full border border-[#fed7aa] bg-[#fff7ed] py-1 pl-2 pr-2.5 text-[11px] font-semibold leading-4 text-[#c2410c] transition hover:border-[#fdba74] hover:bg-[#ffedd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
                  <MapPin className="size-3 shrink-0 text-[#f97316]" aria-hidden="true" />
                  <span className="truncate">{review.locationName}</span>
                </Link>

                <p className="mt-3 text-sm leading-6 text-slate-700">&ldquo;{review.text}&rdquo;</p>

                <div className="flex items-center justify-between gap-2 pt-3">
                  <Stars rating={review.rating} />
                  <button type="button" disabled={moderateMutation.isPending} onClick={() => requestToggle(review.id, review.status, review.authorName)} className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-60 ${review.status === "Visible" ? "text-red-600 hover:text-red-700" : "text-orange-600 hover:text-orange-700"}`}>
                    {review.status === "Visible" ? (
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
            {hasMore ? (
              <>
                <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
                <div className="flex flex-col items-center gap-1.5 pb-1">
                  <ShowMoreReviewsButton remaining={filteredReviews.length - visible} onLoadMore={() => setVisible((current) => Math.min(current + PAGE_SIZE, filteredReviews.length))} />
                  <p className="text-[11px] text-slate-400">
                    {shownReviews.length} of {filteredReviews.length} shown
                  </p>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      <AdminConfirmDialog
        open={hideTarget !== null}
        onOpenChange={(open) => {
          if (!open) setHideTarget(null);
        }}
        title="Hide this review?"
        description={hideTarget ? `Students will no longer see ${hideTarget.authorName}&rsquo;s review. You can show it again later.` : ""}
        confirmLabel="Hide review"
        destructive
        onConfirm={confirmHide}
      />
    </div>
  );
}
