"use client";

import { SpotDetailView } from "@/features/student/components/spot-detail/spot-detail-view";
import { PageLoader } from "@/components/shared/page-loader";
import { useQuery } from "@tanstack/react-query";
import { getSpotDetail } from "@/services/student";

export function SpotDetailPageClient({ id }: { id: string }) {
  const { data: spot, isPending, isError } = useQuery({
    queryKey: ["location", id],
    queryFn: () => getSpotDetail(id),
    retry: 1,
  });

  if (isPending) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  if (isError || !spot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E2E8F0] px-6 text-center">
        <div>
          <p className="text-sm text-slate-500">This study space could not be found.</p>
          <a className="mt-3 inline-block text-sm font-semibold text-orange-600" href="/student/home">
            Back to Discover
          </a>
        </div>
      </div>
    );
  }

  return <SpotDetailView spot={spot} />;
}
