"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MapPin, MessageSquare, Plus, Search, Star } from "lucide-react";
import { getUaLocations } from "@/services/university-admin";

type LocationFilter = "Active" | "Inactive";

export default function UaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });
  const [filter, setFilter] = useState<LocationFilter>("Active");

  const filteredLocations = useMemo(
    () => locations.filter((location) => location.status === filter),
    [locations, filter],
  );

  return (
    <div className="min-h-screen bg-[#E2E8F0]">
      <header className="px-6 pb-4 pt-[16px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Locations</h1>
            <p className="mt-.5 text-xs text-[#64748b]">{locations.length} study spaces</p>
          </div>
          <Link href="/university-admin/locations/new" aria-label="Add location" className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
            <Plus className="size-4" aria-hidden="true" />
            Add location
          </Link>
        </div>
      </header>

      <div className="px-6">
        <div className="mb-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <Search className="size-[18px] text-slate-400" />
            <span className="sr-only">Search locations</span>
            <input placeholder="Search locations" className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400" />
          </label>
          <div className="mt-3 flex gap-2">
            {(["Active", "Inactive"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${
                  filter === item
                    ? "bg-orange-500 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={filteredLocations.length === 0 ? "mt-3 flex min-h-[calc(100dvh-280px)] items-center justify-center" : "mt-3 space-y-[12px]"}>
          {filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center px-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
                <MapPin className="size-7" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-medium text-[#0f172a]">No {filter.toLowerCase()} locations</p>
              <p className="mt-1 text-[13px] text-[#64748b]">
                {locations.length === 0 ? "Add your first study space to get started." : "Try the other filter to see more study spaces."}
              </p>
            </div>
          ) : (
            filteredLocations.map((loc) => (
              <article key={loc.id} className="group relative flex items-center gap-[12px] rounded-[20px] border border-[#e2e8f0] bg-white p-[16px] transition hover:border-[#fed7aa]">
                <Link href={`/university-admin/locations/${loc.id}`} aria-label={`View ${loc.name}`} className="flex min-w-0 flex-1 items-center gap-[16px] rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
                  <div className="relative shrink-0 overflow-hidden bg-[#f1f5f9]" style={{ width: 80, height: 80, borderRadius: 16 }}>
                    {loc.imageUrls?.[0] ? (
                      <img
                        alt={`Photo of ${loc.name}`}
                        src={loc.imageUrls[0]}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-semibold leading-5 text-[#0f172a] line-clamp-2">{loc.name}</h2>
                    <p className="mt-[2px] text-[13px] leading-5 text-[#64748b]">{loc.building}</p>
                    <div className="mt-1.5 flex items-center gap-4 text-[12px] leading-4 text-[#64748b]">
                      <span className="flex items-center gap-1" aria-label={`Rating ${Math.round(loc.rating)} out of 5`}>
                        <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" aria-hidden="true" />
                        <span className="font-semibold tabular-nums text-[#0f172a]">{Math.round(loc.rating)}</span>
                      </span>
                      <span className="flex items-center gap-1" aria-label={`${loc.reviews} reviews`}>
                        <MessageSquare className="size-3.5 text-[#94a3b8]" aria-hidden="true" />
                        <span className="tabular-nums">{loc.reviews.toLocaleString("en-US")} reviews</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
