"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaComments } from "@/services/super-admin";

export default function SaCommentsPage() {
  const { data: comments = [] } = useQuery({ queryKey: ["sa", "comments"], queryFn: getSaComments });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Comments & Ratings</h1>
      </div>
      <div className="space-y-3 p-4">
        {comments.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-orange-500">
              {"★".repeat(Math.round(c.rating))} {c.rating.toFixed(1)}
            </p>
            <p className="mt-1 text-sm text-slate-700">&ldquo;{c.text}&rdquo;</p>
            <p className="mt-1 text-xs text-slate-400">
              {c.locationName} · {c.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}