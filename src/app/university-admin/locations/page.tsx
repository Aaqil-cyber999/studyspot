"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search, Star } from "lucide-react";
import { getUaLocations } from "@/services/university-admin";

export default function UaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
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

      <div className="px-6 pb-[24px]">
        <div className="flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] bg-white px-[16px] py-[12px]">
          <Search className="size-[18px] text-[#64748b]" aria-hidden="true" />
          <input placeholder="Search locations" className="flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]" />
        </div>

        <div className="mt-[20px] space-y-[12px]">
          {locations.length === 0 ? (
            <div className="rounded-[20px] border border-[#e2e8f0] bg-white p-16 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No locations yet</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Add your first study space to get started.</p>
            </div>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="relative group">
                <Link href={`/university-admin/locations/${loc.id}`} aria-label={`View ${loc.name}`} className="block">
                  <article className="flex items-center gap-[16px] rounded-[20px] border border-[#e2e8f0] bg-white p-[16px] transition hover:border-[#fed7aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
                    <div
                      className="relative shrink-0 overflow-hidden bg-[#f1f5f9]"
                      style={{ width: 80, height: 80, borderRadius: 16 }}
                    >
                      {loc.imageUrls?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-[16px] font-semibold leading-5 text-[#0f172a] line-clamp-2">{loc.name}</h2>
                          <p className="mt-[2px] text-[13px] leading-5 text-[#64748b]">{loc.building}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${loc.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"}`}>
                          <span className={`size-2 rounded-full ${loc.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                          {loc.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[#64748b] mt-[4px]">
                        <Star className="size-3 text-[#f59e0b]" aria-hidden="true" />
                        <span>{loc.rating}</span>
                        <span className="mx-[2px]">·</span>
                        <span>{loc.reviews} reviews</span>
                      </div>
                    </div>
                  </article>
                </Link>

                <Link href={`/university-admin/locations/${loc.id}/edit`} aria-label={`Edit ${loc.name}`} className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-[#f1f5f9] transition hover:bg-[#e2e8f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 opacity-0 group-hover:opacity-100">
                  <Pencil className="size-4 text-[#0f172a]" aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
