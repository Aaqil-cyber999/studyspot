"use client";

import { useQuery } from "@tanstack/react-query";
import { getUniversityAdmins } from "@/services/super-admin";
import { UserRound } from "lucide-react";

type UniversityAdmin = {
  id: string;
  name: string;
  email: string;
  university: string;
  status: "Active" | "Inactive";
};

export default function SaAdminsPage() {
  const { data: admins = [] as UniversityAdmin[] } = useQuery({
    queryKey: ["sa", "admins"],
    queryFn: getUniversityAdmins,
  });

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Access management</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">University admins</h1>
      </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {admins.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-primary"><UserRound className="size-5" /></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{a.university}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">{a.email}</p>
              </div>
            ))}
          </div>
    </div>
  );
}