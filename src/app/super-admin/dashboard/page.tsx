"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaDashboard } from "@/services/super-admin";
import {
  Building2,
  MessageSquare,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2";

const statTiles = [
  {
    label: "Universities",
    value: 0,
    icon: Building2,
    iconClass: "bg-[#fff7ed] text-[#f97316]",
    href: "/super-admin/universities",
  },
  {
    label: "Admins",
    value: 0,
    icon: Users,
    iconClass: "bg-[#eff6ff] text-[#2563eb]",
    href: "/super-admin/admins",
  },
  {
    label: "Requests",
    value: 0,
    icon: MessageSquare,
    iconClass: "bg-[#fffbeb] text-[#d97706]",
    href: "/super-admin/requests",
  },
  {
    label: "Locations",
    value: 0,
    icon: MapPin,
    iconClass: "bg-[#ecfdf5] text-[#059669]",
    href: "/super-admin/locations",
  },
];

export default function SaDashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["sa", "dashboard"], queryFn: getSaDashboard });
  if (!dashboard) {
    return <PageLoader className="min-h-screen bg-[#fbfbfc] py-0" />;
  }

  const stats = [
    { ...statTiles[0], value: dashboard.universities },
    { ...statTiles[1], value: dashboard.admins },
    { ...statTiles[2], value: dashboard.requests },
    { ...statTiles[3], value: dashboard.locations },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Dashboard</h1>
            <p className="mt-1 text-xs text-[#64748b]">Super Admin</p>
          </div>
          <Link
            href="/super-admin/profile"
            aria-label="Open profile"
            className="flex size-10 shrink-0 items-center justify-center rounded-[20px] border-2 border-white bg-white text-[13px] font-bold text-[#f97316] transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]"
          >
            SA
          </Link>
        </div>
      </header>

      <div className="pb-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`group flex flex-col rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition hover:border-[#fed7aa] ${focusRing}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex size-9 items-center justify-center rounded-[12px] ${stat.iconClass}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight className="size-4 text-[#e2e8f0] transition group-hover:text-[#f97316]" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[24px] font-semibold leading-none tracking-[-0.6px] tabular-nums text-[#0f172a]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[12px] font-medium leading-[16px] text-[#64748b]">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        <section className="mt-5 rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Feedback</p>
              <h2 className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#0f172a]">
                Recent comments
              </h2>
            </div>
            <Link
              href="/super-admin/comments"
              className="flex min-h-8 items-center gap-0.5 rounded-lg px-1.5 text-[11px] font-semibold text-[#f97316] transition hover:bg-[#fff7ed] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              View all
            </Link>
          </div>

          <div className="mt-2 divide-y divide-[#f1f5f9] px-6 pb-1">
            <div className="flex h-24 items-center justify-center text-[13px] text-[#94a3b8]">
              No comments yet
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
