"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Search, Star, MessageSquare, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaLocations, setSaLocationStatus } from "@/services/super-admin";

type StatusFilter = "All" | "Active" | "Inactive";

export default function SaLocationsPage() {
  const queryClient = useQueryClient();
  const { data: locations = [], isPending } = useQuery({
    queryKey: ["sa", "locations"],
    queryFn: getSaLocations,
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Active" | "Inactive" }) =>
      setSaLocationStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sa", "locations"] });
      void queryClient.invalidateQueries({ queryKey: ["sa", "overview"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to update the location."),
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredLocations = useMemo(
    () =>
      locations.filter((location) => {
        const matchesQuery =
          !normalizedQuery ||
          `${location.name} ${location.universityName} ${location.building ?? ""}`.toLowerCase().includes(normalizedQuery);
        const matchesStatus = statusFilter === "All" || location.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [locations, normalizedQuery, statusFilter],
  );

  const activeCount = locations.filter((location) => location.status === "Active").length;

  function toggleStatus(id: string, name: string, status: string) {
    const nextStatus = status === "Active" ? "Inactive" : "Active";
    toggleMutation.mutate(
      { id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(nextStatus === "Active" ? `${name} activated` : `${name} deactivated`),
      },
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Locations</h1>
        <p className="mt-1 text-xs text-[#64748b]">
          {locations.length} locations · {activeCount} active
        </p>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search locations</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, university or building"
            className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 flex gap-2 pb-1" role="group" aria-label="Filter locations by status">
          {(["All", "Active", "Inactive"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={statusFilter === option}
              onClick={() => setStatusFilter(option)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${
                statusFilter === option
                  ? "bg-orange-500 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col pb-4 pt-3">
        {isPending ? (
          <PageLoader className="min-h-[40vh]" />
        ) : filteredLocations.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <MapPin className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No locations found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              {normalizedQuery ? "Try a different name or clear the search." : `No ${statusFilter.toLowerCase()} locations.`}
            </p>
          </div>
        ) : (
          <div className="space-y-[12px]">
            {filteredLocations.map((location) => {
              const open = location.status === "Active"; // location open/closed tracks its own status

              return (
                <div
                  key={location.id}
                  className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-stretch gap-4 p-[14px]">
                    {location.imageUrls[0] ? (
                      <Link
                        href={`/super-admin/locations/${location.id}`}
                        aria-label={`View ${location.name}`}
                        className="shrink-0 self-center rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={location.imageUrls[0]}
                          alt=""
                          className="size-20 rounded-[16px] object-cover sm:size-24"
                        />
                      </Link>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <Link
                        href={`/super-admin/locations/${location.id}`}
                        className="min-w-0 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                      >
                        <p className="truncate text-[16px] font-semibold leading-5 text-[#0f172a]">{location.name}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[12px] leading-4 text-[#64748b]">
                          <MapPin className="size-3.5 shrink-0 text-[#f97316]" aria-hidden="true" />
                          <span className="min-w-0 truncate">
                            {location.universityName}
                            {location.building ? <> · <span className="text-[#94a3b8]">{location.building}</span></> : null}
                          </span>
                        </p>
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] leading-4 text-[#64748b]">
                        <span className="flex items-center gap-1" aria-label={`Rating ${location.rating.toFixed(1)} out of 5`}>
                          <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" aria-hidden="true" />
                          <span className="font-semibold tabular-nums text-[#0f172a]">{location.rating.toFixed(1)}</span>
                        </span>
                        <span className="flex items-center gap-1" aria-label={`${location.reviews} reviews`}>
                          <MessageSquare className="size-3.5 text-[#94a3b8]" aria-hidden="true" />
                          <span className="tabular-nums">{location.reviews} reviews</span>
                        </span>
                        {location.staffMonitored ? (
                          <span className="flex items-center gap-1.5 text-[#15803d]">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Staffed
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-center gap-2">
                      <span
                        className={`inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${
                          location.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"
                        }`}
                      >
                        <span className={`size-2 rounded-full ${location.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                        {location.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStatus(location.id, location.name, location.status)}
                        disabled={toggleMutation.isPending}
                        className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#334155] transition hover:border-[#fed7aa] hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-60"
                      >
                        {location.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
