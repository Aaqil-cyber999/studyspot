"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GraduationCap, Mail, ShieldCheck, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { useSuperAdminStore } from "@/stores/super-admin-store";

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

export default function SaAdminDetailsPage() {
  const params = useParams<{ id: string }>();
  const admins = useSuperAdminStore((state) => state.admins);
  const toggleAdminStatus = useSuperAdminStore((state) => state.toggleAdminStatus);
  const admin = admins.find((item) => item.id === params.id);
  const [target, setTarget] = useState<{ id: string; name: string; status: string } | null>(null);
  const [shown, setShown] = useState(target);

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E2E8F0] px-4 text-center">
        <div>
          <p className="text-sm text-slate-500">This admin could not be found.</p>
          <Link href="/super-admin/admins" className="mt-3 inline-block text-sm font-semibold text-orange-600">
            Back to admins
          </Link>
        </div>
      </div>
    );
  }

  function openDialog(next: NonNullable<typeof target>) {
    setTarget(next);
    setShown(next);
  }

  function confirmStatusChange() {
    if (!target) return;
    toggleAdminStatus(target.id);
    toast.success(target.status === "Active" ? `${target.name} deactivated` : `${target.name} activated`);
    setTarget(null);
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="flex items-center gap-3 pb-2 pt-[16px]">
        <Link href="/super-admin/admins" aria-label="Back to admins" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Admin info</h1>
        </div>
      </header>

      <div className="space-y-4 pb-4 pt-2">
        {/* Identity */}
        <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[16px] bg-[#fff7ed] text-[18px] font-bold text-[#f97316]" aria-hidden="true">
                {initials(admin.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold text-[#0f172a]">{admin.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-[#64748b]">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  {admin.email}
                </p>
              </div>
            </div>
            <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${admin.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"}`}>
              <span className={`size-2 rounded-full ${admin.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
              {admin.status}
            </span>
          </div>
        </section>

        {/* Details */}
        <section aria-labelledby="admin-details-heading" className="rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <h2 id="admin-details-heading" className="border-b border-slate-100 pb-3 text-[15px] font-semibold text-[#0f172a]">
            Details
          </h2>

          <DetailRow icon={GraduationCap} label="University">
            {admin.university}
          </DetailRow>

          <DetailRow icon={Mail} label="Email address">
            <a href={`mailto:${admin.email}`} className="break-all text-[#c2410c] underline underline-offset-2 hover:text-[#9a3412]">
              {admin.email}
            </a>
          </DetailRow>

          <DetailRow icon={admin.status === "Active" ? ShieldCheck : ShieldOff} label="Account status">
            {admin.status}
          </DetailRow>
        </section>

        {/* Activate / deactivate */}
        <button type="button" onClick={() => openDialog({ id: admin.id, name: admin.name, status: admin.status })} className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${admin.status === "Active" ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2]" : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]"}`}>
          {admin.status === "Active" ? <ShieldOff className="size-4" aria-hidden="true" /> : <ShieldCheck className="size-4" aria-hidden="true" />}
          {admin.status === "Active" ? "Deactivate admin" : "Activate admin"}
        </button>
      </div>

      <AdminConfirmDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)} title={shown?.status === "Active" ? "Deactivate admin" : "Activate admin"} description={shown ? (shown.status === "Active" ? `Deactivate ${shown.name}? They will no longer be able to sign in or manage their university.` : `Activate ${shown.name}? They will regain access to their university admin account.`) : ""} confirmLabel={shown?.status === "Active" ? "Deactivate" : "Activate"} destructive={shown?.status === "Active"} onConfirm={confirmStatusChange} />
    </div>
  );
}
