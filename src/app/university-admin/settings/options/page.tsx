"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/page-loader";
import {
  getReportOptions,
  type ApiReportOption,
  type ReportOptionCategory,
} from "@/services/university-admin";

const OPTION_CATEGORY_LABELS: Record<ReportOptionCategory, string> = {
  wifi: "Wi-Fi strength",
  noise: "Noise level",
  crowd: "Crowd level",
  seats: "Seating availability",
};
const categories = Object.keys(OPTION_CATEGORY_LABELS) as ReportOptionCategory[];

export default function ReportOptionsPage() {
  const router = useRouter();
  const { data: options = [], isPending } = useQuery({
    queryKey: ["ua", "report-options"],
    queryFn: () => getReportOptions(true),
  });
  const [category, setCategory] = useState<ReportOptionCategory>("wifi");

  const groupedOptions = useMemo(
    () => options.filter((option) => option.category === category).sort((a, b) => a.order - b.order),
    [category, options]
  );

  return (
    <main className="min-h-screen bg-[#E2E8F0]">
      <header className="flex items-center gap-3 px-6 pb-4 pt-[16px]">
        <button type="button" onClick={() => router.back()} aria-label="Back to profile" className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-orange-600">System configuration</p>
          <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Report options</h1>
        </div>
      </header>

      <div className="space-y-4 px-6 pb-[120px]">
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-orange-900">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            Managed by the platform super admin
          </p>
          <p className="mt-1 text-xs leading-5 text-orange-800">The labels in the student status-report form are shared by every university. If an option needs to change, ask your super admin. This page shows what is currently offered.</p>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Report option categories">
          {categories.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${category === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>
              {OPTION_CATEGORY_LABELS[item]}
            </button>
          ))}
        </div>

        {isPending ? (
          <PageLoader className="min-h-[30vh]" />
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">{OPTION_CATEGORY_LABELS[category]}</h2>
                <p className="mt-1 text-xs text-slate-500">{groupedOptions.filter((option) => option.active).length} active — {groupedOptions.filter((option) => !option.active).length} inactive</p>
              </div>
              <Check className="size-4 text-orange-500" />
            </div>

            <ul className="mt-4 space-y-2">
              {groupedOptions.map((option, index) => (
                <li key={option.id} className={`rounded-xl border p-3 ${option.active ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-75"}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[9px] font-semibold text-slate-500">{index + 1}</span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{option.label}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${option.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{option.active ? "Active" : "Inactive"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
