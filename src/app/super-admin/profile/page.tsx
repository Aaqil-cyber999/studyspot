"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { me, logout, updateProfile, updateProfileImage } from "@/services/auth";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Mail } from "lucide-react";
import { EditProfileDialog } from "@/features/university-admin/components/edit-profile-dialog";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";

export default function SaProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["sa", "profile"], queryFn: me });
  // Local overrides set by saveProfile; cleared values fall back to the server profile.
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const signOut = useAuthStore((state) => state.signOut);

  if (!profile) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0] py-0" />;
  }

  const displayName = savedName ?? profile.name;
  const displayImage = savedImage ?? profile.profileImg;
  const currentName = profile.name;
  const currentImage = profile.profileImg;

  async function confirmSignOut() {
    try {
      await logout();
    } catch {
      // Sign the user out locally even if the session could not be revoked.
    }
    signOut();
    toast.success("You have been logged out");
    // Full document load: never reuse a cached client page after sign-out.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  }

  async function saveProfile({ name: nextName, image: nextImage }: { name: string; image: string | null }) {
    setSavedName(nextName);
    setSavedImage(nextImage);
    try {
      if (nextName !== currentName) {
        await updateProfile({ name: nextName });
      }
      if (nextImage !== currentImage) {
        await updateProfileImage(nextImage);
      }
      await queryClient.invalidateQueries({ queryKey: ["sa", "profile"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
    }
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
          </div>
        </div>
      </header>

      <div className="space-y-4 pb-[90px]">
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
          <div className="relative px-4 pb-4">
            <div className="-mt-8 flex items-end justify-between">
              <ProfileAvatar name={displayName} imageUrl={displayImage} className="size-16 border-4 border-white shadow-sm" textClassName="text-xl" />
              <EditProfileDialog
                name={displayName}
                image={displayImage}
                onSave={saveProfile}
                triggerClassName="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                triggerTextClassName="text-xs font-semibold"
              />
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-[#0f172a]">{displayName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
                <Mail className="size-3.5" aria-hidden="true" />
                {profile.email}
              </p>
            </div>
          </div>
        </section>

        <button type="button" onClick={() => setLogoutOpen(true)} className="flex h-[39px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-slate-300 bg-slate-300 px-[10px] py-[6px] text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-slate-400 focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="student-invert size-[16px] max-w-none" src="/assets/profile/a7c4a.svg" />
          Log out
        </button>
      </div>

      <AdminConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of the Super Admin portal?" description="You will need to sign in again to manage the platform." confirmLabel="Log out" onConfirm={confirmSignOut} />
    </div>
  );
}
