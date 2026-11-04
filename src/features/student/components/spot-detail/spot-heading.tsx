import { Star } from "lucide-react";
import type { SpotDetail } from "@/features/student/types/spot-detail";

export function SpotHeading({ spot }: { spot: Pick<SpotDetail, "name" | "rating" | "reviewCount" | "staffMonitored"> }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <h1 className="text-[22px] font-medium leading-[35px] tracking-[-0.7px] text-[#0b1c30]">{spot.name}</h1>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
        <div className="flex items-center">
          <Star aria-hidden="true" className="size-[15px] text-[#f59e0b]" fill="#f59e0b" strokeWidth={0} />
          <span className="pl-1 font-body text-[18px] font-bold leading-6 text-[#0b1c30]">{spot.rating.toFixed(1)}</span>
        </div>

        <p className="font-body text-[14px] leading-5 text-[#515f74]">({spot.reviewCount} student reviews)</p>

        <span aria-hidden="true" className="size-1 rounded-full bg-[#e0c0b1]" />

        {spot.staffMonitored ? (
          <div className="flex items-center gap-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="size-[10.5px] max-w-none" src="/assets/detail/dba7b.svg" />
            <p className="font-body text-[11px] font-semibold leading-[14px] tracking-[0.33px] text-[#9d4300]">
              Staff Monitored
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
