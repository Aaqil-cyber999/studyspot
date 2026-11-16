"use client";

import { useMemo, useState } from "react";
import { Search, Star, User, Eye, EyeOff } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import toast from "react-hot-toast";

type FeedbackFilter = "All" | "Hidden";

export default function UaFeedbackPage() {
  const comments = useUniversityAdminStore((state) => state.comments);
  const moderateComment = useUniversityAdminStore((state) => state.moderateComment);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FeedbackFilter>("All");
  const [commentToHide, setCommentToHide] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredComments = useMemo(
    () =>
      comments.filter((comment) => {
        const matchesQuery = `${comment.text} ${comment.locationName}`.toLowerCase().includes(normalizedQuery);
        return matchesQuery && (filter === "All" || (filter === "Hidden" && comment.status === "Hidden"));
      }),
    [comments, filter, normalizedQuery],
  );
  const visibleReviewCount = comments.filter((comment) => comment.status === "Visible").length;
  const hiddenCount = comments.filter((comment) => comment.status === "Hidden").length;

  function setCommentStatus(id: string, status: "Visible" | "Hidden") {
    moderateComment(id, status);
    toast.success(status === "Visible" ? "Review kept visible" : "Review hidden");
  }

  const showingReviews = filter === "All" || filter === "Hidden";

function formatShortTime(time: string): string {
  // Convert "3 days ago" to "3d", "1 week ago" to "1w", etc.
  const match = time.match(/(\d+)\s*(day|days|week|weeks|hour|hours|minute|minutes|month|months)/i);
  if (match) {
    const num = match[1];
    const unit = match[2].toLowerCase();
    if (unit.startsWith("day")) return `${num}d`;
    if (unit.startsWith("week")) return `${num}w`;
    if (unit.startsWith("hour")) return `${num}h`;
    if (unit.startsWith("minute")) return `${num}m`;
    if (unit.startsWith("month")) return `${num}mo`;
  }
  // Fallback: just return the first word or the whole string
  return time.split(" ")[0] || time;
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
          ))
        }
        </div>
      </section>

      <div className="px-6 pb-[90px] pt-4">
        {showingReviews ? (
          <div className="flex flex-col gap-4">
            {filteredComments.map((comment) => (
              <article
                key={comment.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white">
                    <User className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-semibold text-[#0f172a] truncate min-w-0">{comment.author}</h3>
                      <span className="text-[12px] text-[#94a3b8]">{formatShortTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-[13px] text-[#64748b] truncate">{comment.locationName}</p>
                  </div>
                </div>

                <p className="flex-1 text-[14px] leading-relaxed text-[#334155] mb-4">
                  {comment.text}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span className="text-[14px] font-semibold text-[#0f172a]">{comment.rating.toFixed(1)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => comment.status === "Visible" ? setCommentToHide(comment.id) : setCommentStatus(comment.id, "Visible")}
                    className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
                      comment.status === "Visible" ? "text-red-600 hover:text-red-700" : "text-orange-600 hover:text-orange-700"
                    }`}
                  >
                    {comment.status === "Visible" ? (
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
        ) : null}
      </div>

      <AdminConfirmDialog
        open={!!commentToHide}
        onOpenChange={(open) => !open && setCommentToHide(null)}
        title="Hide Review"
        description="Are you sure you want to hide this review? It will no longer be visible to students."
        confirmLabel="Hide"
        destructive
        onConfirm={() => {
          if (commentToHide) {
            setCommentStatus(commentToHide, "Hidden");
            setCommentToHide(null);
          }
        }}
      />

      {filteredComments.length === 0 ? (
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