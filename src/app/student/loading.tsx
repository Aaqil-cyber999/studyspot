import { PageLoader } from "@/components/shared/page-loader";

export default function StudentLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-90px)] w-full items-center justify-center bg-[#E2E8F0]">
      <PageLoader className="py-0" />
    </div>
  );
}
