"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  LogOut,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { EditProfileDialog } from "@/features/university-admin/components/edit-profile-dialog";
import { getUaProfile } from "@/services/university-admin";
import { useAuthStore } from "@/stores/auth-store";
import { useUniversityAdminThemeStore } from "@/stores/university-admin-theme-store";

export default function UaProfilePage() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: getUaProfile });
  const isDark = useUniversityAdminThemeStore((state) => state.isDark);
  const toggleTheme = useUniversityAdminThemeStore((state) => state.toggleTheme);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
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
    <main className="bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
      </header>

      <div className="space-y-4 px-6 pb-[90px]">
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
          <div className="relative px-4 pb-4">
            <div className="-mt-8 flex items-end justify-between">
              <ProfileAvatar
                name={displayName}
                imageUrl={image}
                className="size-16 border-4 border-white shadow-sm"
                textClassName="text-xl"
              />
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
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]"><Mail className="size-3.5" />{displayEmail}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]"><Building2 className="size-3.5" />{displayUniversity}</p>
            </div>
          </div>
        </section>

        <section id="admin-settings" className="scroll-mt-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div>
            <h2 className="text-sm font-bold text-[#0f172a]">Settings</h2>
            <p className="mt-1 text-xs text-[#64748b]">Personalize your Admin workspace.</p>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            <PreferenceRow icon={isDark ? <Sun className="size-4" /> : <Moon className="size-4" />} title="Appearance" description={isDark ? "Dark mode is on" : "Light mode is on"}>
              <button type="button" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{isDark ? "Light" : "Dark"}</button>
            </PreferenceRow>
            <PreferenceRow icon={<Bell className="size-4" />} title="Admin notifications" description="Updates about reports and comments">
              <button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications((value) => !value)} className={`relative h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${notifications ? "bg-orange-500" : "bg-slate-300"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></button>
            </PreferenceRow>
          </div>
        </section>

        <button type="button" onClick={() => setLogoutOpen(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#fed7aa] bg-[#fff7ed] text-sm font-semibold text-[#f97316] transition hover:bg-[#ffedd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
          <LogOut className="size-4" /> Log out
        </button>
      </div>

      <AdminConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of the Admin portal?"
        description="You will need to sign in again to manage university locations and student feedback."
        confirmLabel="Log out"
        onConfirm={confirmSignOut}
      />
    </main>
  );
}

function PreferenceRow({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <div className="admin-preference-row flex items-center gap-3 rounded-xl px-3 py-3 first:pt-3 last:pb-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{description}</p></div>{children}</div>;
}
