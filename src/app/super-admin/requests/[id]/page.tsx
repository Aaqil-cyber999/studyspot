"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Mail, Clock, FileText, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useSuperAdminStore } from "@/stores/super-admin-store";

const statusPill = (status: string) => (status === "Approved" ? "bg-[#f0fdf4] text-[#15803d]" : status === "Pending" ? "bg-[#fff7ed] text-[#c2410c]" : "bg-[#fef2f2] text-[#b91c1c]");

const statusDot = (status: string) => (status === "Approved" ? "bg-[#15803d]" : status === "Pending" ? "bg-[#c2410c]" : "bg-[#b91c1c]");

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function DetailRow({ icon: Icon, label, children }: { icon: typeof GraduationCap; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fff7ed] text-[#f97316]" aria-hidden="true">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{label}</p>
        <div className="mt-0.5 text-[14px] leading-6 text-[#0f172a]">{children}</div>
      </div>
    </div>
  );
}

export default function SaRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requests = useSuperAdminStore((state) => state.requests);
  const approveRequest = useSuperAdminStore((state) => state.approveRequest);
  const rejectRequest = useSuperAdminStore((state) => state.rejectRequest);
  const request = requests.find((item) => item.id === params.id);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  // Mirror the last chosen action so the closing frame of the dialog doesn't flash empty content.
  const [shownAction, setShownAction] = useState(action);

  function openAction(next: "approve" | "reject") {
    setAction(next);
    setShownAction(next);
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E2E8F0] px-4 text-center">
        <div>
          <p className="text-sm text-slate-500">This request could not be found.</p>
          <Link href="/super-admin/requests" className="mt-3 inline-block text-sm font-semibold text-orange-600">
            Back to requests
          </Link>
        </div>
      </div>
    );
  }

  const isPending = request.status === "Pending";
  const fullName = `${request.title} ${request.name}`;

  function confirmAction() {
    if (!request || !action) return;

    if (action === "approve") {
      approveRequest(request.id);
      toast.success("Request approved");
      router.push("/super-admin/confirmation?state=approved");
    } else {
      rejectRequest(request.id);
      toast.success("Request rejected");
      router.push("/super-admin/confirmation?state=rejected");
    }

    setAction(null);
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="flex items-center gap-3 pb-2 pt-[16px]">
        <Link href="/super-admin/requests" aria-label="Back to requests" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Request from {request.university}</h1>
        </div>
      </header>

      <div className="space-y-4 pb-4 pt-2">
        {/* Applicant identity */}
        <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#fff7ed] text-[17px] font-bold text-[#f97316]" aria-hidden="true">
                {initials(request.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold text-[#0f172a]">{fullName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-[#64748b]">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  {request.email}
                </p>
              </div>
            </div>
            <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${statusPill(request.status)}`}>
              <span className={`size-2 rounded-full ${statusDot(request.status)}`} aria-hidden="true" />
              {request.status}
            </span>
          </div>
        </section>

        {/* Application details, mirroring the registration form */}
        <section aria-labelledby="application-heading" className="rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 id="application-heading" className="text-[15px] font-semibold text-[#0f172a]">
              Application
            </h2>
          </div>

          <DetailRow icon={GraduationCap} label="University">
            {request.university}
          </DetailRow>

          <DetailRow icon={Mail} label="Email address">
            <a href={`mailto:${request.email}`} className="break-all text-[#c2410c] underline underline-offset-2 hover:text-[#9a3412]">
              {request.email}
            </a>
          </DetailRow>

          <DetailRow icon={Clock} label="Submitted">
            {request.submittedAt}
          </DetailRow>

          <DetailRow icon={FileText} label="Note from the applicant">
            {request.note ? <blockquote className="rounded-[12px] border border-[#fed7aa] bg-[#fff7ed] p-3 text-[13px] leading-6 text-[#7c2d12]">&ldquo;{request.note}&rdquo;</blockquote> : <span className="text-[13px] text-[#94a3b8]">No note provided.</span>}
          </DetailRow>
        </section>

        {/* Decision actions */}
        {isPending ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => openAction("approve")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#4ade80] bg-[#bbf7d0] text-sm font-semibold text-[#14532d] transition hover:bg-[#86efac] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Approve
              </button>
              <button type="button" onClick={() => openAction("reject")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#f87171] bg-[#fecaca] text-sm font-semibold text-[#7f1d1d] transition hover:bg-[#fca5a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus-visible:ring-offset-2">
                <XCircle className="size-4" aria-hidden="true" />
                Reject
              </button>
            </div>
            <p className="text-center text-[12px] leading-5 text-[#64748b]">Approving creates the university and an admin account for {fullName}.</p>
          </div>
        ) : (
          <p className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-center text-[13px] text-[#64748b]">This request has already been {request.status.toLowerCase()}.</p>
        )}
      </div>

      <AdminConfirmDialog
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
        title={shownAction === "approve" ? "Approve registration" : "Reject registration"}
        description={
          shownAction === "approve"
            ? `Approve ${fullName}'s request for ${request.university}? This creates the university and an admin account for ${request.email}.`
            : `Reject ${fullName}'s request for ${request.university}? They will not be able to sign in or manage the university.`
        }
        confirmLabel={shownAction === "approve" ? "Approve" : "Reject"}
        destructive={shownAction === "reject"}
        onConfirm={confirmAction}
      />
    </div>
  );
}
