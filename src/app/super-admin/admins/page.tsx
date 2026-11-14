"use client";

import { useQuery } from "@tanstack/react-query";
import { getUniversityAdmins } from "@/services/super-admin";
import { UserRound } from "lucide-react";

type UniversityAdmin = {
  id: string;
  name: string;
  email: string;
  university: string;
  status: "Active" | "Inactive";
};

export default function SaAdminsPage() {
  const { data: admins = [] as UniversityAdmin[] } = useQuery({
    queryKey: ["sa", "admins"],
    queryFn: getUniversityAdmins,
  });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">University admins</h1>
            <p className="mt-1 text-xs text-[#64748b]">{admins.length} admins</p>
          </div>
        </div>
      </header>

      <div className="pb-4">
        <div className="space-y-[12px]">
          {admins.length === 0 ? (
            <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No admins yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Approved registration requests appear here.</p>
            </div>
          ) : (
            admins.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between p-[16px]">
                  <div>
                    <p className="text-[16px] font-semibold text-[#0f172a]">{a.name}</p>
                    <p className="mt-1 text-[13px] text-[#64748b]">{a.email}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${
                      a.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"
                    }`}
                  >
                    <span className={`size-2 rounded-full ${a.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                    {a.status}
                  </span>
                </div>
                <div className="border-t border-slate-100 px-4 py-3">
                  <p className="text-[13px] text-[#64748b]">{a.university}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
