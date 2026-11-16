"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Building2, ChevronRight, Clock3, MessageSquare, Search, Star, TrendingUp, User, Users } from "lucide-react";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaComments, getUaDashboard, getUaLocations } from "@/services/university-admin";

const card = "rounded-[20px] border border-[#eef1f5] shadow-[0_2px_10px_rgba(15,23,42,0.03)]";
const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]";
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2";

export default function UaDashboardPage() {
  const { data: dashboard } = useQuery({
    queryKey: ["ua", "dashboard"],
    queryFn: getUaDashboard,
  });
  const { data: comments = [] } = useQuery({
    queryKey: ["ua", "comments"],
    queryFn: getUaComments,
  });
  const { data: locations = [] } = useQuery({
    queryKey: ["ua", "locations"],
    queryFn: getUaLocations,
  });

  if (!dashboard || locations.length === 0) {
    return <PageLoader className="min-h-screen bg-[#f8fafc] py-0" />;
  }

  const quietLocations = locations.filter((location) => location.crowd === "Low").length;

  const stats = [
    {
      label: "Total locations",
      value: dashboard.locations,
      detail: "Across all faculties",
      icon: Building2,
      iconClass: "bg-[#fff7ed] text-[#f97316]",
      href: "/university-admin/locations",
    },
    {
      label: "Average rating",
      value: dashboard.avgRating.toFixed(1),
      detail: "Out of 5.0",
      icon: Star,
      iconClass: "bg-[#fffbeb] text-[#d97706]",
      href: "/university-admin/locations",
    },
    {
      label: "Student comments",
      value: dashboard.comments.toLocaleString("en-US"),
      detail: "From student reviews",
      icon: MessageSquare,
      iconClass: "bg-[#eff6ff] text-[#2563eb]",
      href: "/university-admin/comments",
    },
    {
      label: "Quiet spaces",
      value: quietLocations,
      detail: "Low crowd reported",
      icon: Users,
      iconClass: "bg-[#ecfdf5] text-[#059669]",
      href: "/university-admin/locations",
    },
  ];

  // Top searches: sort locations by review count (popularity) then by rating
  const topSearches = [...locations]
    .sort((a, b) => {
      if (b.reviews !== a.reviews) return b.reviews - a.reviews;
      return b.rating - a.rating;
    })
    .slice(0, 5);

  function formatShortTime(time: string): string {
    const match = time.match(/(\d+)\s*(day|days|week|weeks|hour|hours|minute|minutes|month|months)/i);
    if (match) {
      const num = match[1];
      const unit = match[2].toLowerCase();
      if (unit.startsWith("day")) return `${num}d`;
      if (unit.startsWith("week")) return `${num}w`;
      if (unit.startsWith("hour")) return `${num}h`;
      if (unit.startsWith("minute")) return `${num}m`;
      if (unit.startsWith("month")) return `${num}mo`;
    }
    return time.split(" ")[0] || time;
  }

  return (
    <main className="min-h-screen bg-[#E2E8F0] text-slate-900">
      <div className="relative h-[200px] bg-[#f97316]">
        <div className="px-[24px] pt-[20px]">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">Good morning</h1>
              <p className="truncate text-[14px] leading-[20px] text-white/90">{dashboard.university}</p>
            </div>
            <Link href="/university-admin/profile" aria-label="Open admin profile" className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] border-2 border-white bg-white text-[13px] font-bold text-[#f97316] transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]">
              UA
            </Link>
          </div>
        </div>
      </div>

      <div className="relative -mt-[110px] flex w-full flex-col gap-5 rounded-t-[40px] bg-[#E2E8F0] px-[24px] pb-[24px] pt-[20px]">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className={`group flex flex-col rounded-[18px] border border-[#eef1f5] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-[#fed7aa] hover:shadow-[0_14px_26px_-18px_rgba(15,23,42,0.35)] ${focusRing}`}>
                <div className="flex items-start justify-between">
                  <span className={`flex size-8 items-center justify-center rounded-[10px] ${stat.iconClass}`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#cbd5e1] transition group-hover:text-[#f97316]" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[24px] font-semibold leading-none tracking-[-0.6px] tabular-nums text-[#0f172a]">{stat.value}</p>
                <p className="mt-2 text-[12px] font-medium leading-[16px] text-[#334155]">{stat.label}</p>
                <p className="mt-0.5 text-[10px] leading-[14px] text-[#475569]">{stat.detail}</p>
              </Link>
            );
          })}
        </div>

        <section className={`${card} bg-white`}>
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#475569]">Top searches</p>
              <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">Most searched study spaces</h2>
            </div>
            <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-medium text-[#c2410c]">By popularity</span>
          </div>

          <div className="mt-4 px-5 pb-5">
            {topSearches.map((location, index) => (
              <div key={location.id}>
                {index > 0 ? <div className="my-3 h-px bg-[#f1f5f9]" /> : null}
                <Link href={`/university-admin/locations/${location.id}`} aria-label={`Open ${location.name}`} className={`group block ${focusRing}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fff7ed] text-[#f97316]">
                      <TrendingUp className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#475569]">#{index + 1}</p>
                      <p className="truncate text-[13px] font-semibold leading-[18px] text-[#0f172a] transition-colors group-hover:text-[#f97316]">{location.name}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Search className="size-3 text-[#94a3b8]" aria-hidden="true" />
                          <span className="text-[13px] font-bold tabular-nums text-[#0f172a]">{location.reviews}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" aria-hidden="true" />
                          <span className="text-[10px] font-medium tabular-nums text-[#64748b]">{location.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={`${card} bg-white`}>
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <p className={eyebrow}>Feedback</p>
              <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">Recent feedback</h2>
            </div>
            <Link href="/university-admin/comments" className="flex min-h-8 items-center gap-0.5 rounded-lg px-1.5 text-[11px] font-semibold text-[#f97316] transition hover:bg-[#fff7ed] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
              View all
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-2 flex flex-col gap-3 px-5 pb-4">
            {comments.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-[13px] text-[#94a3b8]">No comments yet</div>
            ) : (
              comments.slice(0, 2).map((comment) => (
                <article key={comment.id} className="rounded-2xl border border-[#eef1f5] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white">
                      <User className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-[#0f172a] truncate min-w-0">{comment.author}</h3>
                        <span className="text-[11px] text-[#94a3b8]">{formatShortTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-[#64748b] truncate">{comment.locationName}</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[19px] text-[#334155] line-clamp-2">&ldquo;{comment.text}&rdquo;</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" aria-hidden="true" />
                    <span className="text-[11px] font-semibold tabular-nums text-[#64748b]">{comment.rating.toFixed(1)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}