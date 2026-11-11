"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getSaLocations } from "@/services/super-admin";

export default function SaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["sa", "locations"], queryFn: getSaLocations });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Locations</h1>
            <p className="mt-1 text-xs text-[#64748b]">{locations.length} locations</p>
          </div>
        </div>
      </header>

      <div className="pb-4">
        <div className="space-y-[12px]">
          {locations.length === 0 ? (
            <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No locations yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Study spaces added by universities appear here.</p>
            </div>
          ) : (
            locations.map((l) => (
              <div key={l.id} className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                <Link href={`/super-admin/locations/${l.id}`} className="block">
                  <div className="flex items-center justify-between p-[16px]">
                    <div>
                      <p className="text-[16px] font-semibold text-[#0f172a]">{l.name}</p>
                      <p className="mt-1 text-[13px] text-[#64748b]">{l.university}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
                      <Star className="size-3 text-[#f59e0b]" aria-hidden="true" />
                      <span>{l.rating}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
