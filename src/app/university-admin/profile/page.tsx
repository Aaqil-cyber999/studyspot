"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Building2, Mail } from "lucide-react";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { SettingsCard } from "@/components/shared/settings-card";
import { EditProfileDialog } from "@/features/university-admin/components/edit-profile-dialog";
import { me, logout, updateProfile, updateProfileImage } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";

export default function UaProfilePage() {
  const queryClient = useQueryClient();
  const signOut = useAuthStore((state) => state.signOut);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: me });
  // Local overrides set by saveProfile; cleared values fall back to the server profile.
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  // undefined = never saved this session (fall back to the server value); null = cleared
  const [savedTitle, setSavedTitle] = useState<string | null | undefined>(undefined);

  if (!profile) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  const displayName = savedName ?? profile.name;
  const displayImage = savedImage ?? profile.profileImg;
  const currentTitle = profile.title ?? null;
  const displayTitle = savedTitle === undefined ? currentTitle : savedTitle;
  // Dotted honorifics for display only ("Dr" → "Dr."); legacy dotted values pass through.
  const TITLE_DISPLAY: Record<string, string> = {
    Mr: "Mr.", Mrs: "Mrs.", Ms: "Ms.", Miss: "Miss", Dr: "Dr.", Prof: "Prof.",
  };
  const displayTitleLabel = displayTitle
    ? TITLE_DISPLAY[displayTitle.replace(/\.\s*$/, "")] ?? displayTitle
    : null;
  const displayEmail = profile.email;
  const displayUniversity = profile.universityName;
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

  async function saveProfile({ name: nextName, image: nextImage, title: nextTitle }: { name: string; image: string | null; title: string | null | undefined }) {
    setSavedName(nextName);
    setSavedImage(nextImage);
    if (nextTitle !== undefined) setSavedTitle(nextTitle);
    try {
      const payload: { name?: string; title?: string | null } = {};
      if (nextName !== currentName) payload.name = nextName;
      if (nextTitle !== undefined && nextTitle !== currentTitle) payload.title = nextTitle;
      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
      }
      if (nextImage !== currentImage) {
        await updateProfileImage(nextImage);
      }
      await queryClient.invalidateQueries({ queryKey: ["ua", "profile"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
    }
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
              <ProfileAvatar name={displayName} imageUrl={displayImage} className="size-16 border-4 border-white shadow-sm" textClassName="text-xl" />
              <EditProfileDialog name={displayName} image={displayImage} title={displayTitle} showTitle onSave={saveProfile} triggerClassName="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2" />
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-[#0f172a]">{displayTitleLabel ? `${displayTitleLabel} ${displayName}` : displayName}</h2>
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

        <button type="button" onClick={() => setLogoutOpen(true)} className="flex h-[39px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-slate-300 bg-slate-300 px-[10px] py-[6px] text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-slate-400 focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="student-invert size-[16px] max-w-none" src="/assets/profile/a7c4a.svg" />
          Sign out
        </button>
      </div>

      <AdminConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of the Admin portal?" description="You will need to sign in again to manage university locations and student feedback." confirmLabel="Log out" onConfirm={confirmSignOut} />
    </main>
  );
}
