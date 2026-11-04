"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaDashboard, getUaComments } from "@/services/university-admin";

export default function UaDashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["ua", "dashboard"], queryFn: getUaDashboard });
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });

  if (!dashboard) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  const stats = [
    { label: "Locations", value: dashboard.locations },
    { label: "Avg rating", value: dashboard.avgRating },
    { label: "Comments", value: dashboard.comments },
    { label: "Seats available", value: dashboard.seatsAvailable },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-[24px] pb-[24px] pt-[64px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Dashboard</h1>
        <p className="mt-1 text-[13px] text-[#64748b]">{dashboard.university} · Admin</p>
      </div>
      <div className="space-y-[20px] px-[24px]">
        <div className="grid grid-cols-2 gap-[12px]">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.label === "Comments" ? "/university-admin/comments" : "/university-admin/locations"}
              className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
            >
              <p className="text-[28px] font-semibold tracking-[-0.3px] text-[#0f172a]">{s.value}</p>
              <p className="mt-1 text-[12px] text-[#64748b]">{s.label}</p>
            </Link>
          ))}
        </div>
        <div>
          <p className="mb-[12px] text-[16px] font-semibold text-[#0f172a]">Recent comments</p>
          <div className="space-y-[12px]">
            {comments.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                href="/university-admin/comments"
                className="block rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
              >
                <p className="text-[13px] font-medium text-[#f59e0b]">
                  {"★".repeat(Math.round(c.rating))}{"☆".repeat(5 - Math.round(c.rating))} {c.rating.toFixed(1)}
                </p>
                <p className="mt-2 text-[14px] text-[#334155]">&ldquo;{c.text}&rdquo;</p>
                <p className="mt-2 text-[12px] text-[#64748b]">
                  {c.locationName} · {c.createdAt}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/university-admin/locations/new"
          className="flex w-full items-center justify-center rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)] transition hover:opacity-95"
        >
          Add a location
        </Link>
      </div>
    </div>
  );
}