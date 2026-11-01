"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaLocations } from "@/services/super-admin";

export default function SaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["sa", "locations"], queryFn: getSaLocations });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Locations</h1>
      </div>
      <div className="space-y-3 p-4">
        {locations.map((l) => (
          <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{l.name}</p>
            <p className="text-xs text-slate-500">{l.university}</p>
            <p className="text-xs text-slate-400">⭐ {l.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}