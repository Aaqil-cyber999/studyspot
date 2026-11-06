"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUaLocations } from "@/services/university-admin";
import { Pencil, Plus } from "lucide-react";

export default function UaLocationsPage() {
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="px-[24px] pb-[16px] pt-[32px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">My locations</h1>
      </div>
      <div className="px-[24px]">
        <div className="flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] bg-white px-[16px] py-[12px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.25" cy="8.25" r="5.25" stroke="#64748b" strokeWidth="1.5" />
            <path d="M12.375 12.375L15 15" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input placeholder="Search locations" className="flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]" />
        </div>
        <div className="mt-[12px] flex gap-[8px]">
          <button className="rounded-full bg-[#f97316] px-[14px] py-[6px] text-[12px] font-medium text-white">All</button>
          <button className="rounded-full border border-[#e2e8f0] bg-white px-[14px] py-[6px] text-[12px] text-[#334155]">Library</button>
          <button className="rounded-full border border-[#e2e8f0] bg-white px-[14px] py-[6px] text-[12px] text-[#334155]">Labs</button>
        </div>
      </div>
      <div className="mt-[16px] space-y-[12px] px-[24px] pb-[100px]">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
          >
            <Link href={`/university-admin/locations/${loc.id}`} className="block">
            <div className="h-[150px] w-full bg-gradient-to-br from-orange-100 to-orange-50" />
            <div className="space-y-[8px] p-[16px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[16px] font-semibold text-[#0f172a]">{loc.name}</p>
                  <p className="mt-1 text-[13px] text-[#64748b]">{loc.building}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-[10px] py-[4px] text-[11px] font-medium text-emerald-600">{loc.status}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
                <span className="text-[#f59e0b]">★</span>
                <span>{loc.rating}</span>
                <span>·</span>
                <span>{loc.reviews} reviews</span>
              </div>
            </div>
            </Link>
            <div className="border-t border-slate-100 px-4 py-3">
              <Link
                href={`/university-admin/locations/${loc.id}/edit`}
                aria-label={`Edit ${loc.name}`}
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-50 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <Pencil className="h-4 w-4" />
                Edit location
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/university-admin/locations/new"
        className="fixed bottom-[90px] left-1/2 z-40 flex w-[364px] -translate-x-1/2 items-center justify-center gap-2 rounded-[16px] bg-[#f97316] py-[14px] text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)]"
      >
        <Plus className="size-5" />
        Add location
      </Link>
    </div>
  );
}