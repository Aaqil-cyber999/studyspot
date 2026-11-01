"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUaComments } from "@/services/university-admin";

export default function UaCommentsPage() {
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Comments & Ratings</h1>
      </div>
      <div className="space-y-3 p-4">
        {comments.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-orange-500">
                {"★".repeat(Math.round(c.rating))} {c.rating.toFixed(1)}
              </p>
              <button
                onClick={() => {
                  setSelected(c.id);
                  setOpen(true);
                }}
                className="text-xs font-medium text-red-500"
              >
                Moderate
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-700">&ldquo;{c.text}&rdquo;</p>
            <p className="mt-1 text-xs text-slate-400">
              {c.locationName} · {c.createdAt}
            </p>
          </div>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-[412px] rounded-t-3xl bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Moderation</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose an action for comment {selected}.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-orange-500 py-3 font-medium text-white"
              >
                Keep
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl border border-red-200 py-3 font-medium text-red-500"
              >
                Remove
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-sm text-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}