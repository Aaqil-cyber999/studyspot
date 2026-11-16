"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ShieldOff, Users } from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useSuperAdminStore } from "@/stores/super-admin-store";

type AdminFilter = "All" | "Active" | "Inactive";

export default function SaAdminsPage() {
  const admins = useSuperAdminStore((state) => state.admins);
  const toggleAdminStatus = useSuperAdminStore((state) => state.toggleAdminStatus);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AdminFilter>("All");
  const [target, setTarget] = useState<{ id: string; name: string; email: string; status: string } | null>(null);
  // Mirror the last opened target so the closing frame doesn't flash
  // "Activate undefined?" during the dialog's exit animation.
  const [shown, setShown] = useState(target);

  function openDialog(next: NonNullable<typeof target>) {
    setTarget(next);
    setShown(next);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredAdmins = useMemo(
    () =>
      admins.filter((admin) => {
        const matchesQuery = !normalizedQuery || `${admin.name} ${admin.email} ${admin.university}`.toLowerCase().includes(normalizedQuery);
        const matchesFilter = filter === "All" || admin.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [admins, filter, normalizedQuery],
  );

  const activeCount = admins.filter((admin) => admin.status === "Active").length;

  function confirmStatusChange() {
    if (!target) return;
    toggleAdminStatus(target.id);
    toast.success(target.status === "Active" ? `${target.name} deactivated` : `${target.name} activated`);
    setTarget(null);
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">University admins</h1>
        <p className="mt-1 text-xs text-[#64748b]">
          {admins.length} admins · {activeCount} active
        </p>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search admins</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search admins, emails or universities" className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400" />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter admins by status">
          {(["All", "Active", "Inactive"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${filter === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-4 pt-3">
        {filteredAdmins.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <Users className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No admins found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">{normalizedQuery ? "Try a different name or email." : "Try another filter."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                <Link href={`/super-admin/admins/${admin.id}`} aria-label={`View ${admin.name}`} className="flex items-center justify-between gap-3 rounded-t-[20px] p-[12px] transition hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f97316]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#fff7ed] text-[13px] font-bold text-[#f97316]" aria-hidden="true">
                        {admin.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(-2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-semibold text-[#0f172a]">{admin.name}</p>
                        <p className="mt-0.5 truncate text-[13px] text-[#64748b]">{admin.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${admin.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"}`}>
                      <span className={`size-2 rounded-full ${admin.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                      {admin.status}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-2.5 py-2">
                  <p className="min-w-0 pl-1 truncate text-[13px] text-[#64748b]">{admin.university}</p>
                  <button type="button" onClick={() => openDialog({ id: admin.id, name: admin.name, email: admin.email, status: admin.status })} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${admin.status === "Active" ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2]" : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]"}`}>
                    {admin.status === "Active" ? <ShieldOff className="size-3" aria-hidden="true" /> : <ShieldCheck className="size-3" aria-hidden="true" />}
                    {admin.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminConfirmDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)} title={shown?.status === "Active" ? "Deactivate admin" : "Activate admin"} description={shown ? (shown.status === "Active" ? `Deactivate ${shown.name}? They will no longer be able to sign in or manage their university.` : `Activate ${shown.name}? They will regain access to their university admin account.`) : ""} confirmLabel={shown?.status === "Active" ? "Deactivate" : "Activate"} destructive={shown?.status === "Active"} onConfirm={confirmStatusChange} />
    </div>
  );
}
