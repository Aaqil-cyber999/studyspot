import { ReportStatusForm } from "@/features/student/components/report-status/report-status-form";

interface RateCommentPageProps {
  searchParams: Promise<{ locationId?: string; name?: string }>;
}

export default async function RateCommentPage({ searchParams }: RateCommentPageProps) {
  const params = await searchParams;
  const locationId = typeof params.locationId === "string" ? params.locationId : "";
  const spotName = typeof params.name === "string" && params.name.trim() ? params.name.trim() : "Study space";

  return <ReportStatusForm spotName={spotName} locationId={locationId || undefined} />;
}
