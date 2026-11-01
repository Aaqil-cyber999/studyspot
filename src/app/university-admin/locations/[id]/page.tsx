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
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <Link href="/university-admin/locations" className="flex size-10 items-center justify-center rounded-full bg-slate-100">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">{location.name}</h1>
        <Link href={`/university-admin/locations/${location.id}/edit`} className="flex size-10 items-center justify-center rounded-full bg-slate-100">
          <Pencil className="size-5" />
        </Link>
      </div>
      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">{location.building}</p>
          <p className="mt-1 text-xs text-slate-400">⭐ {location.rating} · {location.reviews} reviews</p>
          <p className="mt-2 text-sm text-slate-500">Status: {location.status}</p>
        </div>
        <div>
          <p className="mb-2 text-base font-semibold text-slate-900">Comments</p>
          <div className="space-y-3">
            {locComments.length === 0 ? (
              <p className="text-sm text-slate-500">No comments.</p>
            ) : (
              locComments.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium text-orange-500">
                    {"★".repeat(Math.round(c.rating))} {c.rating.toFixed(1)}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">&ldquo;{c.text}&rdquo;</p>
                  <p className="mt-1 text-xs text-slate-400">{c.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}