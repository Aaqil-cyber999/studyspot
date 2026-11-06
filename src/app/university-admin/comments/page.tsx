"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ClipboardList, EyeOff, MessageSquare, Search, Star, Trash2, Check } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useUniversityAdminStore } from "@/stores/university-admin-store";

type FeedbackFilter = "All" | "Reviews" | "Reports" | "Hidden";

export default function UaFeedbackPage() {
  const comments = useUniversityAdminStore((state) => state.comments);
  const reports = useUniversityAdminStore((state) => state.reports);
  const moderateComment = useUniversityAdminStore((state) => state.moderateComment);
  const moderateReport = useUniversityAdminStore((state) => state.moderateReport);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FeedbackFilter>("All");
  const [commentToHide, setCommentToHide] = useState<string | null>(null);
  const [reportToRemove, setReportToRemove] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredComments = useMemo(
    () => comments.filter((comment) => {
      const matchesQuery = `${comment.text} ${comment.locationName}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (filter === "All" || filter === "Reviews" || (filter === "Hidden" && comment.status === "Hidden"));
    }),
    [comments, filter, normalizedQuery]
  );
  const filteredReports = useMemo(
    () => reports.filter((report) => {
      const matchesQuery = `${report.locationName} ${report.comment}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (filter === "All" || filter === "Reports");
    }),
    [filter, normalizedQuery, reports]
  );

  const visibleReviewCount = comments.filter((comment) => comment.status === "Visible").length;
  const pendingReportCount = reports.filter((report) => report.status === "Pending").length;
  const hiddenCount = comments.filter((comment) => comment.status === "Hidden").length;

  function setCommentStatus(id: string, status: "Visible" | "Hidden") {
    moderateComment(id, status);
    toast.success(status === "Visible" ? "Review kept visible" : "Review hidden");
  }

  function removeReport(id: string) {
    moderateReport(id, "Dismissed");
    toast.success("Status report removed");
  }

  const showingReviews = filter === "All" || filter === "Reviews" || filter === "Hidden";
  const showingReports = filter === "All" || filter === "Reports";

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-8">
        <p className="text-xs font-medium text-orange-600">Student feedback</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.3px] text-slate-900">Reviews & reports</h1>
        <p className="mt-2 text-sm leading-5 text-slate-500">Manage student ratings, comments, and live study-space updates in one place.</p>
      </header>

      <section className="grid grid-cols-3 gap-2 px-6" aria-label="Feedback summary">
        <SummaryCard icon={<MessageSquare className="size-4" />} label="Visible reviews" value={visibleReviewCount} />
        <SummaryCard icon={<ClipboardList className="size-4" />} label="Pending reports" value={pendingReportCount} />
        <SummaryCard icon={<EyeOff className="size-4" />} label="Hidden" value={hiddenCount} />
      </section>

      <section className="px-6 pt-4">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] text-slate-400" />
          <span className="sr-only">Search feedback</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by location or text" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Feedback type">
          {(["All", "Reviews", "Reports", "Hidden"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-5 px-6 pb-[110px] pt-4">
        {showingReviews ? (
          <FeedbackSection title="Student reviews" count={filteredComments.length} icon={<MessageSquare className="size-4" />}>
            {filteredComments.map((comment) => (
              <article key={comment.id} className={`rounded-2xl border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${comment.status === "Hidden" ? "border-slate-200 opacity-80" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1 text-xs font-medium text-amber-500" aria-label={`${comment.rating} out of 5 stars`}>
                    <Star className="size-3.5 fill-current" /> {comment.rating.toFixed(1)}
                  </p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${comment.status === "Visible" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{comment.status}</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-700">&ldquo;{comment.text}&rdquo;</p>
                <p className="mt-2 text-xs text-slate-500">{comment.locationName} · {comment.createdAt}</p>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => setCommentStatus(comment.id, "Visible")} disabled={comment.status === "Visible"} className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 text-xs font-semibold text-emerald-700 disabled:opacity-40"><Check className="size-3.5" /> Keep visible</button>
                  <button type="button" onClick={() => setCommentToHide(comment.id)} disabled={comment.status === "Hidden"} className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 text-xs font-semibold text-red-600 disabled:opacity-40"><EyeOff className="size-3.5" /> Hide</button>
                </div>
              </article>
            ))}
          </FeedbackSection>
        ) : null}

        {showingReports ? (
          <FeedbackSection title="Status reports" count={filteredReports.length} icon={<ClipboardList className="size-4" />}>
            {filteredReports.map((report) => (
              <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="rounded-xl bg-orange-50 p-2"><ClipboardList className="size-4 text-orange-600" /></div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{report.locationName}</p><p className="text-[11px] text-slate-400">{report.submittedAt}</p></div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${report.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{report.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <StatusValue label="Noise" value={report.noise} /><StatusValue label="Crowd" value={report.crowd} /><StatusValue label="Seats" value={report.seats} /><StatusValue label="Wi-Fi" value={report.wifi} />
                </div>
                {report.comment ? <p className="mt-3 text-sm leading-5 text-slate-600">&ldquo;{report.comment}&rdquo;</p> : null}
                {report.status === "Pending" ? <button type="button" onClick={() => setReportToRemove(report.id)} className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 text-xs font-semibold text-red-600"><Trash2 className="size-3.5" /> Remove report</button> : null}
              </article>
            ))}
          </FeedbackSection>
        ) : null}

        {filteredComments.length === 0 && filteredReports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No feedback matches this filter.</div> : null}
      </div>

      <AdminConfirmDialog open={commentToHide !== null} onOpenChange={(open) => { if (!open) setCommentToHide(null); }} title="Hide this review?" description="Students will no longer see this review, but it will remain available in the Hidden filter." confirmLabel="Hide review" destructive onConfirm={() => { if (commentToHide) setCommentStatus(commentToHide, "Hidden"); setCommentToHide(null); }} />
      <AdminConfirmDialog open={reportToRemove !== null} onOpenChange={(open) => { if (!open) setReportToRemove(null); }} title="Remove this status report?" description="The report will be marked as dismissed and removed from the pending queue." confirmLabel="Remove report" destructive onConfirm={() => { if (reportToRemove) removeReport(reportToRemove); setReportToRemove(null); }} />
    </main>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"><span className="text-orange-600">{icon}</span><p className="mt-2 text-xl font-bold text-slate-900">{value}</p><p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-500">{label}</p></div>;
}

function FeedbackSection({ title, count, icon, children }: { title: string; count: number; icon: React.ReactNode; children: React.ReactNode }) {
  return <section><div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">{icon}{title}</h2><span className="text-xs text-slate-400">{count} {count === 1 ? "item" : "items"}</span></div><div className="space-y-3">{children}</div></section>;
}

function StatusValue({ label, value }: { label: string; value: string }) {
  return <span className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">{label}: <b>{value}</b></span>;
}
