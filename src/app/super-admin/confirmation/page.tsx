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
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="flex flex-col items-center justify-center bg-[#fbfbfc] px-4 py-4 text-center">
        {approved ? (
          <CheckCircle2 className="size-16 text-[#15803d]" />
        ) : (
          <XCircle className="size-16 text-[#c2410c]" />
        )}
        <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">
          {approved ? "Request approved" : "Request rejected"}
        </h1>
        <p className="mt-2 text-[13px] text-[#64748b]">
          {approved ? "The registration request has been approved." : "The registration request has been rejected."}
        </p>
        <Link
          href="/super-admin/requests"
          className="mt-6 flex min-h-10 w-full max-w-xs items-center justify-center gap-2 rounded-[14px] bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          Back to requests
        </Link>
      </div>
    </div>
  );
}
