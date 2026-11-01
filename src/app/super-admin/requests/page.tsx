"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationRequests } from "@/services/super-admin";

export default function SaRequestsPage() {
  const { data: requests = [] } = useQuery({ queryKey: ["sa", "requests"], queryFn: getRegistrationRequests });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Registration Requests</h1>
      </div>
      <div className="space-y-3 p-4">
        {requests.map((r) => (
          <Link
            key={r.id}
            href={`/super-admin/requests/${r.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{r.university}</p>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">{r.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{r.applicant} · {r.email}</p>
            <p className="text-xs text-slate-400">{r.submittedAt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}