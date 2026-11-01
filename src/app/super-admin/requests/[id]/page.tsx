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

  if (!request) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 bg-white px-4 py-3">
        <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-slate-100">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">Request Details</h1>
      </div>
      <div className="space-y-4 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-900">{request.university}</p>
          <p className="mt-1 text-sm text-slate-500">{request.applicant}</p>
          <p className="text-xs text-slate-400">{request.email}</p>
          <p className="mt-2 text-sm text-slate-600">{request.details}</p>
          <p className="mt-2 text-xs text-slate-400">Submitted {request.submittedAt}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/super-admin/confirmation?state=approved")}
            className="flex-1 rounded-2xl bg-green-500 py-3 font-medium text-white"
          >
            Approve
          </button>
          <button
            onClick={() => router.push("/super-admin/confirmation?state=rejected")}
            className="flex-1 rounded-2xl bg-red-500 py-3 font-medium text-white"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}