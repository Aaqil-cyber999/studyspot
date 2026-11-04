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
    { label: "Reviews", value: dashboard.comments },
    { label: "Seats available", value: dashboard.seatsAvailable },
  ];

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <header className="relative h-[200px] overflow-hidden bg-[#f97316]">
      <div className="flex items-center justify-between px-[24px] pt-[20px]">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">Hey, Admin!</h1>
          <p className="truncate text-[14px] leading-[20px] text-white/90">{dashboard.university} · University Admin</p>
        </div>
        <div aria-label="University Admin profile" className="flex size-[40px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-[13px] font-semibold text-[#f97316]">
          UA
        </div>
      </div>
      </header>
      <main className="relative -mt-[110px] rounded-tl-[40px] rounded-tr-[40px] bg-white px-[24px] pt-[16px]">
      <h2 className="sr-only">University administration overview</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
            <p className="text-[24px] font-semibold leading-[29px] text-[#0f172a]">{s.value}</p>
            <p className="text-[12px] text-[#64748b]">{s.label}</p>
          </div>
        ))}
      </div>
      <section className="mt-[20px]">
        <p className="mb-[12px] text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[#0f172a]">Recent reviews</p>
        <div className="space-y-[12px]">
          {comments.slice(0, 2).map((c) => (
            <article key={c.id} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
              <p className="text-[12px] font-medium text-[#f97316]">
                {"★".repeat(Math.round(c.rating))} {c.rating.toFixed(1)}
              </p>
              <p className="mt-[4px] text-[14px] text-[#334155]">&ldquo;{c.text}&rdquo;</p>
              <p className="mt-[4px] text-[12px] text-[#64748b]">
                {c.locationName} · {c.createdAt}
              </p>
            </article>
          ))}
        </div>
      </section>
      <Link
        href="/university-admin/locations/new"
        className="mt-[20px] block w-full rounded-[16px] bg-[#f97316] py-[14px] text-center text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
      >
        Add location
      </Link>
      </main>
    </div>
  );
}