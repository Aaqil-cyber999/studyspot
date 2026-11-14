"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaComments } from "@/services/super-admin";
import { Star } from "lucide-react";

type SaComment = {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  text: string;
  status: "Visible" | "Hidden";
  createdAt: string;
};

export default function SaCommentsPage() {
  const { data: comments = [] as SaComment[] } = useQuery({
    queryKey: ["sa", "comments"],
    queryFn: getSaComments,
  });

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Community feedback</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Comments & ratings</h1>
      </header>

          {comments.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">No comments yet</p>
              <p className="mt-1 text-sm">Student comments and ratings will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="size-5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-slate-800">{Math.round(c.rating)} out of 5</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.status === "Visible" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">{c.text}</p>
                  <p className="mt-2 text-xs text-slate-400">{c.createdAt}</p>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}