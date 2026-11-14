"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaProfile } from "@/services/super-admin";

export default function SaProfilePage() {
  const { data: profile } = useQuery({
    queryKey: ["sa", "profile"],
    queryFn: getSaProfile,
  });

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Profile</h1>
      </header>

          {profile ? (
            <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-orange-100">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-orange-700">{profile.name.split(" ")[0][0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{profile.email}</p>
                </div>
              </div>
              <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">
                Update profile information from the admin panel
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm">Loading profile...</p>
            </div>
          )}
    </div>
  );
}