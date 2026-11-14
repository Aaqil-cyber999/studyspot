"use client";

import { useQuery } from "@tanstack/react-query";
import { getUniversities } from "@/services/super-admin";

type University = {
  id: string;
  name: string;
  status: "Active" | "Pending";
  locations: number;
  admin?: string;
};

export default function SaUniversitiesPage() {
  const { data: universities = [] as University[] } = useQuery({
    queryKey: ["sa", "universities"],
    queryFn: getUniversities,
  });

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Institutions</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Universities</h1>
      </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {universities.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{u.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{u.locations} locations</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
    </div>
  );
}