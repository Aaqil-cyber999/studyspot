"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaProfile, updateUaProfile } from "@/services/university-admin";
import { Settings } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPageHeader } from "@/components/navigation/admin-page-header";

export default function UaProfilePage() {
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: getUaProfile });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  if (!profile) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <AdminPageHeader title="Profile" subtitle="Manage your admin account" />
      <main className="space-y-[16px] px-[24px] pt-[4px]">
        <div className="flex items-center gap-[16px] rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex size-[56px] items-center justify-center rounded-full bg-[#f97316] text-[18px] font-bold text-white">
            UA
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[#0f172a]">{profile.name}</p>
            <p className="mt-[2px] text-[13px] text-[#64748b]">{profile.email}</p>
            <p className="mt-[2px] text-[12px] text-[#64748b]">{profile.university}</p>
          </div>
          <button aria-label="Edit profile" onClick={() => { setName(profile.name); setEmail(profile.email); setEditing((value) => !value); }} className="flex size-[36px] items-center justify-center rounded-full bg-[#ddd] text-[#334155]">
            <Settings className="size-5" />
          </button>
        </div>
        {editing ? <div className="space-y-[12px] rounded-[16px] border border-[#e2e8f0] p-[16px]">
          <label className="block text-[13px] font-medium text-[#334155]">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-[6px] w-full rounded-[12px] border border-[#e2e8f0] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f97316]" /></label>
          <label className="block text-[13px] font-medium text-[#334155]">Email<input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-[6px] w-full rounded-[12px] border border-[#e2e8f0] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f97316]" /></label>
        </div> : null}
        <button
          onClick={() => {
            if (editing && name.trim() && email.trim()) {
              void updateUaProfile({ name: name.trim(), email: email.trim() }).then(() => { setEditing(false); toast.success("Profile changes saved"); });
            } else {
              toast.success("Profile changes saved");
            }
          }}
          className="w-full rounded-[16px] bg-[#f97316] py-[14px] text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
        >
          Save changes
        </button>
      </main>
    </div>
  );
}