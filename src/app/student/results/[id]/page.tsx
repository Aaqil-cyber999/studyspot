import { SpotDetailView } from "@/features/student/components/spot-detail/spot-detail-view";
import { getSpotDetail } from "@/services/student";

interface SpotDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = await params;
  const spot = await getSpotDetail(id);

  return <SpotDetailView spot={spot} />;
}
