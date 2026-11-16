"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Camera, ChevronRight, Clock, Eye, EyeOff, GraduationCap, Hash, MapPin, MessageSquare, ShieldCheck, ShieldOff, Star, User } from "lucide-react";
import toast from "react-hot-toast";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { CurrentStatusSection } from "@/features/student/components/spot-detail/current-status-section";
import { AmenitiesSection } from "@/features/student/components/spot-detail/amenities-section";
import { OperatingHoursCard } from "@/features/student/components/spot-detail/operating-hours-card";
import { PageLoader } from "@/components/shared/page-loader";
import { getSaLocationById, getSaLocations, getSaLocationReviews, moderateSaReview, setSaLocationStatus } from "@/services/super-admin";
import type { LiveMetric, OperatingHours, SpotAmenity } from "@/features/student/types/spot-detail";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${Math.round(rating)} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <Star key={index} className={`size-3 ${index < Math.round(rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`} aria-hidden="true" />
      ))}
      <span className="ml-1.5 text-[10px] font-semibold tabular-nums text-[#64748b]">{rating.toFixed(1)}</span>
    </span>
  );
}

function OverviewRow({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fff7ed] text-[#f97316]" aria-hidden="true">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{label}</p>
        <div className="mt-0.5 break-words text-[14px] leading-6 text-[#0f172a]">{children}</div>
      </div>
    </div>
  );
}

