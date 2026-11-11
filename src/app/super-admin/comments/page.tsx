"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getSaComments } from "@/services/super-admin";

export default function SaCommentsPage() {
  const { data: comments = [] } = useQuery({ queryKey: ["sa", "comments"], queryFn: getSaComments });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Comments & ratings</h1>
      </header>

      <div className="pb-4">
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No comments yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Student comments and ratings will appear here.</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5 text-xs font-medium text-amber-500" aria-label={`${Math.round(c.rating)} out of 5 stars`}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`size-3 ${index < Math.round(c.rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1.5 text-[10px] font-semibold tabular-nums text-[#64748b]">
                      {c.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-700">&ldquo;{c.text}&rdquo;</p>
                <p className="mt-2 text-xs text-[#64748b]">{c.locationName} · {c.createdAt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
