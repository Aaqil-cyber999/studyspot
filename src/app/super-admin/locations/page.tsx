"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaLocations } from "@/services/super-admin";
import { MapPin } from "lucide-react";

type SaLocation = {
  id: string;
  name: string;
  university: string;
  area: string;
  hours: string;
  rating: number;
  reviews: number;
  status: "Active" | "Inactive";
  seats: string;
  wifi: string;
  crowd: string;
  noise: string;
  description: string;
  category: string;
  amenities: string[];
};

export default function SaLocationsPage() {
  const { data: locations = [] as SaLocation[] } = useQuery({
    queryKey: ["sa", "locations"],
    queryFn: getSaLocations,
  });

  return (
    <div className="min-h-screen bg-slate-100 px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Content directory</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Study locations</h1>
      </header>

          {locations.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">No locations yet</p>
              <p className="mt-1 text-sm">Study spaces added by universities appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((l) => (
                <div
                  key={l.id}
                  className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary"><MapPin className="size-5" /></span>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-slate-900">{l.name}</h2>
                        <p className="mt-1 truncate text-xs text-slate-500">{l.university}</p>
                      </div>
                    </div>
                    <div className="ml-3 shrink-0 text-right">
                      <p className="text-xs font-medium text-slate-700">{l.rating} ★</p>
                      <p className="mt-1 text-xs text-slate-500">{l.seats}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}