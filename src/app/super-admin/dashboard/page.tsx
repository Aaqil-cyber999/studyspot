"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Building2, ClipboardList, MapPin, Users, Sparkles } from "lucide-react";

import { getSaDashboard, getRegistrationRequests } from "@/services/super-admin";

type DashboardStats = {
  universities: number;
  admins: number;
  requests: number;
  locations: number;
};

const statConfig = [
  { key: "universities", label: "Universities", description: "Connected institutions", icon: Building2, href: "/super-admin/universities", tone: "orange" },
  { key: "admins", label: "University admins", description: "Active administrators", icon: Users, href: "/super-admin/admins", tone: "blue" },
  { key: "requests", label: "Open requests", description: "Need your review", icon: ClipboardList, href: "/super-admin/requests", tone: "violet" },
  { key: "locations", label: "Study locations", description: "Published spaces", icon: MapPin, href: "/super-admin/locations", tone: "emerald" },
] as const;

export default function SaDashboardPage() {
  const { data: dashboard, isLoading } = useQuery<DashboardStats>({ queryKey: ["sa", "dashboard"], queryFn: getSaDashboard });
  const { data: requests = [] } = useQuery({ queryKey: ["sa", "requests"], queryFn: getRegistrationRequests });

  if (isLoading || !dashboard) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">SpotWise administration</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Good morning, Super Admin</h1>
          <p className="mt-2 text-sm text-slate-500">Here’s a clear view of what needs your attention today.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          <Sparkles className="size-4 text-primary" />
          System overview
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = dashboard[stat.key];
          return (
            <Link key={stat.key} href={stat.href} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className={`flex size-10 items-center justify-center rounded-xl ${stat.tone === "orange" ? "bg-orange-50 text-orange-600" : stat.tone === "blue" ? "bg-blue-50 text-blue-600" : stat.tone === "violet" ? "bg-violet-50 text-violet-600" : "bg-emerald-50 text-emerald-600"}`}>
                  <Icon className="size-5" />
                </span>
                <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-slate-500" />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Registration requests</h2>
              <p className="mt-1 text-sm text-slate-500">Review the latest university applications.</p>
            </div>
            <Link href="/super-admin/requests" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-6 divide-y divide-slate-100">
            {requests.slice(0, 4).map((request) => (
              <Link key={request.id} href={`/super-admin/requests/${request.id}`} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{request.university}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{request.applicant} · {request.submittedAt}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{request.status}</span>
              </Link>
            ))}
            {requests.length === 0 && <p className="py-4 text-sm text-slate-500">No pending requests.</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-orange-300">Keep SpotWise healthy</p>
          <h2 className="mt-3 max-w-xs text-2xl font-semibold tracking-tight">A better study experience starts with good data.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">Use the workspace to keep institutions, locations, and community feedback accurate.</p>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400" />
            All systems operational
          </div>
        </div>
      </section>
    </div>
  );
}
