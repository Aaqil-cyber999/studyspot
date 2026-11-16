import { SpotDetailPageClient } from "@/features/student/components/spot-detail/spot-detail-page-client";

interface SpotDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = await params;
  return <SpotDetailPageClient id={id} />;
}
