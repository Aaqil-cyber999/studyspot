"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ConfirmationPage() {
  const params = useSearchParams();
  const state = params.get("state");
  const approved = state === "approved";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 py-20 text-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      {approved ? (
        <CheckCircle2 className="mx-auto size-16 text-emerald-500" />
      ) : (
        <XCircle className="mx-auto size-16 text-red-500" />
      )}
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        {approved ? "Request approved" : "Request rejected"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {approved ? "The registration request has been approved." : "The registration request has been rejected."}
      </p>
      <Link
        href="/super-admin/requests"
        className="mx-auto mt-8 block w-full max-w-xs rounded-xl bg-primary py-3.5 font-medium text-white transition hover:bg-primary/90"
      >
        Back to requests
      </Link>
      </div>
    </div>
  );
}