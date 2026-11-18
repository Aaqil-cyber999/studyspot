"use client";

import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { RouteTransition } from "@/components/shared/route-transition";

export default function WelcomePage() {
  return (
    <RouteTransition>
      <main className="flex min-h-dvh w-full md:max-w-[412px] mx-auto flex-col overflow-x-hidden overflow-y-auto bg-[#E2E8F0]">
        {/* Row 1 — logo + brand */}
        <section className="relative flex min-h-[200px] w-full flex-1 shrink flex-col items-center justify-center gap-2 bg-[#E2E8F0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="SpotWise logo" className="block w-[280px] max-w-[76%] object-contain" src="/assets/welcome/logo.png" />
          <p className="-mt-5 text-center text-[56px] font-normal leading-none tracking-[-1.5px] text-[#0f172a] font-[family-name:var(--font-geologica)]">
            Spot<span className="text-[#f97316]">Wise</span>
          </p>
          <p className="mt-[14px] text-center text-[17px] font-medium text-[#64748b]">Where focus finds you</p>
        </section>

        {/* Row 2 — role picker */}
        <section className="relative z-10 flex w-full shrink-0 flex-col justify-center rounded-t-[28px] bg-[#F97316] px-[20px] pt-[50px] pb-[60px]">
          <p className="mb-[12px] mt-[6px] text-center text-[12px] font-medium uppercase tracking-[2px] text-white/80">Continue as</p>

          <Link href="/student/login" className="flex w-full items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[16px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]">
            <div className="flex size-[44px] shrink-0 items-center justify-center overflow-clip rounded-[22px] bg-[rgba(249,115,22,0.1)]">
              <GraduationCap className="size-[22px] text-[#f97316]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px] overflow-hidden text-left">
              <p className="text-[18px] font-semibold leading-tight text-[#0f172a]">Student</p>
              <p className="text-[12px] leading-[17px] text-[#64748b]">Find and assess study spaces on campus.</p>
            </div>
          </Link>

          <Link href="/university-admin/login" className="mt-[12px] flex w-full items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[16px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316]">
            <div className="flex size-[44px] shrink-0 items-center justify-center overflow-clip rounded-[22px] bg-[rgba(249,115,22,0.1)]">
              <ShieldCheck className="size-[22px] text-[#f97316]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px] overflow-hidden text-left">
              <p className="text-[18px] font-semibold leading-tight text-[#0f172a]">University Admin</p>
              <p className="text-[12px] leading-[17px] text-[#64748b]">Manage your university&apos;s study locations.</p>
            </div>
          </Link>
        </section>
      </main>
    </RouteTransition>
  );
}
