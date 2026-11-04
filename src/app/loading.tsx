import { PageLoader } from "@/components/shared/page-loader";

export default function RootLoading() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#fbfbfc]">
      <PageLoader className="py-0" />
    </div>
  );
}
