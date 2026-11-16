"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Building2, LogOut, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { SettingsCard } from "@/components/shared/settings-card";
import { EditProfileDialog } from "@/features/university-admin/components/edit-profile-dialog";
import { getUaProfile } from "@/services/university-admin";
import { useAuthStore } from "@/stores/auth-store";

export default function UaProfilePage() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: getUaProfile });
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (!profile) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  const currentProfile = profile;
  const displayName = name || currentProfile.name;
  const displayEmail = currentProfile.email;
  const displayUniversity = currentProfile.university;

  function confirmSignOut() {
    signOut();
    toast.success("You have been logged out");
    router.replace("/university-admin/login");
  }

  return (
    <main className="bg-[#E2E8F0]">
      <header className="px-6 pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
      </header>

      <div className="space-y-4 px-6 pb-[90px]">
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
          <div className="relative px-4 pb-4">
            <div className="-mt-8 flex items-end justify-between">
              <ProfileAvatar name={displayName} imageUrl={image} className="size-16 border-4 border-white shadow-sm" textClassName="text-xl" />
              <EditProfileDialog
                name={displayName}
                image={image}
                onSave={(values) => {
                  setName(values.name);
                  setImage(values.image);
                }}
                triggerClassName="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              />
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-[#0f172a]">{displayName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
                <Mail className="size-3.5" />
                {displayEmail}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
                <Building2 className="size-3.5" />
                {displayUniversity}
              </p>
            </div>
          </div>
        </section>

        <SettingsCard />


        <button type="button" onClick={() => setLogoutOpen(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#fed7aa] bg-[#fff7ed] text-sm font-semibold text-[#f97316] transition hover:bg-[#ffedd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
          <LogOut className="size-4" /> Log out
        </button>
      </div>

      <AdminConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of the Admin portal?" description="You will need to sign in again to manage university locations and student feedback." confirmLabel="Log out" onConfirm={confirmSignOut} />
    </main>
  );
}
