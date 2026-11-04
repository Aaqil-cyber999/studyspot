"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { amenityOptions } from "@/mocks/data/student";
import { SpotBookmark } from "@/features/student/components/discover/spot-bookmark";
import { ProfileAvatar } from "@/features/student/components/profile/profile-avatar";
import { useProfileStore } from "@/stores/profile-store";

const a = (name: string) => `/assets/home/${name}`;

const FILTER_CHIPS: { label: string; active: boolean }[] = [{ label: "Quiet", active: true }, { label: "Seats available", active: false }, ...amenityOptions.map((label) => ({ label, active: false }))];

export default function StudentHomePage() {
  const profileName = useProfileStore((state) => state.name);
  const profileImage = useProfileStore((state) => state.image);
  const firstName = profileName.trim().split(/\s+/)[0] || profileName;

  return (
    <>
      <div className="relative top-0 left-0 right-0 h-[200px] mx-auto overflow-x-hidden overflow-y-auto bg-[#f97316]">
        {/* Header */}
        <div className="px-[24px] pt-[20px]">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">Hey, {firstName}!</p>
              <p className="text-[14px] leading-[20px] text-white/90">Find your next study spot</p>
            </div>
            <Link href="/student/profile" aria-label="Open your profile" className="relative flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-[20px] border-2 border-solid border-white">
              <ProfileAvatar name={profileName} imageUrl={profileImage} className="size-full rounded-[20px] bg-white" textClassName="text-[13px] text-[#f97316]" />
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
        </div>

        {/* Filter chips — horizontally scrollable across the full page width */}
        <div role="group" aria-label="Filters" tabIndex={0} className="-mx-[24px] mt-[15px] flex gap-[8px] overflow-x-auto overscroll-x-contain px-[24px] [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] [&::-webkit-scrollbar]:hidden">
          {FILTER_CHIPS.map((chip) => (
            <div key={chip.label} className={cn("shrink-0 rounded-[18px] px-[14px] py-[8px]", chip.active ? "bg-[#f97316]" : "bg-[#ddd]")}>
              <p className={cn("text-[13px] font-medium whitespace-nowrap", chip.active ? "text-white" : "text-[#334052]")}>{chip.label}</p>
            </div>
          ))}
        </div>

        {/* Recommended study spaces */}
        <p className="mt-[16px] mb-3 text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[#0f172a]">Recommended study spaces</p>
        <div>
          {/* Spot Card 1: UoM Library */}
          <div className="relative mb-[12px]">
            <Link href="/student/results/uom-library" className="block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
              <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full scale-[1.05]" src={a("838a8.png")} />
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
            </Link>
            <SpotBookmark slug="uom-library" name="UoM Library — Basement Study Hall" />
          </div>

          {/* Spot Card 2: Faculty of Architecture Studios */}
          <div className="relative mb-[12px]">
            <Link href="/student/results/faculty-architecture" className="block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
              <div className="relative h-[160px] w-full overflow-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("3c32d.png")} />
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
            <SpotBookmark slug="faculty-architecture" name="Faculty of Architecture Studios" />
          </div>

          {/* Spot Card 3: Faculty of Engineering Halls */}
          <div className="relative mb-[12px]">
            <Link href="/student/results/faculty-engineering" className="block overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
              <div className="relative h-[160px] w-full overflow-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("64a28.png")} />
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
            <SpotBookmark slug="faculty-engineering" name="Faculty of Engineering Halls" />
          </div>

          {/* Spot Card 4: Faculty of IT Computer Labs */}
          <div className="relative mb-[12px]">
            <Link href="/student/results/faculty-it" className="block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
              <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={a("26beb.png")} />
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
            <SpotBookmark slug="faculty-it" name="Faculty of IT Computer Labs" />
          </div>

          {/* Spot Card 5: UoM Library — Discussion Room */}
          <div className="relative mb-[12px]">
            <Link href="/student/results/uom-library-discussion" className="block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
              <div className="relative h-[160px] w-full overflow-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 h-full w-full object-cover" src={a("0992e.png")} />
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
            <SpotBookmark slug="uom-library-discussion" name="UoM Library — Discussion Room" />
          </div>
        </div>
      </div>
    </>
  );
}
