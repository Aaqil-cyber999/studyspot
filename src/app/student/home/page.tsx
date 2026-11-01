"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudyLocations } from "@/services/student";
import { useState } from "react";
import Link from "next/link";

export default function StudentHomePage() {
  const { data: locations = [] } = useQuery({
    queryKey: ["student", "locations"],
    queryFn: getStudyLocations,
  });
  const [query, setQuery] = useState("");

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-[#f97316]">
      <div className="absolute left-0 top-[130px] h-[1956px] w-[412px] rounded-tl-[40px] rounded-tr-[40px] bg-white" />

      <p className="absolute left-[24px] top-[64px] whitespace-nowrap text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">
        Good morning, Mohamed
      </p>
      <p className="absolute left-[24px] top-[94px] whitespace-nowrap text-[14px] leading-[20px] text-white">
        Find your next study spot
      </p>

      <Link href="/student/profile" className="absolute left-[348px] top-[64px] block size-[40px] overflow-clip rounded-[20px] border-2 border-solid border-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src="/assets/home/296f7.png" />
      </Link>

      <div className="absolute left-1/2 top-[147px] flex w-[364px] -translate-x-1/2 items-center gap-[12px] overflow-clip rounded-[26px] bg-[#ddd] px-[18px] py-[14px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <span className="font-material text-[20px] text-[#64748b]">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search place, or area"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none"
        />
        <div className="h-[20px] w-px bg-[#e2e8f0]" />
        <span className="font-material text-[20px] text-[#64748b]">tune</span>
      </div>

      <div className="absolute left-[24px] top-[215px] rounded-[18px] bg-[#f97316] px-[14px] py-[8px]">
        <p className="text-[13px] font-medium text-white">Quiet</p>
      </div>
      <div className="absolute left-[96px] top-[215px] rounded-[18px] bg-[#ddd] px-[14px] py-[8px]">
        <p className="text-[13px] font-medium text-[#334052]">Seats available</p>
      </div>
      <div className="absolute left-[228px] top-[215px] rounded-[18px] bg-[#ddd] px-[14px] py-[8px]">
        <p className="text-[13px] font-medium text-[#334052]">Wi-Fi</p>
      </div>
      <div className="absolute left-[300px] top-[215px] w-[87px] rounded-bl-[18px] rounded-tl-[18px] bg-[#ddd] px-[14px] py-[8px]">
        <p className="text-[13px] font-medium text-[#334052]">Power outl</p>
      </div>

      <p className="absolute left-[24px] top-[271px] text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[#0f172a]">
        Recommended study spaces
      </p>

      <div className="absolute left-[24px] top-[307px] w-[364px] overflow-clip rounded-[16px] border border-[#e2e8f0] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[160px] w-full overflow-clip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute left-[-9px] top-0 h-[160px] w-[382px] max-w-none object-cover rounded-[2px]" src="/assets/home/838a8.png" />
          <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
            <img alt="" className="size-[16px] max-w-none" src="/assets/home/7844c.svg" />
          </div>
        </div>
        <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
          <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">UoM Library — Basement Study Hall</p>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">University Library · Basement floor</p>
          <div className="flex items-center gap-[6px]">
            <img alt="" className="size-[14px] max-w-none" src="/assets/home/30f3b.svg" />
            <p className="text-[13px] font-medium text-[#0f172a]">4.8 · 312 reviews</p>
            <p className="text-[13px] text-[#64748b]">·</p>
            <img alt="" className="size-[14px] max-w-none" src="/assets/home/9abac.svg" />
            <p className="text-[13px] text-[#334155]">7:30 – 22:00 daily</p>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/home/1e4ff.svg" /> Wi-Fi
            </span>
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
              <img alt="" className="size-[14px] max-w-none" src="/assets/home/5a32e.svg" /> Power outlets
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}