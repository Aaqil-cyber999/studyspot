"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaProfile } from "@/services/super-admin";
import { Settings } from "lucide-react";
import toast from "react-hot-toast";

export default function SaProfilePage() {
  const { data: profile } = useQuery({ queryKey: ["sa", "profile"], queryFn: getSaProfile });
  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Profile</h1>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
            SA
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
          <button className="flex size-9 items-center justify-center rounded-full bg-slate-100">
            <Settings className="size-5" />
          </button>
        </div>
        <button
          onClick={() => toast.success("Profile changes saved")}
          className="w-full rounded-2xl bg-orange-500 py-3 font-medium text-white"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}