"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUaDashboard, getUaComments } from "@/services/university-admin";

export default function UaDashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["ua", "dashboard"], queryFn: getUaDashboard });
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });

  if (!dashboard) return <div className="p-6">Loading...</div>;

  const stats = [
    { label: "Locations", value: dashboard.locations },
    { label: "Avg rating", value: dashboard.avgRating },
    { label: "Comments", value: dashboard.comments },
    { label: "Seats available", value: dashboard.seatsAvailable },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-orange-500 px-6 pb-6 pt-12 text-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-90">{dashboard.university} · Admin</p>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-2 text-base font-semibold text-slate-900">Recent comments</p>
          <div className="space-y-3">
            {comments.slice(0, 2).map((c) => (
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
        <Link
          href="/university-admin/locations/new"
          className="block w-full rounded-2xl bg-orange-500 py-3 text-center font-medium text-white"
        >
          Add location
        </Link>
      </div>
    </div>
  );
}