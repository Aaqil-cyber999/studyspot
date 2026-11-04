"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/navigation/admin-page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaComments, getUaLocations } from "@/services/university-admin";

export default function UaLocationDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: locations = [] } = useQuery({ queryKey: ["ua", "locations"], queryFn: getUaLocations });
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const location = locations.find((item) => item.id === params.id);

  if (!location) return <PageLoader className="min-h-screen bg-white py-0" />;

  const locationComments = comments.filter((comment) => comment.locationId === location.id);
  return (
    <div className="min-h-screen bg-white pb-[90px]">
      <AdminPageHeader title={location.name} subtitle={location.building} backHref="/university-admin/locations" action={{ href: `/university-admin/locations/${location.id}/edit`, label: "Edit location", icon: Pencil }} />
      <main className="space-y-[20px] px-[24px] pt-[4px]">
        <section className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-[#334155]">Location overview</p>
            <span className="rounded-full bg-[#dcfce7] px-[10px] py-[4px] text-[11px] font-medium text-[#166534]">{location.status}</span>
          </div>
          <p className="mt-[12px] text-[13px] text-[#64748b]"><span className="text-[#f59e0b]">★</span> {location.rating.toFixed(1)} · {location.reviews} reviews</p>
        </section>
        <section>
          <h2 className="mb-[10px] text-[16px] font-semibold text-[#0f172a]">Reviews</h2>
          <div className="space-y-[12px]">
            {locationComments.length === 0 ? (
              <p className="rounded-[16px] border border-dashed border-[#e2e8f0] p-[20px] text-center text-[13px] text-[#64748b]">No reviews.</p>
            ) : locationComments.map((comment) => (
              <article key={comment.id} className="rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
                <p className="text-[12px] font-medium text-[#f59e0b]">{"★".repeat(Math.round(comment.rating))} {comment.rating.toFixed(1)}</p>
                <p className="mt-[6px] text-[14px] text-[#334155]">&ldquo;{comment.text}&rdquo;</p>
                <p className="mt-[6px] text-[12px] text-[#64748b]">{comment.createdAt}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
