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
      iconClass: "bg-orange-100 text-orange-600",
      href: "/university-admin/locations",
    },
    {
      label: "Average rating",
      value: dashboard.avgRating.toFixed(1),
      detail: "Out of 5.0",
      icon: Star,
      iconClass: "bg-amber-100 text-amber-600",
      href: "/university-admin/locations",
    },
    {
      label: "Student comments",
      value: dashboard.comments,
      detail: "12 new this week",
      icon: MessageSquare,
      iconClass: "bg-blue-100 text-blue-600",
      href: "/university-admin/comments",
    },
    {
      label: "Quiet spaces",
      value: quietLocations,
      detail: "Low crowd reported",
      icon: Users,
      iconClass: "bg-emerald-100 text-emerald-600",
      href: "/university-admin/locations",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto flex w-full max-w-[412px] flex-col px-4 pb-8 pt-7">
        <header className="mb-6 flex items-start justify-between">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-orange-600">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Admin overview
            </p>
            <h1 className="truncate text-[25px] font-bold tracking-[-0.5px] text-slate-950">
              Good morning
            </h1>
            <p className="mt-1 truncate text-sm text-slate-500">{dashboard.university}</p>
          </div>
          <Link
            href="/university-admin/profile"
            aria-label="Open admin profile"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-[0_8px_18px_rgba(249,115,22,0.28)] transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            UA
          </Link>
        </header>

        <section className="order-2 mb-5 rounded-2xl border border-orange-100 bg-white p-4 shadow-[0_5px_16px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="grid gap-2 sm:grid-cols-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-orange-500">Daily comparison</p>
              <h2 className="mt-1 text-base font-bold text-slate-900">Study space performance</h2>
            </div>
            <div className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
              All factors
            </div>
          </div>
          <div className="divide-y divide-orange-100">
            <Link
              href={`/university-admin/locations/${bestLocation.id}`}
              className="group block w-full min-w-0 pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              aria-label={`Open ${bestLocation.name}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-orange-500">Top match</p>
                  <h3 className="text-sm font-bold leading-5 text-slate-900">Best place today</h3>
                </div>
                <div className="rounded-md bg-orange-100 p-1">
                  <Users className="h-3 w-3 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">{bestLocation.name}</p>
                <span className="shrink-0 text-[11px] font-semibold text-orange-600">{bestLocationScore}/100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${bestLocationScore}%` }} />
              </div>
              <p className="mt-2 truncate text-[10px] text-slate-500">
                Seats {bestLocation.seats} · Wi‑Fi {bestLocation.wifi}
              </p>
            </Link>

            <Link
              href={`/university-admin/locations/${worstLocation.id}`}
              className="group block w-full min-w-0 pt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              aria-label={`Open ${worstLocation.name}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-orange-400">Needs attention</p>
                  <h3 className="text-sm font-bold leading-5 text-slate-900">Lowest score</h3>
                </div>
                <div className="rounded-md bg-orange-50 p-1">
                  <Armchair className="h-3 w-3 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">{worstLocation.name}</p>
                <span className="shrink-0 text-[11px] font-semibold text-orange-500">{worstLocationScore}/100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100">
                <div className="h-full rounded-full bg-orange-300" style={{ width: `${worstLocationScore}%` }} />
              </div>
              <p className="mt-2 truncate text-[10px] text-slate-500">
                Seats {worstLocation.seats} · Wi‑Fi {worstLocation.wifi}
              </p>
            </Link>
          </div>
        </section>

        <div className="order-1 mb-6 grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_5px_16px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconClass}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <p className="text-[23px] font-bold leading-none tracking-tight text-slate-950">{stat.value}</p>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-orange-500" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-700">{stat.label}</p>
                <p className="mt-1 text-[10px] text-slate-400">{stat.detail}</p>
              </Link>
            );
          })}
        </div>

        <section className="order-3 mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_5px_16px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent feedback</h2>
              <p className="mt-0.5 text-xs text-slate-400">What students are saying</p>
            </div>
            <Link
              href="/university-admin/comments"
              className="flex items-center gap-0.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 px-4">
            {comments.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm text-slate-400">No comments yet</div>
            ) : (
              comments.slice(0, 2).map((comment) => (
                <article key={comment.id} className="py-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${
                            index < Math.round(comment.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-100 text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-[11px] font-semibold text-slate-600">{comment.rating.toFixed(1)}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock3 className="h-3 w-3" />
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-sm leading-5 text-slate-700">&ldquo;{comment.text}&rdquo;</p>
                  <p className="mt-2 text-[11px] font-medium text-orange-600">{comment.locationName}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="order-4 rounded-2xl bg-orange-500 p-4 text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)]">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-xl bg-white/20 p-2">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Quick actions</h2>
              <p className="text-[11px] text-orange-100">Keep your spaces up to date</p>
            </div>
          </div>
          <div>
            <Link
              href="/university-admin/locations/new"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
            >
              <Plus className="h-4 w-4" />
              Add location
            </Link>
            <Link
              href="/university-admin/settings/options"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Option management
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
