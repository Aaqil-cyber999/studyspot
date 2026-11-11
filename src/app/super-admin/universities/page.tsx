"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUniversities } from "@/services/super-admin";

export default function SaUniversitiesPage() {
  const { data: universities = [] } = useQuery({ queryKey: ["sa", "universities"], queryFn: getUniversities });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Universities</h1>
            <p className="mt-1 text-xs text-[#64748b]">{universities.length} universities</p>
          </div>
        </div>
      </header>

      <div className="pb-4">
        <div className="space-y-[12px]">
          {universities.length === 0 ? (
            <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No universities yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Approved registrations appear here.</p>
            </div>
          ) : (
            universities.map((u) => (
              <div key={u.id} className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                <Link href={`/super-admin/universities/${u.id}`} className="block">
                  <div className="flex items-center justify-between p-[16px]">
                    <div>
                      <p className="text-[16px] font-semibold text-[#0f172a]">{u.name}</p>
                      <p className="mt-1 text-[13px] text-[#64748b]">{u.locations} locations</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${
                        u.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#fff7ed] text-[#c2410c]"
                      }`}
                    >
                      <span className={`size-2 rounded-full ${u.status === "Active" ? "bg-[#15803d]" : "bg-[#c2410c]"}`} aria-hidden="true" />
                      {u.status}
                    </span>
                  </div>
                </Link>
                <div className="border-t border-slate-100 px-4 py-3">
                  <p className="text-[13px] text-[#64748b]">Admin: {u.admin ?? "—"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
