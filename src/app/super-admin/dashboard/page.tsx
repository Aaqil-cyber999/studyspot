"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaDashboard } from "@/services/super-admin";

export default function SaDashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["sa", "dashboard"], queryFn: getSaDashboard });
  if (!dashboard) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  const stats = [
    { label: "Universities", value: dashboard.universities },
    { label: "Admins", value: dashboard.admins },
    { label: "Requests", value: dashboard.requests },
    { label: "Locations", value: dashboard.locations },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-orange-500 px-6 pb-6 pt-12 text-white">
        <h1 className="text-2xl font-bold">Platform Dashboard</h1>
        <p className="text-sm opacity-90">Super Admin</p>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={
                s.label === "Universities"
                  ? "/super-admin/universities"
                  : s.label === "Admins"
                  ? "/super-admin/admins"
                  : s.label === "Requests"
                  ? "/super-admin/requests"
                  : "/super-admin/locations"
              }
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </Link>
          ))}
        </div>
        <Link href="/super-admin/comments" className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
          View comments & ratings
        </Link>
      </div>
    </div>
  );
}