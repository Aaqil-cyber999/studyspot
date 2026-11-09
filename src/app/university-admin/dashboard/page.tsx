"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Armchair,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Clock3,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaComments, getUaDashboard, getUaLocations } from "@/services/university-admin";

const card =
  "rounded-[20px] border border-[#eef1f5] shadow-[0_2px_10px_rgba(15,23,42,0.03)]";
const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2";

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

  const scoreLocation = (location: (typeof locations)[number]) => {
    const seatsScore = { Yes: 30, Unsure: 15, No: 0 }[location.seats];
    const wifiScore = { Strong: 20, Medium: 12, Weak: 4 }[location.wifi];
    const crowdScore = { Low: 20, Medium: 12, High: 4 }[location.crowd];
    const ratingScore = (location.rating / 5) * 20;
    const reviewConfidenceScore = Math.min(location.reviews / 100, 1) * 10;

    return seatsScore + wifiScore + crowdScore + ratingScore + reviewConfidenceScore;
  };

  const bestLocation = locations.reduce((best, location) =>
    scoreLocation(location) > scoreLocation(best) ? location : best
  );
  const worstLocation = locations.reduce((worst, location) =>
    scoreLocation(location) < scoreLocation(worst) ? location : worst
  );
  const bestLocationScore = Math.round(scoreLocation(bestLocation));
  const worstLocationScore = Math.round(scoreLocation(worstLocation));
  const quietLocations = locations.filter((location) => location.crowd === "Low").length;

  const stats = [
    {
      label: "Total locations",
      value: dashboard.locations,
      detail: "+2 this month",
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
      value: dashboard.comments,
      detail: "12 new this week",
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

  const comparisons = [
    {
      key: "best",
      tag: "Top match",
      name: bestLocation.name,
      score: bestLocationScore,
      href: `/university-admin/locations/${bestLocation.id}`,
      icon: Users,
      iconClass: "bg-[#fff7ed] text-[#f97316]",
      barClass: "bg-[#f97316]",
      seats: bestLocation.seats,
      wifi: bestLocation.wifi,
    },
    {
      key: "worst",
      tag: "Needs attention",
      name: worstLocation.name,
      score: worstLocationScore,
      href: `/university-admin/locations/${worstLocation.id}`,
      icon: Armchair,
      iconClass: "bg-[#f8fafc] text-[#94a3b8]",
      barClass: "bg-[#fdba74]",
      seats: worstLocation.seats,
      wifi: worstLocation.wifi,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
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

      <div className="relative -mt-[110px] flex w-full flex-col gap-5 rounded-t-[40px] bg-white px-[24px] pb-[24px] pt-[20px]">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`group flex flex-col rounded-[18px] border border-[#eef1f5] bg-[#ddd] p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-[#fed7aa] hover:shadow-[0_14px_26px_-18px_rgba(15,23,42,0.35)] ${focusRing}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex size-8 items-center justify-center rounded-[10px] ${stat.iconClass}`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#cbd5e1] transition group-hover:text-[#f97316]" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[24px] font-semibold leading-none tracking-[-0.6px] tabular-nums text-[#0f172a]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[12px] font-medium leading-[16px] text-[#334155]">{stat.label}</p>
                <p className="mt-0.5 text-[10px] leading-[14px] text-[#475569]">{stat.detail}</p>
              </Link>
            );
          })}
        </div>

        <section className={`${card} bg-[#ddd]`}>
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#475569]">Daily comparison</p>
              <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">
                Study space performance
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-medium text-[#c2410c]">
              All factors
            </span>
          </div>

          <div className="mt-4 px-5 pb-5">
            {comparisons.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.key}>
                  {index > 0 ? <div className="my-4 h-px bg-[#f1f5f9]" /> : null}
                  <Link
                    href={item.href}
                    aria-label={`Open ${item.name}`}
                    className={`group block ${focusRing}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] ${item.iconClass}`}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#475569]">{item.tag}</p>
                        <p className="truncate text-[13px] font-semibold leading-[18px] text-[#0f172a] transition-colors group-hover:text-[#f97316]">
                          {item.name}
                        </p>
                      </div>
                      <p className="shrink-0 text-[15px] font-semibold leading-none tabular-nums text-[#0f172a]">
                        {item.score}
                        <span className="ml-0.5 text-[10px] font-medium text-[#475569]">/100</span>
                      </p>
                    </div>
                    <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-[#f1f5f9]">
                      <div className={`h-full rounded-full ${item.barClass}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <p className="mt-2 text-[10px] leading-[14px] text-[#475569]">
                      Seats {item.seats} · Wi‑Fi {item.wifi}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${card} bg-white`}>
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <p className={eyebrow}>Feedback</p>
              <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">
                Recent feedback
              </h2>
            </div>
            <Link
              href="/university-admin/comments"
              className="flex min-h-8 items-center gap-0.5 rounded-lg px-1.5 text-[11px] font-semibold text-[#f97316] transition hover:bg-[#fff7ed] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              View all
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-2 divide-y divide-[#f1f5f9] px-5 pb-1">
            {comments.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-[13px] text-[#94a3b8]">
                No comments yet
              </div>
            ) : (
              comments.slice(0, 2).map((comment) => (
                <article key={comment.id} className="py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`size-3 ${
                            index < Math.round(comment.rating)
                              ? "fill-[#f59e0b] text-[#f59e0b]"
                              : "fill-[#f1f5f9] text-[#e2e8f0]"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="ml-1.5 text-[10px] font-semibold tabular-nums text-[#64748b]">
                        {comment.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
                      <Clock3 className="size-3" aria-hidden="true" />
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-[19px] text-[#334155]">&ldquo;{comment.text}&rdquo;</p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-[#f97316]">
                    {comment.locationName}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className={`${card} bg-white p-5`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[12px] bg-[#fff7ed] text-[#f97316]">
              <Plus className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className={eyebrow}>Shortcuts</p>
              <h2 className="mt-0.5 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">
                Quick actions
              </h2>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/university-admin/locations/new"
              className={`flex h-11 items-center justify-center gap-1.5 rounded-[14px] bg-[#f97316] text-[12px] font-semibold text-white transition hover:bg-[#ea580c] ${focusRing}`}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add location
            </Link>
            <Link
              href="/university-admin/settings/options"
              className={`flex h-11 items-center justify-center gap-1.5 rounded-[14px] border border-[#fed7aa] bg-[#fff7ed] text-[12px] font-semibold text-[#c2410c] transition hover:bg-[#ffedd5] ${focusRing}`}
            >
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Options
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
