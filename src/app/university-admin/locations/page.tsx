"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUaLocations } from "@/services/university-admin";
import { Plus } from "lucide-react";

export default function UaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Locations</h1>
        <Link href="/university-admin/locations/new" className="flex size-9 items-center justify-center rounded-full bg-orange-500 text-white">
          <Plus className="size-5" />
        </Link>
      </div>
      <div className="space-y-3 p-4">
        {locations.map((loc) => (
          <Link
            key={loc.id}
            href={`/university-admin/locations/${loc.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{loc.name}</p>
                <p className="text-xs text-slate-500">{loc.building}</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">{loc.status}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              ⭐ {loc.rating} · {loc.reviews} reviews
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}