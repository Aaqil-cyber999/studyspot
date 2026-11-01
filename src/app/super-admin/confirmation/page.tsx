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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      {approved ? (
        <CheckCircle2 className="size-16 text-green-500" />
      ) : (
        <XCircle className="size-16 text-red-500" />
      )}
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        {approved ? "Request approved" : "Request rejected"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {approved ? "The registration request has been approved." : "The registration request has been rejected."}
      </p>
      <Link
        href="/super-admin/requests"
        className="mt-8 w-full max-w-xs rounded-2xl bg-orange-500 py-4 font-medium text-white"
      >
        Back to requests
      </Link>
    </div>
  );
}