"use client";

import { useQuery } from "@tanstack/react-query";
import { getSavedLocations } from "@/services/student";

export default function SavedPage() {
  useQuery({
    queryKey: ["student", "saved"],
    queryFn: getSavedLocations,
  });

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-[#fbfbfc]">
      <p className="absolute left-[24px] top-[64px] text-[20px] font-bold leading-[25px] tracking-[-0.3px] text-[#0f172a]">
        Saved places
      </p>

      <div className="absolute left-[24px] top-[108px] w-[364px] flex flex-col items-start rounded-[16px] bg-[#ddd] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/saved/26beb.png" />
          <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
            <img alt="" className="size-[16px] max-w-none" src="/assets/saved/5cc8f.svg" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
          <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Faculty of IT Computer Labs</p>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Information Technology</p>
          <div className="flex items-center gap-[6px]">
            <img alt="" className="size-[14px] max-w-none" src="/assets/saved/30f3b.svg" />
            <p className="text-[13px] font-medium text-[#0f172a]">4.6 · 176 reviews</p>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/saved/1e4ff.svg" /> Wi-Fi
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-[24px] top-[429px] w-[364px] flex flex-col items-start overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[160px] w-full overflow-clip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/saved/64a28.png" />
          <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
            <img alt="" className="size-[16px] max-w-none" src="/assets/saved/7f4f6.svg" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
          <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Faculty of Engineering Halls</p>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Engineering</p>
          <div className="flex items-center gap-[6px]">
            <img alt="" className="size-[14px] max-w-none" src="/assets/saved/30f3b.svg" />
            <p className="text-[13px] font-medium text-[#0f172a]">4.5 · 203 reviews</p>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/saved/1e4ff.svg" /> Wi-Fi
            </span>
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              Spacious seating
            </span>
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/saved/5a32e.svg" /> Power outlets
            </span>
          </div>
        </div>
      </div>

      <p className="absolute left-[24px] top-[568px] h-[28px] w-[364px] text-[11px] leading-[17px] text-[#99a6b8]">
        Auth prompt: sign in to save places → resume save
      </p>
    </div>
  );
}