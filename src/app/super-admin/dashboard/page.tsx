"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { Building2, Users, MapPin, ArrowRight, Star, Inbox } from "lucide-react";
import { getSaOverview } from "@/services/super-admin";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2";

export default function SaDashboardPage() {
  const { data: overview, isPending } = useQuery({
    queryKey: ["sa", "overview"],
    queryFn: getSaOverview,
  });

  if (isPending || !overview) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  const { stats, pendingApprovals, recentReviews } = overview;

  const statCards = [
    { label: "Universities", value: stats.universities, icon: Building2, iconClass: "bg-[#fff7ed] text-[#f97316]", href: "/super-admin/universities" },
    { label: "Admins", value: stats.admins, icon: Users, iconClass: "bg-[#eff6ff] text-[#2563eb]", href: "/super-admin/admins" },
    { label: "Pending requests", value: stats.pendingRequests, icon: Inbox, iconClass: "bg-[#fffbeb] text-[#d97706]", href: "/super-admin/requests" },
    { label: "Locations", value: stats.locations, icon: MapPin, iconClass: "bg-[#ecfdf5] text-[#059669]", href: "/super-admin/locations" },
  ];

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="pb-4">
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className={`group flex flex-col rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition hover:border-[#fed7aa] ${focusRing}`}>
                <div className="flex items-start justify-between">
                  <span className={`flex size-9 items-center justify-center rounded-[12px] ${stat.iconClass}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight className="size-4 text-[#e2e8f0] transition group-hover:text-[#f97316]" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[24px] font-semibold leading-none tracking-[-0.6px] tabular-nums text-[#0f172a]">{stat.value}</p>
                <p className="mt-2 text-[12px] font-medium leading-[16px] text-[#64748b]">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          <section className="rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Requests</p>
                <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">Pending approvals</h2>
              </div>
              <Link href="/super-admin/requests" className="flex min-h-8 items-center gap-0.5 rounded-lg px-1.5 text-[11px] font-semibold text-[#f97316] transition hover:bg-[#fff7ed] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
                View all
              </Link>
            </div>

            <div className="px-6 pb-5">
              {pendingApprovals.length === 0 ? (
                <div className="flex h-20 items-center justify-center text-[13px] text-[#94a3b8]">All requests handled</div>
              ) : (
                <ul className="divide-y divide-[#f1f5f9] border-t border-[#f1f5f9]">
                  {pendingApprovals.map((request) => (
                    <li key={request.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#0f172a]">{request.university}</p>
                        <p className="mt-0.5 truncate text-[12px] text-[#64748b]">
                          {[request.title, request.name].filter(Boolean).join(" ")} · {formatRelative(request.createdAt)}
                        </p>
                      </div>
                      <Link href={`/super-admin/requests/${request.id}`} className="shrink-0 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1.5 text-[11px] font-semibold text-[#c2410c] transition hover:bg-[#ffedd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
                        Review
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Feedback</p>
                <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">Recent reviews</h2>
              </div>
              <Link href="/super-admin/reviews" className="flex min-h-8 items-center gap-0.5 rounded-lg px-1.5 text-[11px] font-semibold text-[#f97316] transition hover:bg-[#fff7ed] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
                View all
              </Link>
            </div>

            <div className="px-6 pb-5">
              {recentReviews.length === 0 ? (
                <div className="flex h-20 items-center justify-center text-[13px] text-[#94a3b8]">No reviews yet</div>
              ) : (
                <ul className="divide-y divide-[#f1f5f9] border-t border-[#f1f5f9]">
                  {recentReviews.map((review) => (
                    <li key={review.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-[#64748b]">
                          <Star className="size-3.5 shrink-0 fill-[#f59e0b] text-[#f59e0b]" aria-hidden="true" />
                          <span className="tabular-nums font-semibold text-[#0f172a]">{Math.round(review.rating)}</span>
                          <span className="mx-1">·</span>
                          <span className="min-w-0 truncate">{review.locationName}</span>
                        </div>
                        <span className="shrink-0 text-[11px] text-[#94a3b8]">{formatRelative(review.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-1 text-[13px] leading-5 text-[#334155]">{review.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}
