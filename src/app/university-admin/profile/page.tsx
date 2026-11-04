"use client";

import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaProfile } from "@/services/university-admin";
import { Settings } from "lucide-react";
import toast from "react-hot-toast";

export default function UaProfilePage() {
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: getUaProfile });
  if (!profile) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-[24px] pb-[16px] pt-[64px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
      </div>
      <div className="space-y-[16px] px-[24px] pb-[100px]">
        <div className="flex items-center gap-[16px] rounded-[20px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex size-[56px] items-center justify-center rounded-full bg-[#f97316] text-[18px] font-semibold text-white">
            UA
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-[#0f172a]">{profile.name}</p>
            <p className="mt-1 text-[13px] text-[#64748b]">{profile.email}</p>
            <p className="mt-1 text-[12px] text-[#94a3b8]">{profile.university}</p>
          </div>
          <button className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
            <Settings className="size-5 text-[#475569]" />
          </button>
        </div>
        <button
          onClick={() => toast.success("Profile changes saved")}
          className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)]"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}