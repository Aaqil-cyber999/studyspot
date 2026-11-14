"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationRequests } from "@/services/super-admin";
import { ArrowLeft } from "lucide-react";

export default function SaRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: requests = [] } = useQuery({ queryKey: ["sa", "requests"], queryFn: getRegistrationRequests });
  const request = requests.find((r) => r.id === params.id);

  if (!request) return <div className="min-h-screen bg-slate-100 px-5 pt-20 text-sm text-slate-500 sm:px-8 lg:px-10 lg:pt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <div className="mb-8 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900">
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-primary">Review queue</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Request details</h1>
        </div>
      </div>
      <div className="max-w-3xl space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-900">{request.university}</p>
          <p className="mt-1 text-sm text-slate-500">{request.applicant}</p>
          <p className="text-xs text-slate-400">{request.email}</p>
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">{request.details}</p>
          <p className="mt-2 text-xs text-slate-400">Submitted {request.submittedAt}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/super-admin/confirmation?state=approved")}
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            Approve
          </button>
          <button
            onClick={() => router.push("/super-admin/confirmation?state=rejected")}
            className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}