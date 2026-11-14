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
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Review queue</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Registration requests</h1>
      </header>

          {requests.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">No requests yet</p>
              <p className="mt-1 text-sm">University registration requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.university}</p>
                      <p className="mt-1 text-xs text-slate-500">{r.applicant}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.status === "Pending" ? "bg-amber-50 text-amber-700" : r.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">{r.email} · {r.submittedAt}</p>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}