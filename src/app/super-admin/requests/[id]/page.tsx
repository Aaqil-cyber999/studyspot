"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getRegistrationRequests } from "@/services/super-admin";

export default function SaRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: requests = [] } = useQuery({ queryKey: ["sa", "requests"], queryFn: getRegistrationRequests });
  const request = requests.find((r) => r.id === params.id);

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] px-4 text-center">
        <div>
          <p className="text-sm text-slate-500">This request could not be found.</p>
          <Link href="/super-admin/requests" className="mt-3 inline-block text-sm font-semibold text-orange-600">Back to requests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 flex items-center gap-3 pb-2 pt-0">
        <Link
          href="/super-admin/requests"
          aria-label="Back to requests"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-orange-600">Request details</p>
          <h1 className="truncate text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">{request.university}</h1>
        </div>
      </header>

      <div className="space-y-4 pb-4">
        <section className="rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0f172a]">Applicant</p>
              <p className="mt-1 text-sm text-[#64748b]">{request.applicant}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${request.status === "Pending" ? "bg-[#fff7ed] text-[#c2410c]" : "bg-[#f1f5f9] text-[#475569]"}`}>
              <span className={`size-2 rounded-full ${request.status === "Pending" ? "bg-[#c2410c]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
              {request.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-700">{request.details}</p>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-[#64748b]">
            <span>{request.email}</span>
            <span className="mx-[2px]">·</span>
            <span>Submitted {request.submittedAt}</span>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              toast.success("Request approved");
              router.push("/super-admin/confirmation?state=approved");
            }}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] text-sm font-bold text-white shadow-[0_6px_16px_rgba(21,128,61,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2"
          >
            Approve
          </button>
          <button
            onClick={() => {
              toast.success("Request rejected");
              router.push("/super-admin/confirmation?state=rejected");
            }}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#c2410c] text-sm font-bold text-white shadow-[0_6px_16px_rgba(194,65,12,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] focus-visible:ring-offset-2"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
