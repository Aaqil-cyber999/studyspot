"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, EyeOff, Search } from "lucide-react";
import { useUniversityAdminStore } from "@/stores/university-admin-store";

export default function UaCommentsPage() {
  const comments = useUniversityAdminStore((state) => state.comments);
  const moderateComment = useUniversityAdminStore((state) => state.moderateComment);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Visible" | "Hidden">("All");
  const filteredComments = useMemo(
    () => comments.filter((comment) => {
      const matchesQuery = `${comment.text} ${comment.locationName}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (filter === "All" || comment.status === filter);
    }),
    [comments, filter, query]
  );

  function setStatus(id: string, status: "Visible" | "Hidden") {
    moderateComment(id, status);
    toast.success(status === "Visible" ? "Comment kept visible" : "Comment hidden");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-6 pb-4 pt-16">
        <p className="text-xs font-medium text-orange-600">Student feedback</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.3px] text-[#0f172a]">Comments & Ratings</h1>
      </div>
      <div className="px-6">
        <label className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3"><Search className="h-[18px] w-[18px] text-slate-400" /><span className="sr-only">Search comments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search comments or locations" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
        <div className="mt-3 flex gap-2">
          {(["All", "Visible", "Hidden"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}
        </div>
      </div>
      <div className="space-y-3 px-6 pb-[110px] pt-4">
        {filteredComments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No comments match this filter.</div> : filteredComments.map((comment) => (
          <article key={comment.id} className={`rounded-2xl border bg-white p-4 shadow-[0px_4px_16px_rgba(0,0,0,0.04)] ${comment.status === "Hidden" ? "border-slate-200 opacity-75" : "border-[#e2e8f0]"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-amber-500">{"★".repeat(Math.round(comment.rating))}{"☆".repeat(5 - Math.round(comment.rating))} <span className="text-slate-500">{comment.rating.toFixed(1)}</span></p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${comment.status === "Visible" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{comment.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">&ldquo;{comment.text}&rdquo;</p>
            <p className="mt-2 text-xs text-slate-500">{comment.locationName} · {comment.createdAt}</p>
            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              <button type="button" onClick={() => setStatus(comment.id, "Visible")} disabled={comment.status === "Visible"} className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 text-xs font-semibold text-emerald-700 disabled:opacity-40"><Check className="h-3.5 w-3.5" /> Keep visible</button>
              <button type="button" onClick={() => { if (window.confirm("Hide this comment from students?")) setStatus(comment.id, "Hidden"); }} disabled={comment.status === "Hidden"} className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 text-xs font-semibold text-red-600 disabled:opacity-40"><EyeOff className="h-3.5 w-3.5" /> Hide</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
