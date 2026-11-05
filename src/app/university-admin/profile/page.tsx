"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaProfile } from "@/services/university-admin";
import { useAuthStore } from "@/stores/auth-store";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import { useUniversityAdminThemeStore } from "@/stores/university-admin-theme-store";

export default function UaProfilePage() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile } = useQuery({ queryKey: ["ua", "profile"], queryFn: getUaProfile });
  const locations = useUniversityAdminStore((state) => state.locations);
  const comments = useUniversityAdminStore((state) => state.comments);
  const reports = useUniversityAdminStore((state) => state.reports);
  const isDark = useUniversityAdminThemeStore((state) => state.isDark);
  const toggleTheme = useUniversityAdminThemeStore((state) => state.toggleTheme);
  const [editing, setEditing] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");

  if (!profile) {
    return <PageLoader className="min-h-screen bg-slate-50 py-0" />;
  }

  const currentProfile = profile;
  const displayName = name || currentProfile.name;
  const displayEmail = email || currentProfile.email;
  const displayUniversity = university || currentProfile.university;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function startEditing() {
    setName(currentProfile.name);
    setEmail(currentProfile.email);
    setUniversity(currentProfile.university);
    setEditing(true);
  }

  function saveProfile() {
    if (!name.trim() || !email.trim() || !university.trim()) {
      toast.error("Complete all profile fields");
      return;
    }
    setName(name.trim());
    setEmail(email.trim());
    setUniversity(university.trim());
    setEditing(false);
    toast.success("Profile changes saved");
  }

  function cancelEditing() {
    setEditing(false);
    setName("");
    setEmail("");
    setUniversity("");
  }

  function confirmSignOut() {
    signOut();
    toast.success("You have been logged out");
    router.replace("/university-admin/login");
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-16">
        <p className="text-xs font-medium text-orange-600">Account settings</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.3px] text-[#0f172a]">Profile</h1>
      </header>

      <div className="space-y-4 px-6 pb-[120px]">
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="h-20 bg-gradient-to-br from-orange-300 via-orange-100 to-orange-50" />
          <div className="relative px-4 pb-4">
            <div className="-mt-8 flex items-end justify-between">
              <div className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-[#f97316] text-xl font-bold text-white shadow-sm">
                {initials || "UA"}
              </div>
              <button
                type="button"
                onClick={editing ? cancelEditing : startEditing}
                className="flex min-h-9 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <Pencil className="size-3.5" />
                {editing ? "Cancel" : "Edit profile"}
              </button>
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-[#0f172a]">{displayName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]"><Mail className="size-3.5" />{displayEmail}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]"><Building2 className="size-3.5" />{displayUniversity}</p>
            </div>
          </div>
        </section>

        {editing ? (
          <section className="space-y-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <ProfileField label="Full name" value={name} onChange={setName} />
            <ProfileField label="Email address" type="email" value={email} onChange={setEmail} />
            <ProfileField label="University" value={university} onChange={setUniversity} />
            <button type="button" onClick={saveProfile} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
              <Check className="size-4" /> Save changes
            </button>
          </section>
        ) : null}

        <section className="grid grid-cols-3 gap-2">
          <StatCard label="Locations" value={locations.length} />
          <StatCard label="Reports" value={reports.filter((report) => report.status === "Pending").length} />
          <StatCard label="Comments" value={comments.filter((comment) => comment.status === "Visible").length} />
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-[#0f172a]">Preferences</h2>
          <div className="mt-3 divide-y divide-slate-100">
            <PreferenceRow icon={isDark ? <Sun className="size-4" /> : <Moon className="size-4" />} title="Appearance" description={isDark ? "Dark mode is on" : "Light mode is on"}>
              <button type="button" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{isDark ? "Light" : "Dark"}</button>
            </PreferenceRow>
            <PreferenceRow icon={<Bell className="size-4" />} title="Admin notifications" description="Updates about reports and comments">
              <button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications((value) => !value)} className={`relative h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${notifications ? "bg-orange-500" : "bg-slate-300"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></button>
            </PreferenceRow>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-bold text-[#0f172a]">Admin access</h2>
            <p className="mt-1 text-xs text-[#64748b]">Your account has university-level management access.</p>
          </div>
          <AccessRow icon={<ShieldCheck className="size-4" />} label="University administrator" />
          <AccessRow icon={<LockKeyhole className="size-4" />} label="Location and moderation controls" />
        </section>

        <button type="button" onClick={() => setLogoutOpen(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
          <LogOut className="size-4" /> Log out
        </button>
      </div>

      <AdminConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of the Admin portal?"
        description="You will need to sign in again to manage university locations and student feedback."
        confirmLabel="Log out"
        destructive
        onConfirm={confirmSignOut}
      />
    </main>
  );
}

function ProfileField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]"><p className="text-xl font-bold text-orange-600">{value}</p><p className="mt-1 text-[11px] font-medium text-slate-500">{label}</p></div>;
}

function PreferenceRow({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{description}</p></div>{children}<ChevronRight className="size-4 text-slate-300" /></div>;
}

function AccessRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0"><span className="text-orange-600">{icon}</span><span className="text-sm text-slate-700">{label}</span><Check className="ml-auto size-4 text-emerald-500" /></div>;
}
