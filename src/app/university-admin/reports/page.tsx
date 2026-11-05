"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ClipboardList, MessageSquare, Search, Trash2 } from "lucide-react";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";

export default function UaReportsPage() {
  const reports = useUniversityAdminStore((state) => state.reports);
  const moderateReport = useUniversityAdminStore((state) => state.moderateReport);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Dismissed">("All");
  const [reportToRemove, setReportToRemove] = useState<string | null>(null);
  const filteredReports = useMemo(
    () => reports.filter((report) => {
      const matchesQuery = `${report.locationName} ${report.comment}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (filter === "All" || report.status === filter);
    }),
    [filter, query, reports]
  );

  function removeReport(id: string) {
    moderateReport(id, "Dismissed");
    toast.success("Report removed");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-6 pb-4 pt-16">
        <p className="text-xs font-medium text-orange-600">Student submissions</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.3px] text-slate-900">Status reports</h1>
      </div>
      <div className="px-6">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search className="h-[18px] w-[18px] text-slate-400" /><span className="sr-only">Search reports</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports or locations" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["All", "Pending", "Dismissed"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}
        </div>
      </div>
      <div className="space-y-3 px-6 pb-[110px] pt-4">
        {filteredReports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No reports match this filter.</div> : filteredReports.map((report) => (
          <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2"><div className="rounded-xl bg-orange-50 p-2"><ClipboardList className="h-4 w-4 text-orange-600" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{report.locationName}</p><p className="text-[11px] text-slate-400">{report.submittedAt}</p></div></div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${report.status === "Pending" ? "bg-amber-50 text-amber-700" : report.status === "Reviewed" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{report.status}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <span className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">Noise: <b>{report.noise}</b></span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">Crowd: <b>{report.crowd}</b></span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">Seats: <b>{report.seats}</b></span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">Wi-Fi: <b>{report.wifi}</b></span>
            </div>
            {report.comment ? <p className="mt-3 text-sm leading-5 text-slate-600">&ldquo;{report.comment}&rdquo;</p> : null}
            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              <Link href="/university-admin/comments" className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-50 text-xs font-semibold text-orange-700">
                <MessageSquare className="h-3.5 w-3.5" /> Check complaints
              </Link>
              {report.status === "Pending" ? (
                <button type="button" onClick={() => setReportToRemove(report.id)} className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 text-xs font-semibold text-red-600">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <AdminConfirmDialog
        open={reportToRemove !== null}
        onOpenChange={(open) => { if (!open) setReportToRemove(null); }}
        title="Remove this report?"
        description="The report will be marked as dismissed and removed from the pending queue."
        confirmLabel="Remove report"
        destructive
        onConfirm={() => { if (reportToRemove) removeReport(reportToRemove); setReportToRemove(null); }}
      />
    </div>
  );
}
