"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUaLocations, getUaComments } from "@/services/university-admin";
import { ArrowLeft, Pencil } from "lucide-react";

export default function UaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const location = locations.find((l) => l.id === params.id);

  if (!location) return <div className="p-6">Loading...</div>;

  const locComments = comments.filter((c) => c.locationId === location.id);

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="flex items-center gap-3 px-[24px] pb-[16px] pt-[64px]">
        <Link href="/university-admin/locations" className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
          <ArrowLeft className="size-5 text-[#0f172a]" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[20px] font-semibold tracking-[-0.2px] text-[#0f172a]">Location details</h1>
        </div>
        <Link href={`/university-admin/locations/${location.id}/edit`} className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white">
          <Pencil className="size-4 text-[#0f172a]" />
        </Link>
      </div>
      <div className="space-y-[16px] px-[24px] pb-[100px]">
        <div className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div className="h-[150px] w-full bg-gradient-to-br from-orange-100 to-orange-50" />
          <div className="space-y-[10px] p-[16px]">
            <div>
              <p className="text-[18px] font-semibold text-[#0f172a]">{location.name}</p>
              <p className="mt-1 text-[13px] text-[#64748b]">{location.building}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f1f5f9] px-[10px] py-[4px] text-[11px] text-[#475569]">{location.building}</span>
              <span className="rounded-full bg-emerald-50 px-[10px] py-[4px] text-[11px] text-emerald-600">{location.status}</span>
              <span className="flex items-center gap-1 rounded-full bg-[#f1f5f9] px-[10px] py-[4px] text-[11px] text-[#475569]">
                <span className="text-[#f59e0b]">★</span>
                {location.rating} ({location.reviews})
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-[12px] text-[16px] font-semibold text-[#0f172a]">Recent feedback</p>
          <div className="space-y-[12px]">
            {locComments.length === 0 ? (
              <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] text-center text-[13px] text-[#64748b] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                No comments yet.
              </div>
            ) : (
              locComments.map((c) => (
                <div key={c.id} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-[#f59e0b]">
                      {"★".repeat(Math.round(c.rating))}{"☆".repeat(5 - Math.round(c.rating))} {c.rating.toFixed(1)}
                    </p>
                    <p className="text-[12px] text-[#94a3b8]">{c.createdAt}</p>
                  </div>
                  <p className="mt-2 text-[14px] text-[#334155]">&ldquo;{c.text}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}