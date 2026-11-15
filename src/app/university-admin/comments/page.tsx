"use client";

import { useMemo, useState } from "react";
import { Search, Star, EyeOff, MessageSquare, Trash2, Check } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import toast from "react-hot-toast";

type FeedbackFilter = "All" | "Reviews" | "Hidden";

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
        return matchesQuery && (filter === "All" || filter === "Reviews" || (filter === "Hidden" && comment.status === "Hidden"));
      }),
    [comments, filter, normalizedQuery],
  );
  const visibleReviewCount = comments.filter((comment) => comment.status === "Visible").length;
  const hiddenCount = comments.filter((comment) => comment.status === "Hidden").length;

  function setCommentStatus(id: string, status: "Visible" | "Hidden") {
    moderateComment(id, status);
    toast.success(status === "Visible" ? "Review kept visible" : "Review hidden");
  }

  const showingReviews = filter === "All" || filter === "Reviews" || filter === "Hidden";

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Reviews</h1>
      </header>

      <section className="px-6">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] text-slate-400" />
          <span className="sr-only">Search feedback</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by location or text" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Feedback type">
          {(["All", "Reviews", "Hidden"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"} `}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-5 px-6 pb-[110px] pt-4">
        {showingReviews ? (
          <div>
            {filteredComments.map((comment) => (
              <article key={comment.id} className="rounded-2xl border bg-white w-full p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:bg-[#fafafa] transition-colors">
                <div className="flex items-start gap-3">
                  <Star className="size-4 text-amber-500 flex-shrink-0" /> {comment.rating.toFixed(1)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{comment.text}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {comment.locationName} · {comment.createdAt}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">{comment.status === "Visible" ? "Visible" : "Hidden"}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => setCommentStatus(comment.id, "Visible")} disabled={comment.status === "Visible"} className="w-full rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-40">
                    <Check className="size-3.5 mr-1.5" /> Keep visible
                  </button>
                  <button type="button" onClick={() => setCommentToHide(comment.id)} disabled={comment.status === "Hidden"} className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-40">
                    <EyeOff className="size-3.5 mr-1.5" /> Hide
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {filteredComments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          <Star className="size-6 text-amber-500 mb-3 block mx-auto" />
          <p>No reviews match this filter.</p>
        </div>
      ) : null}
    </main>
  );
}
