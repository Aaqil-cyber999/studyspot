"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUaLocations } from "@/services/university-admin";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/navigation/admin-page-header";
import { PageLoader } from "@/components/shared/page-loader";

export default function UaLocationsPage() {
  const { data: locations, isLoading } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });
  const [query, setQuery] = useState("");
  if (isLoading || !locations) return <PageLoader className="min-h-screen bg-white py-0" />;
  const filtered = locations.filter((location) => `${location.name} ${location.building}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <AdminPageHeader title="Locations" subtitle="Manage your university study spaces" action={{ href: "/university-admin/locations/new", label: "Add location", icon: Plus }} />
      <main className="space-y-[12px] px-[24px] pt-[4px]">
        <input aria-label="Search locations" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations" className="w-full rounded-[12px] border border-[#e2e8f0] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#fed7aa]" />
        {filtered.length === 0 ? <p className="rounded-[16px] border border-dashed border-[#e2e8f0] p-[24px] text-center text-[13px] text-[#64748b]">No locations found.</p> : filtered.map((loc) => (
          <Link
            key={loc.id}
            href={`/university-admin/locations/${loc.id}`}
            className="block rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-[#f97316]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="truncate text-[15px] font-semibold text-[#0f172a]">{loc.name}</p>
                <p className="mt-[2px] text-[12px] text-[#64748b]">{loc.building}</p>
              </div>
              <span className="rounded-full bg-[#dcfce7] px-[10px] py-[4px] text-[11px] font-medium text-[#166534]">{loc.status}</span>
            </div>
            <p className="mt-[12px] text-[12px] text-[#64748b]">
              <span className="text-[#f59e0b]">★</span> {loc.rating} · {loc.reviews} reviews
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}