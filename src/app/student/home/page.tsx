"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

const a = (name: string) => `/assets/home/${name}`;

export default function StudentHomePage() {
  return (
    <>
      <div className="relative top-0 left-0 right-0 h-[200px] mx-auto overflow-x-hidden overflow-y-auto bg-[#f97316]">
        {/* Header */}
        <div className="px-[24px] pt-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">Good morning, Mohamed</p>
              <p className="text-[14px] leading-[20px] text-white/90">Find your next study spot</p>
            </div>
            <Link href="/student/profile" className="relative block size-[40px] overflow-clip rounded-[20px] border-2 border-solid border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src={a("296f7.png")} />
            </Link>
          </div>
        </div>
      </div>
      {/* White content area */}
      <div className="relative top-[-110px] w-full mt-0 rounded-tl-[40px] rounded-tr-[40px] bg-white px-[24px] pt-[16px] pb-[100px]">
        {/* Search field */}
        <div className="mt-[5px] flex items-center gap-[12px] overflow-clip rounded-[26px] bg-[#ddd] px-[18px] py-[14px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <Search className="size-[20px] shrink-0 text-[#64748b]" />
          <input placeholder="Search place, or area" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none placeholder:text-[#64748b]" />
          <div className="h-[20px] w-px bg-[#e2e8f0]" />
          <SlidersHorizontal className="size-[20px] shrink-0 text-[#64748b]" />
        </div>

        {/* Filter chips */}
        <div className="mt-[15px] flex gap-[8px] overflow-hidden">
          <div className="shrink-0 rounded-[18px] bg-[#f97316] px-[14px] py-[8px]">
            <p className="text-[13px] font-medium text-white">Quiet</p>
          </div>
          <div className="shrink-0 rounded-[18px] bg-[#ddd] px-[14px] py-[8px]">
            <p className="text-[13px] font-medium text-[#334052]">Seats available</p>
          </div>
          <div className="shrink-0 rounded-[18px] bg-[#ddd] px-[14px] py-[8px]">
            <p className="text-[13px] font-medium text-[#334052]">Wi-Fi</p>
          </div>
          <div className="shrink-0 rounded-bl-[18px] rounded-tl-[18px] bg-[#ddd] px-[14px] py-[8px]">
            <p className="text-[13px] font-medium text-[#334052]">Power outle</p>
          </div>
        </div>

        {/* Recommended study spaces */}
        <p className="mt-[16px] mb-2 text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[#0f172a]">Recommended study spaces</p>
        <div>
          {/* Spot Card 1: UoM Library */}
          <a href="/student/results/uom-library" className="mb-[12px] block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none object-cover size-full scale-[1.05]" src={a("838a8.png")} />
              <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
                <img alt="" className="size-[16px] max-w-none" src={a("7844c.svg")} />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
              <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">UoM Library — Basement Study Hall</p>
              <p className="text-[13px] font-medium leading-[18px] text-[#334155]">University Library · Basement floor</p>
              <div className="flex items-center gap-[6px]">
                <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                <p className="text-[13px] font-medium text-[#0f172a]">4.8 · 312 reviews</p>
                <p className="text-[13px] text-[#64748b]">·</p>
                <img alt="" className="size-[14px] max-w-none" src={a("9abac.svg")} />
                <p className="text-[13px] text-[#334155]">7:30 – 22:00 daily</p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("1e4ff.svg")} /> Wi-Fi
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("5a32e.svg")} /> Power outlets
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("065c7.svg")} /> Silent zones
                </span>
              </div>
            </div>
          </a>

          {/* Spot Card 2: Faculty of Architecture Studios */}
          <Link href="/student/results/faculty-architecture" className="mb-[12px] block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            <div className="relative h-[160px] w-full overflow-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("3c32d.png")} />
              <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
                <img alt="" className="size-[16px] max-w-none" src={a("7844c.svg")} />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
              <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Faculty of Architecture Studios</p>
              <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Architecture · Katubedda</p>
              <div className="flex items-center gap-[6px]">
                <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                <p className="text-[13px] font-medium text-[#0f172a]">4.7 · 154 reviews</p>
                <p className="text-[13px] text-[#64748b]">·</p>
                <img alt="" className="size-[14px] max-w-none" src={a("9abac.svg")} />
                <p className="text-[13px] text-[#334155]">Open late</p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("22296.svg")} /> Design studios
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("5a32e.svg")} /> Power outlets
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("8e024.svg")} /> Open late
                </span>
              </div>
            </div>
          </Link>

          {/* Spot Card 3: Faculty of Engineering Halls */}
          <Link href="/student/results/faculty-engineering" className="mb-[12px] block overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            <div className="relative h-[160px] w-full overflow-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("64a28.png")} />
              <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
                <img alt="" className="size-[16px] max-w-none" src={a("7844c.svg")} />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
              <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Faculty of Engineering Halls</p>
              <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Engineering · Katubedda</p>
              <div className="flex items-center gap-[6px]">
                <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                <p className="text-[13px] font-medium text-[#0f172a]">4.5 · 203 reviews</p>
                <p className="text-[13px] text-[#64748b]">·</p>
                <img alt="" className="size-[14px] max-w-none" src={a("9abac.svg")} />
                <p className="text-[13px] text-[#334155]">Between lectures</p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("1e4ff.svg")} /> Wi-Fi
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("3d652.svg")} /> Spacious seating
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("5a32e.svg")} /> Power outlets
                </span>
              </div>
            </div>
          </Link>

          {/* Spot Card 4: Faculty of IT Computer Labs */}
          <Link href="/student/results/faculty-it" className="mb-[12px] block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
            <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("26beb.png")} />
              <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
                <img alt="" className="size-[16px] max-w-none" src={a("7844c.svg")} />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
              <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Faculty of IT Computer Labs</p>
              <p className="text-[13px] font-medium leading-[18px] text-[#334155]">Faculty of Information Technology · Katubedda</p>
              <div className="flex items-center gap-[6px]">
                <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                <p className="text-[13px] font-medium text-[#0f172a]">4.6 · 176 reviews</p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("3e147.svg")} /> Computers
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("1e4ff.svg")} /> Wi-Fi
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("5a32e.svg")} /> Power outlets
                </span>
              </div>
            </div>
          </Link>

          {/* Spot Card 5: UoM Library — Discussion Room */}
          <Link href="/student/results/uom-library-discussion" className="mb-[12px] block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            <div className="relative h-[160px] w-full overflow-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 h-full w-full object-cover" src={a("0992e.png")} />
              <div className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white">
                <img alt="" className="size-[16px] max-w-none" src={a("7844c.svg")} />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
              <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">UoM Library — Discussion Room</p>
              <p className="text-[13px] font-medium leading-[18px] text-[#334155]">University Library · 1st floor</p>
              <div className="flex items-center gap-[6px]">
                <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                <p className="text-[13px] font-medium text-[#0f172a]">4.6 · 98 reviews</p>
                <p className="text-[13px] text-[#64748b]">·</p>
                <img alt="" className="size-[14px] max-w-none" src={a("9abac.svg")} />
                <p className="text-[13px] text-[#334155]">Seats 60</p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("28e91.svg")} /> Group study
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("1e4ff.svg")} /> Wi-Fi
                </span>
                <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                  <img alt="" className="size-[14px] max-w-none" src={a("3e147.svg")} /> Near photocopier
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
