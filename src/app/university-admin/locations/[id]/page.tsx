"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Armchair,
  ChevronRight,
  Clock3,
  EyeOff,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  Wifi,
} from "lucide-react";
import { useUniversityAdminStore } from "@/stores/university-admin-store";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";

export default function UaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const location = useUniversityAdminStore((state) =>
    state.locations.find((item) => item.id === params.id)
  );
  const allComments = useUniversityAdminStore((state) => state.comments);
  const allReports = useUniversityAdminStore((state) => state.reports);
  const comments = useMemo(
    () => allComments.filter((item) => item.locationId === params.id && item.status === "Visible"),
    [allComments, params.id]
  );
  const reports = useMemo(
    () => allReports.filter((item) => item.locationId === params.id),
    [allReports, params.id]
  );
  const toggleLocation = useUniversityAdminStore((state) => state.toggleLocation);
  const deleteLocation = useUniversityAdminStore((state) => state.deleteLocation);
  const moderateComment = useUniversityAdminStore((state) => state.moderateComment);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [commentToHide, setCommentToHide] = useState<string | null>(null);

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] px-6 text-center">
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
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="flex items-center gap-3 px-6 pb-4 pt-16">
        <Link
          href="/university-admin/locations"
          aria-label="Back to locations"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-orange-600">Location management</p>
          <h1 className="truncate text-xl font-semibold tracking-[-0.2px] text-slate-900">Location details</h1>
        </div>
        <Link
          href={`/university-admin/locations/${location.id}/edit`}
          aria-label={`Edit ${location.name}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <Pencil className="size-4" />
        </Link>
      </header>

      <div className="space-y-4 px-6 pb-[120px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex h-28 items-end justify-between bg-gradient-to-br from-orange-100 via-orange-50 to-white p-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              location.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
            }`}>
              {location.status}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-700 backdrop-blur">
              {location.category}
            </span>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{location.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{location.building}</p>
            </div>
            <p className="text-sm leading-5 text-slate-600">{location.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-slate-700">{location.rating ? location.rating.toFixed(1) : "New"}</span>
              <span>·</span>
              <span>{location.reviews} student reviews</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Student-facing status</h2>
              <p className="mt-0.5 text-xs text-slate-400">Current values shown in the admin model</p>
            </div>
            <Clock3 className="h-4 w-4 text-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatusItem icon={<Armchair className="h-4 w-4" />} label="Seats" value={location.seats} />
            <StatusItem icon={<Wifi className="h-4 w-4" />} label="Wi-Fi" value={location.wifi} />
            <StatusItem icon={<Users className="h-4 w-4" />} label="Crowd" value={location.crowd} />
            <StatusItem icon={<span className="text-sm font-bold">◌</span>} label="Noise" value={location.noise} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {location.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full bg-orange-50 px-2.5 py-1.5 text-[11px] font-semibold text-orange-700">
                {amenity}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Admin actions</h2>
              <p className="mt-0.5 text-xs text-slate-400">Control how this location is managed</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/university-admin/locations/${location.id}/edit`} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-orange-500 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
              <Pencil className="h-4 w-4" /> Edit details
            </Link>
            <button type="button" onClick={handleToggle} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-orange-50 text-xs font-bold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
              {location.status === "Active" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
              {location.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button type="button" onClick={() => setDeleteOpen(true)} className="col-span-2 flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-red-50 text-xs font-bold text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
              <Trash2 className="h-4 w-4" /> Delete location
            </button>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent student activity</h2>
              <p className="mt-0.5 text-xs text-slate-400">{reports.length} status reports · {comments.length} visible comments</p>
            </div>
            <Link href="/university-admin/comments" className="flex items-center gap-1 text-xs font-semibold text-orange-600">
              Feedback <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-orange-700">Status report</p>
                  <span className="text-[11px] text-slate-400">{report.submittedAt}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">Seats {report.seats} · Crowd {report.crowd} · Wi-Fi {report.wifi}</p>
                {report.comment ? <p className="mt-2 text-xs leading-5 text-slate-600">&ldquo;{report.comment}&rdquo;</p> : null}
              </div>
            ))}
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-amber-500">{"★".repeat(Math.round(comment.rating))}{"☆".repeat(5 - Math.round(comment.rating))}</p>
                  <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">&ldquo;{comment.text}&rdquo;</p>
                <button type="button" onClick={() => setCommentToHide(comment.id)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <EyeOff className="h-3.5 w-3.5" /> Hide comment
                </button>
              </div>
            ))}
            {reports.length === 0 && comments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">No student activity yet.</div> : null}
          </div>
        </section>
      </div>
      <AdminConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${currentLocation.name}?`}
        description="This permanently removes the location and its associated reports and comments. This action cannot be undone."
        confirmLabel="Delete location"
        destructive
        onConfirm={handleDelete}
      />
      <AdminConfirmDialog
        open={commentToHide !== null}
        onOpenChange={(open) => { if (!open) setCommentToHide(null); }}
        title="Hide this comment?"
        description="Students will no longer see this comment, but it will remain available to Admins."
        confirmLabel="Hide comment"
        destructive
        onConfirm={() => {
          if (commentToHide) {
            moderateComment(commentToHide, "Hidden");
            toast.success("Comment hidden");
          }
          setCommentToHide(null);
        }}
      />
    </main>
  );
}

function StatusItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="text-orange-500">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] text-slate-400">{label}</span>
        <span className="block truncate text-xs font-bold text-slate-700">{value}</span>
      </span>
    </div>
  );
}
