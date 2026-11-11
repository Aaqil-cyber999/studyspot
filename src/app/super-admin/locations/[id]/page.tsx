"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { getSaLocations } from "@/services/super-admin";

export default function SaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: locations = [] } = useQuery({ queryKey: ["sa", "locations"], queryFn: getSaLocations });
  const location = locations.find((l) => l.id === params.id);

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] px-4 text-center">
        <div>
          <p className="text-sm text-slate-500">This location could not be found.</p>
          <Link href="/super-admin/locations" className="mt-3 inline-block text-sm font-semibold text-orange-600">Back to locations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <header className="px-6 flex items-center gap-3 pb-2 pt-0">
        <Link
          href="/super-admin/locations"
          aria-label="Back to locations"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-orange-600">Location details</p>
          <h1 className="truncate text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">{location.name}</h1>
        </div>
      </header>

      <div className="space-y-4 pb-4">
        <section className="rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0f172a]">University</p>
              <p className="mt-1 text-sm text-[#64748b]">{location.university}</p>
            </div>
            <MapPin className="size-4 text-orange-500" />
          </div>
        </section>
      </div>
    </div>
  );
}
