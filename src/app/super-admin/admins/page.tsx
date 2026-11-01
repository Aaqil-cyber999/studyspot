"use client";

import { useQuery } from "@tanstack/react-query";
import { getUniversityAdmins } from "@/services/super-admin";

export default function SaAdminsPage() {
  const { data: admins = [] } = useQuery({ queryKey: ["sa", "admins"], queryFn: getUniversityAdmins });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">University Admins</h1>
      </div>
      <div className="space-y-3 p-4">
        {admins.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{a.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs ${a.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {a.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{a.email}</p>
            <p className="text-xs text-slate-400">{a.university}</p>
          </div>
        ))}
      </div>
    </div>
  );
}