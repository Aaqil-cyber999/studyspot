"use client";

import { useQuery } from "@tanstack/react-query";
import { getRegistrationRequests } from "@/services/super-admin";

type SaRequest = {
  id: string;
  university: string;
  applicant: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
};

export default function SaRequestsPage() {
  const { data: requests = [] as SaRequest[] } = useQuery({
    queryKey: ["sa", "requests"],
    queryFn: getRegistrationRequests,
  });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Registration requests</h1>
            <p className="mt-1 text-xs text-[#64748b]">{requests.length} requests</p>
          </div>
        </div>
      </header>

      <div className="pb-4">
        <div className="space-y-[12px]">
          {requests.length === 0 ? (
            <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No requests yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">University registration requests will appear here.</p>
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                <Link href={`/super-admin/requests/${r.id}`} className="block">
                  <div className="flex items-center justify-between p-[16px]">
                    <div>
                      <p className="text-[16px] font-semibold text-[#0f172a]">{r.university}</p>
                      <p className="mt-1 text-[13px] text-[#64748b]">{r.applicant}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${
                        r.status === "Pending" ? "bg-[#fff7ed] text-[#c2410c]" : "bg-[#f1f5f9] text-[#475569]"
                      }`}
                    >
                      <span className={`size-2 rounded-full ${r.status === "Pending" ? "bg-[#c2410c]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                      {r.status}
                    </span>
                  </div>
                </Link>
                <div className="border-t border-slate-100 px-4 py-3">
                  <p className="text-[13px] text-[#64748b]">{r.email} · {r.submittedAt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
