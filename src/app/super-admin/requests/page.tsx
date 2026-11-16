"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Search, ChevronRight } from "lucide-react";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaRequests, type ApiRegistrationRequest } from "@/services/super-admin";

type RequestFilter = "All" | "Pending" | "Approved" | "Rejected";

const statusPill = (status: string) =>
  status === "Approved"
    ? "bg-[#f0fdf4] text-[#15803d]"
    : status === "Pending"
      ? "bg-[#fff7ed] text-[#c2410c]"
      : "bg-[#fef2f2] text-[#b91c1c]";

const statusDot = (status: string) =>
  status === "Approved" ? "bg-[#15803d]" : status === "Pending" ? "bg-[#c2410c]" : "bg-[#b91c1c]";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SaRequestsPage() {
  const { data: requests = [], isPending } = useQuery({
    queryKey: ["sa", "requests"],
    queryFn: () => getSaRequests(),
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RequestFilter>("Pending");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const matchesQuery =
          !normalizedQuery ||
          `${request.title ?? ""} ${request.name} ${request.university} ${request.email}`
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesFilter = filter === "All" || request.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [requests, filter, normalizedQuery],
  );

  const pendingCount = requests.filter((request) => request.status === "Pending").length;

  if (isPending) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="pb-4 pt-[16px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Registration requests</h1>
        <p className="mt-1 text-xs text-[#64748b]">
          {requests.length} requests · {pendingCount} pending
        </p>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search requests</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, university or email"
            className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter requests by status">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((item) => (
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

      <div className="pb-4 pt-3">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <Inbox className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No {filter.toLowerCase()} requests</p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              {normalizedQuery ? "Try a different search." : "Try another filter to see more requests."}
            </p>
          </div>
        ) : (
          <div className="space-y-[12px]">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
              >
                <Link
                  href={`/super-admin/requests/${request.id}`}
                  className="block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
                  aria-label={`View registration request from ${[request.title, request.name].filter(Boolean).join(" ")}`}
                >
                  <div className="flex items-center justify-between gap-3 p-[16px]">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#fff7ed] text-[13px] font-bold text-[#f97316]" aria-hidden="true">
                        {initials(request.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-semibold leading-5 text-[#0f172a]">
                          {[request.title, request.name].filter(Boolean).join(" ")}
                        </p>
                        <p className="mt-0.5 truncate text-[13px] text-[#64748b]">{request.email}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${statusPill(request.status)}`}>
                        <span className={`size-2 rounded-full ${statusDot(request.status)}`} aria-hidden="true" />
                        {request.status}
                      </span>
                      <ChevronRight className="size-4 text-[#cbd5e1]" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-[13px] font-medium text-[#64748b]">{request.university}</p>
                    <span className="shrink-0 text-[12px] text-[#94a3b8]">{formatRelative(request.createdAt)}</span>
                  </div>
                  {request.note ? (
                    <p className="mt-1 line-clamp-1 truncate text-[12px] text-[#94a3b8]">&ldquo;{request.note}&rdquo;</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}
