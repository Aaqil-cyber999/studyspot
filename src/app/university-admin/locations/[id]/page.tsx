"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Armchair, ChevronLeft, ChevronRight, EyeOff, Mic, Pencil, Star, Trash2, ToggleLeft, ToggleRight, Users, Wifi } from "lucide-react";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { CurrentStatusSection } from "@/features/student/components/spot-detail/current-status-section";
import type { LiveMetric } from "@/features/student/types/spot-detail";

export default function UaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const location = useUniversityAdminStore((state) => state.locations.find((item) => item.id === params.id));
  const allComments = useUniversityAdminStore((state) => state.comments);
  const allReports = useUniversityAdminStore((state) => state.reports);
  const comments = useMemo(() => allComments.filter((item) => item.locationId === params.id && item.status === "Visible"), [allComments, params.id]);
  const reports = useMemo(() => allReports.filter((item) => item.locationId === params.id), [allReports, params.id]);
  const toggleLocation = useUniversityAdminStore((state) => state.toggleLocation);
  const deleteLocation = useUniversityAdminStore((state) => state.deleteLocation);
  const moderateComment = useUniversityAdminStore((state) => state.moderateComment);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = useState(false);
  const [commentToHide, setCommentToHide] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E2E8F0] px-6 text-center">
        <div>
          <p className="text-sm text-slate-500">This location could not be found.</p>
          <Link href="/university-admin/locations" className="mt-3 inline-block text-sm font-semibold text-orange-600">
            Back to locations
          </Link>
        </div>
      </div>
    );
  }
  const currentLocation = location;

  // Convert admin location data to student-facing LiveMetric format
  const studentMetrics: LiveMetric[] = [
    {
      id: "seats",
      label: "Seats available",
      value: location.seats === "Yes" ? "Available" : location.seats === "No" ? "Full" : "Unsure",
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
      value: location.wifi,
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
      value: location.crowd,
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
      value: location.noise,
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

  function handleToggle() {
    toggleLocation(currentLocation.id);
    toast.success(currentLocation.status === "Active" ? "Location deactivated" : "Location activated");
  }

  function handleDelete() {
    deleteLocation(currentLocation.id);
    toast.success("Location deleted");
    router.replace("/university-admin/locations");
  }

  return (
    <main className="min-h-screen bg-[#E2E8F0]">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-[#E2E8F0] px-6 pb-4 pt-[16px]">
        <Link href="/university-admin/locations" aria-label="Back to locations" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-[-0.2px] text-slate-900">Location details</h1>
        </div>
        <Link href={`/university-admin/locations/${location.id}/edit`} aria-label={`Edit ${location.name}`} className="flex shrink-0 items-center gap-1.5 rounded-[12px] bg-[#f97316] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
          <Pencil className="size-4 text-white" aria-hidden="true" />
          Edit
        </Link>
      </header>

      <div className="space-y-4 px-6 pb-4">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          {location.imageUrls && location.imageUrls.length > 0 ? (
            <div className="relative w-full overflow-hidden bg-[#f8fafc]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={location.imageUrls[Math.min(currentIdx, location.imageUrls.length - 1)]} alt={`Photo ${Math.min(currentIdx, location.imageUrls.length - 1) + 1} of ${location.imageUrls.length}`} className="h-[200px] w-full object-cover" />

              {location.imageUrls.length > 1 && (
                <>
                  <button type="button" onClick={() => setCurrentIdx((idx) => (idx - 1 + location.imageUrls!.length) % location.imageUrls!.length)} aria-label="Previous image" className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
                    <ChevronLeft className="size-[18px]" />
                  </button>
                  <button type="button" onClick={() => setCurrentIdx((idx) => (idx + 1) % location.imageUrls!.length)} aria-label="Next image" className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]">
                    <ChevronRight className="size-[18px]" />
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                    {currentIdx + 1} / {location.imageUrls.length}
                  </span>
                </>
              )}
            </div>
          ) : null}
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{location.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{location.building}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${location.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{location.status}</span>
            </div>
            <p className="text-sm leading-5 text-slate-600">{location.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Star className="size-3 text-amber-500" aria-hidden="true" />
              <span className="font-semibold text-slate-700">{location.rating ? location.rating.toFixed(1) : "New"}</span>
              <span>·</span>
              <span>{location.reviews} student reviews</span>
            </div>
          </div>
        </section>

        <CurrentStatusSection metrics={studentMetrics} lastUpdated={(location.lastUpdated ?? "Reported recently").replace("Updated", "Reported")} showReportButton={false} />

        <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[#0f172a]">Admin actions</h2>
              <p className="mt-0.5 text-[12px] text-[#64748b]">Control how this location is managed</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={`/university-admin/locations/${location.id}/edit`} className="flex min-h-[48px] items-center gap-3 rounded-[16px] bg-[#f97316] px-4 text-[14px] font-medium text-white shadow-[0px_6px_16px_rgba(249,115,22,0.25)] transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                <Pencil className="size-4 text-white" aria-hidden="true" />
              </span>
              <span className="flex-1 text-left">Edit details</span>
              <ChevronRight className="size-4 opacity-80" aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => setStatusToggleOpen(true)} aria-pressed={location.status === "Inactive"} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#fed7aa] bg-[#fff7ed] px-4 text-[14px] font-medium text-[#f97316] transition hover:bg-[#ffedd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px]">{location.status === "Active" ? <ToggleLeft className="size-4 text-[#f97316]" aria-hidden="true" /> : <ToggleRight className="size-4 text-[#f97316]" aria-hidden="true" />}</span>
              <span className="flex-1 text-left">{location.status === "Active" ? "Deactivate location" : "Activate location"}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${location.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{location.status}</span>
            </button>
            <button type="button" onClick={() => setDeleteOpen(true)} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-red-200 bg-red-50 px-4 text-[14px] font-medium text-red-600 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                <Trash2 className="size-4 text-red-600" aria-hidden="true" />
              </span>
              <span className="flex-1 text-left">Delete location</span>
            </button>
          </div>
        </section>

        <section>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent student reviews</h2>
              <p className="mt-0.5 text-xs text-slate-400">{comments.length} reviews</p>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-0.5 text-xs font-semibold text-amber-500" aria-label={`${Math.round(comment.rating)} out of 5 stars`}>
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className={`size-3 ${index < Math.round(comment.rating) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-[#e2e8f0] text-[#e2e8f0]"}`} aria-hidden="true" />
                    ))}
                  </p>
                  <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">&ldquo;{comment.text}&rdquo;</p>
                <button type="button" onClick={() => setCommentToHide(comment.id)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <EyeOff className="h-3.5 w-3.5" /> Hide review
                </button>
              </div>
            ))}
            {comments.length === 0 ? <div className="text-center text-sm text-slate-500">No reviews yet.</div> : null}
          </div>
        </section>
      </div>
      <AdminConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title={`Delete ${currentLocation.name}?`} description="This permanently removes the location and its associated reports and comments. This action cannot be undone." confirmLabel="Delete location" destructive onConfirm={handleDelete} />
      <AdminConfirmDialog
        open={statusToggleOpen}
        onOpenChange={setStatusToggleOpen}
        title={`Deactivate ${currentLocation.name}?`}
        description="Students will no longer see this location in their search results. You can reactivate it at any time."
        confirmLabel="Deactivate"
        onConfirm={() => {
          handleToggle();
          setStatusToggleOpen(false);
        }}
      />
      <AdminConfirmDialog
        open={commentToHide !== null}
        onOpenChange={(open) => {
          if (!open) setCommentToHide(null);
        }}
        title="Hide this comment?"
        description="Students will no longer see this review, but it will remain available to Admins."
        confirmLabel="Hide review"
        onConfirm={() => {
          if (commentToHide) {
            moderateComment(commentToHide, "Hidden");
            toast.success("Review hidden");
          }
          setCommentToHide(null);
        }}
      />
    </main>
  );
}
