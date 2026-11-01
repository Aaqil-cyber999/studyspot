"use client";

import { useQuery } from "@tanstack/react-query";
import { getUniversities } from "@/services/super-admin";

export default function SaUniversitiesPage() {
  const { data: universities = [] } = useQuery({ queryKey: ["sa", "universities"], queryFn: getUniversities });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Universities</h1>
      </div>
      <div className="space-y-3 p-4">
        {universities.map((u) => (
          <div key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{u.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {u.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Admin: {u.admin ?? "—"} · {u.locations} locations
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}