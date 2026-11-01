"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getStudyLocations } from "@/services/student";
import { SearchX } from "lucide-react";

export default function ResultsPage() {
  const { data: locations = [] } = useQuery({
    queryKey: ["student", "locations"],
    queryFn: getStudyLocations,
  });

  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[57px]">
      <div className="mb-[32px] flex items-center justify-between">
        <div>
          <p className="text-[19px] font-semibold leading-[25px] tracking-[-0.3px] text-[#0f172a]">
            Results ({locations.length})
          </p>
          <div className="mt-[32px] flex items-center gap-[8px]">
            <img alt="" className="size-[16px] max-w-none" src="/assets/results/bd7bd.svg" />
            <p className="text-[12px] leading-[18px] text-[#64748b]">Sorted by relevance</p>
          </div>
        </div>
        <Link href="/student/home" className="flex size-[40px] items-center justify-center rounded-full bg-[#ddd]">
          <img alt="" className="size-[13.333px] max-w-none" src="/assets/results/c667a.svg" />
        </Link>
      </div>

      {/* Card 1: UoM Library · Basement Hall */}
      <div className="mb-[12px] overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[176px] w-full overflow-clip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/results/838a8.png" />
          <div className="absolute left-[319px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
            <img alt="" className="size-[16px] max-w-none" src="/assets/results/7844c.svg" />
          </div>
          <div className="absolute left-0 top-[176px] size-[16px]">
            <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/results/f6bb9.svg" />
          </div>
        </div>
        <div className="flex flex-col gap-[8px] rounded-[12px] border border-[rgba(226,232,240,0.4)] bg-[#ddd] px-[16px] py-[14px]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold leading-[22px] text-[#0f172a]">UoM Library · Basement Hall</p>
            <div className="flex items-center gap-[3px]">
              <img alt="" className="size-[16px] max-w-none" src="/assets/results/d0ae6.svg" />
              <p className="text-[14px] font-semibold text-[#0f172a]">4.9</p>
              <p className="text-[12px] text-[#64748b]">(128)</p>
            </div>
          </div>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">University Library · Basement floor</p>
          <div className="flex items-center gap-[8px]">
            <span className="inline-flex items-center gap-[4px] rounded-[8px] bg-[#f0f5fa] px-[8px] py-[4px] text-[11px] font-medium text-[#334052]">
              <span className="relative size-[12px] overflow-clip">
                <img alt="" className="absolute inset-[20.83%_8.33%_16.67%_8.33%] max-w-none" src="/assets/results/59e37.svg" />
              </span>
              Wi-Fi
            </span>
            <span className="inline-flex items-center gap-[4px] rounded-[8px] bg-[#f0f5fa] px-[8px] py-[4px] text-[11px] font-medium text-[#334052]">
              Power
            </span>
            <span className="inline-flex items-center gap-[4px] rounded-[8px] bg-[#f0f5fa] px-[8px] py-[4px] text-[11px] font-medium text-[#334052]">
              Till 22:00
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Faculty of IT Computer Labs */}
      <div className="mb-[12px] flex flex-col items-start overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[160px] w-full overflow-clip rounded-tl-[15px] rounded-tr-[15px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/results/26beb.png" />
          <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
            <img alt="" className="size-[16px] max-w-none" src="/assets/results/7844c.svg" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
          <p className="text-[16px] font-semibold leading-[22px] text-[#0f172a]">Faculty of IT Computer Labs</p>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Information Technology</p>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex h-[82px] w-full flex-col items-center justify-center gap-[12px] overflow-clip rounded-[20px] border border-[rgba(226,232,240,0.4)] bg-[#fafafc] px-[32px] py-[40px]">
        <SearchX className="size-[40px] text-[#99a6b8]" />
        <p className="text-[16px] font-semibold text-[#0f172a]">No results found</p>
        <p className="text-center text-[13px] text-[#64748b]">Try adjusting your filters or search term.</p>
      </div>
    </div>
  );
}