function relativeTime(iso: string | null): string {
  if (!iso) return "Recently updated";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Updated ${days}d ago`;
}

function metricsFor(seats: string, wifi: string, crowd: string, noise: string): LiveMetric[] {
  return [
    {
      id: "seats",
      label: "Seats available",
      value: seats === "Yes" ? "Available" : seats === "Limited" ? "Limited" : seats === "No" ? "Full" : "Unsure",
      icon: "armchair",
      iconBackground: "rgba(16, 185, 129, 0.14)",
      iconColor: "#10b981",
      segments: [
        { label: "Available", color: "#10b981" },
        { label: "Limited", color: "#19bc86" },
        { label: "Full", color: "#19bc86" },
      ],
    },
    {
      id: "wifi",
      label: "Wi-Fi Strength",
      value: wifi,
      icon: "wifi",
      iconBackground: "rgba(66, 133, 244, 0.14)",
      iconColor: "#4285f4",
      segments: [
        { label: "Strong", color: "#4285f4" },
        { label: "Medium", color: "#498af4" },
        { label: "Weak", color: "#e2e8f0" },
      ],
    },
    {
      id: "crowd",
      label: "Crowd level",
      value: crowd,
      icon: "users",
      iconBackground: "rgba(249, 115, 22, 0.14)",
      iconColor: "#f97316",
      segments: [
        { label: "Low", color: "#f97316" },
        { label: "Medium", color: "#e2e8f0" },
        { label: "High", color: "#e2e8f0" },
      ],
    },
    {
      id: "noise",
      label: "Noise level",
      value: noise,
      icon: "volume",
      iconBackground: "rgba(139, 92, 246, 0.14)",
      iconColor: "#8b5cf6",
      segments: [
        { label: "Quiet", color: "#8b5cf6" },
        { label: "Moderate", color: "#e2e8f0" },
        { label: "Loud", color: "#e2e8f0" },
      ],
    },
  ];
}

const SEAT_MAP: Record<string, "Available" | "Limited" | "Full" | "Unsure"> = {
  Yes: "Available",
  Limited: "Limited",
  No: "Full",
  Unsure: "Unsure",
};

const AMENITY_ICON: Record<string, { icon: string; width: number; height: number }> = {
  "Wi-Fi": { icon: "/assets/detail/165b6.svg", width: 11.667, height: 15 },
  "Power outlet": { icon: "/assets/detail/c6e1e.svg", width: 18.333, height: 18.333 },
  "Power outlets": { icon: "/assets/detail/c6e1e.svg", width: 18.333, height: 18.333 },
  Computers: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  "Silent zones": { icon: "/assets/detail/f5477.svg", width: 15, height: 15 },
  "Quiet zones": { icon: "/assets/detail/f5477.svg", width: 15, height: 15 },
  "Group work": { icon: "/assets/detail/1f4f4.svg", width: 20, height: 39 },
  "Group study": { icon: "/assets/detail/1f4f4.svg", width: 20, height: 39 },
  "Individual carrels": { icon: "/assets/detail/e70fe.svg", width: 16.667, height: 15 },
  "Reading desks": { icon: "/assets/detail/e70fe.svg", width: 16.667, height: 15 },
  "Print station": { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  Printing: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  Printer: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  Cafeteria: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
};

function amenitiesFromLabels(labels: string[]): SpotAmenity[] {
  return labels.slice(0, 8).map((label) => {
    const meta = AMENITY_ICON[label];
    return {
      label,
      detail: "On-site amenity",
      icon: meta?.icon ?? "/assets/detail/e70fe.svg",
      iconWidth: meta?.width ?? 16.667,
      iconHeight: meta?.height ?? 15,
    };
  });
}

export default function SaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: locations = [], isPending } = useQuery({ queryKey: ["sa", "locations"], queryFn: getSaLocations });
  const location = useMemo(() => locations.find((l) => l.id === params.id), [locations, params.id]);
  const { data: reviews = [] } = useQuery({
    queryKey: ["sa", "location-reviews", params.id],
    queryFn: () => getSaLocationReviews(params.id, true),
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
  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Visible" | "Hidden" }) =>
      moderateSaReview(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sa", "location-reviews", params.id] });
      void queryClient.invalidateQueries({ queryKey: ["sa", "reviews"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to update the review."),
  });
  const [target, setTarget] = useState<{ id: string; name: string; status: string } | null>(null);
  const [shown, setShown] = useState(target);
  const [hideTarget, setHideTarget] = useState<{ id: string; author: string } | null>(null);
  const [shownHide, setShownHide] = useState(hideTarget);

  function openDialog(next: NonNullable<typeof target>) {
    setTarget(next);
    setShown(next);
  }

  function confirmStatusChange() {
    if (!target) return;
    const nextStatus = target.status === "Active" ? "Inactive" : "Active";
    toggleMutation.mutate(
      { id: target.id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(nextStatus === "Active" ? `${target.name} activated` : `${target.name} deactivated`),
      },
    );
    setTarget(null);
  }

  function showReview(id: string) {
    moderateMutation.mutate(
      { id, status: "Visible" },
      { onSuccess: () => toast.success("Review shown") },
    );
  }

  function openHideDialog(review: { id: string; author: string }) {
    setHideTarget(review);
    setShownHide(review);
  }

  function confirmHideReview() {
    if (!hideTarget) return;
    moderateMutation.mutate(
      { id: hideTarget.id, status: "Hidden" },
      { onSuccess: () => toast.success("Review hidden") },
    );
    setHideTarget(null);
  }

  if (isPending) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E2E8F0] px-4 text-center">
        <div>
          <p className="text-sm text-slate-500">This location could not be found.</p>
          <Link href="/super-admin/locations" className="mt-3 inline-block text-sm font-semibold text-orange-600">
            Back to locations
          </Link>
        </div>
      </div>
    );
  }

  const active = location.status === "Active";
  const metrics = metricsFor(
    SEAT_MAP[location.seats ?? "Unsure"] ?? "Unsure",
    location.wifi ?? "Weak",
    location.crowd ?? "Medium",
    location.noise ?? "Moderate",
  );

  // Hours are free-text in the DB — render the card with a sensible single row fallback.
  const fallbackHours: OperatingHours = {
    isOpen: active,
    openLabel: active ? "Open now" : "Closed",
    closesLabel: location.hours ?? "Hours vary",
    peakLabel: "Peak 6–8 PM",
    segments: [
      { label: "Closed 6–8 AM", weight: 38, tone: "closed" },
      { label: "Open 8 AM–6 PM", weight: 188, tone: "open" },
      { label: "Peak 6–8 PM", weight: 37, tone: "peak" },
      { label: "Open 8–10 PM", weight: 38, tone: "open" },
      { label: "Closed 10 PM–12 AM", weight: 37, tone: "closed" },
    ],
    labels: [
      { label: "6 AM", left: 0 },
      { label: "9 AM", left: 12.62 },
      { label: "12 PM", left: 28.71 },
      { label: "3 PM", left: 46.1 },
      { label: "6 PM", left: 62.77 },
      { label: "9 PM", left: 79.43 },
      { label: "12 AM", left: 90.46 },
    ],
  };

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="flex items-center gap-3 pb-2 pt-[16px]">
        <Link href="/super-admin/locations" aria-label="Back to locations" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">{location.name}</h1>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${active ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"}`}>
          <span className={`size-2 rounded-full ${active ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
          {location.status}
        </span>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 pb-6 pt-2 xl:grid-cols-[minmax(0,1fr)_450px]">
        {/* Main column */}
        <div className="space-y-5">
          {/* Hero + about */}
          <section aria-labelledby="location-name" className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <div className="relative w-full overflow-hidden bg-[#f8fafc]">
              {location.imageUrls[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={location.imageUrls[0]} alt={`Study space at ${location.name}`} className="h-52 w-full object-cover sm:h-64" />
              ) : null}
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                <Camera className="size-3.5" aria-hidden="true" />
                {location.imageUrls.length} photos
              </span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 id="location-name" className="text-[20px] font-bold leading-6 text-[#0f172a]">
                    {location.name}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#64748b]">
                    <MapPin className="size-3.5 shrink-0 text-[#f97316]" aria-hidden="true" />
                    <span className="min-w-0 truncate">
                      {location.universityName}{location.building ? ` · ${location.building}` : null}
                    </span>
                  </p>
                </div>
                {location.staffMonitored && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1.5 text-[11px] font-medium text-[#15803d]">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    Staff monitored
                  </span>
                )}
              </div>
              {location.description ? (
                <p className="mt-3 text-[14px] leading-6 text-[#334155]">{location.description}</p>
              ) : null}
            </div>
          </section>

          {/* Operating hours */}
          <OperatingHoursCard hours={fallbackHours} />

          {/* Live metrics */}
          <CurrentStatusSection metrics={metrics} lastUpdated={relativeTime(location.lastUpdated)} showReportButton={false} />

          {/* Amenities */}
          {location.amenities.length > 0 && <AmenitiesSection amenities={amenitiesFromLabels(location.amenities)} />}

          {/* Recent reviews for this location */}
          <section aria-labelledby="location-reviews-heading" className="rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 id="location-reviews-heading" className="text-[16px] font-semibold text-[#0f172a]">Recent reviews</h2>
                <p className="mt-0.5 text-[12px] text-[#64748b]">Students&rsquo; reviews for this location</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#fff7ed] px-3 py-1.5 text-[11px] font-semibold tabular-nums text-[#c2410c]">{location.reviews} total</span>
            </div>

            {reviews.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
                  <MessageSquare className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-medium text-[#0f172a]">No reviews yet</p>
                <p className="mt-1 text-[13px] text-[#64748b]">Reviews students leave for this location will appear here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <li key={review.id} className={`py-4 first:pt-4 last:pb-1 ${review.status === "Hidden" ? "opacity-70" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-[11px] font-bold text-white" aria-hidden="true">
                        {initials(review.authorName ?? "?")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold text-[#0f172a]">{review.authorName}</p>
                          <span className="shrink-0 text-[11px] text-[#94a3b8]">{relativeTime(review.createdAt)}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Stars rating={review.rating} />
                          {review.status === "Hidden" && <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#475569]">Hidden</span>}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">&ldquo;{review.text}&rdquo;</p>
                    <div className="mt-3 flex items-center justify-end">
                      <button type="button" onClick={() => (review.status === "Visible" ? openHideDialog({ id: review.id, author: review.authorName ?? "This student" }) : showReview(review.id))} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${review.status === "Visible" ? "text-red-600 hover:bg-red-50" : "text-orange-600 hover:bg-orange-50"}`}>
                        {review.status === "Visible" ? (
                          <><EyeOff className="size-3.5" aria-hidden="true" /> Hide review</>
                        ) : (
                          <><Eye className="size-3.5" aria-hidden="true" /> Show review</>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Overview */}
          <section aria-labelledby="location-overview-heading" className="rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <h2 id="location-overview-heading" className="text-[15px] font-semibold text-[#0f172a]">Overview</h2>

            <div className="mt-4 flex items-center gap-5">
              <p className="text-[44px] font-bold leading-none tabular-nums text-[#0f172a]">{location.rating.toFixed(1)}</p>
              <div className="min-w-0">
                <span className="flex items-center gap-0.5" aria-label={`${Math.round(location.rating)} out of 5 stars`}>
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className={`size-5 ${index < Math.round(location.rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`} aria-hidden="true" />
                  ))}
                </span>
                <p className="mt-1.5 text-[12px] leading-4 text-[#64748b]">
                  <span className="font-semibold tabular-nums text-[#0f172a]">{location.reviews}</span> student reviews
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-1">
              <OverviewRow icon={MapPin} label="University">{location.universityName}</OverviewRow>
              <OverviewRow icon={Building2} label="Building">{location.building ?? "Not specified"}</OverviewRow>
              <OverviewRow icon={Hash} label="Location ID"><span className="font-mono text-[13px]">{location.id.slice(0, 8)}…</span></OverviewRow>
              <OverviewRow icon={Clock} label="Last updated">{relativeTime(location.lastUpdated)}</OverviewRow>
              <OverviewRow icon={User} label="Staff monitored">{location.staffMonitored ? "Yes — supervised during opening hours" : "No — self-managed space"}</OverviewRow>
            </div>
          </section>

          {/* Admin actions */}
          <section aria-labelledby="location-actions-heading" className="rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
            <h2 id="location-actions-heading" className="text-[15px] font-semibold text-[#0f172a]">Admin actions</h2>
            <p className="mt-0.5 text-[12px] text-[#64748b]">Control how this location is shown to students</p>

            <button type="button" onClick={() => openDialog({ id: location.id, name: location.name, status: location.status })} disabled={toggleMutation.isPending} className={`mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 ${active ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2] focus-visible:ring-[#dc2626]" : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7] focus-visible:ring-[#16a34a]"}`}>
              {active ? <ShieldOff className="size-4" aria-hidden="true" /> : <ShieldCheck className="size-4" aria-hidden="true" />}
              {active ? "Deactivate location" : "Activate location"}
            </button>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#64748b]">{active ? "Deactivating hides this location from students' search results." : "Activating makes this location visible to students again."}</p>

            <Link href="/super-admin/universities" className="mt-4 flex min-h-14 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 transition hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#fff7ed] text-[#f97316]" aria-hidden="true">
                <GraduationCap className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">View university</span>
                <span className="mt-0.5 block truncate text-[13px] font-semibold text-[#0f172a]">{location.universityName}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[#94a3b8]" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>

      <AdminConfirmDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)} title={shown?.status === "Active" ? "Deactivate location" : "Activate location"} description={shown ? (shown.status === "Active" ? `Deactivate ${shown.name}? Students will no longer see this location in their search results.` : `Activate ${shown.name}? Students will be able to see and save this location again.`) : ""} confirmLabel={shown?.status === "Active" ? "Deactivate" : "Activate"} destructive={shown?.status === "Active"} onConfirm={confirmStatusChange} />
      <AdminConfirmDialog open={!!hideTarget} onOpenChange={(open) => !open && setHideTarget(null)} title="Hide review" description={shownHide ? `Hide ${shownHide.author}'s review from students? Only super-admins will still see it, and you can show it again at any time.` : ""} confirmLabel="Hide review" destructive onConfirm={confirmHideReview} />
    </div>
  );
}
