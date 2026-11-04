"use client";

import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function WelcomePage() {
  const setRole = useAuthStore((s) => s.setRole);
  return (
    <div className="relative min-h-screen w-[412px] mx-auto overflow-hidden bg-white">
      {/* background ellipses */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-345px] top-[350px] h-[1078.912px] w-[1058.88px] flex items-center justify-center">
          <div className="flex-none rotate-[-47.42deg]">
            <div className="relative h-[589px] w-[924px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse3.svg" />
            </div>
          </div>
        </div>
        <div className="absolute left-[-512px] top-[480px] h-[589px] w-[924px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse2.svg" />
        </div>
        <div className="absolute left-[-178px] top-[556px] h-[589px] w-[924px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse1.svg" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-[24px] pt-[89px]">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-[228px] w-[251px] max-w-none object-contain" src="/assets/welcome/logo.png" />

        {/* Title */}
        <p className="mt-[8px] h-[63px] w-full text-center text-[50px] font-normal tracking-[-0.9px] text-[#0f172a] font-[family-name:var(--font-geologica)]">
          Spot<span className="text-[#f97316]">Wise</span>
        </p>
        <p className="mt-[8px] h-[22px] w-full text-center text-[15px] font-medium text-black">Where focus finds you</p>

        <div className="mt-[220px] w-full">
          <p className="mb-[20px] text-[15px] font-medium text-white tracking-[1.6px] text-center">Continue as</p>

          <Link href="/student/login" onClick={() => setRole("student")} className="flex w-full items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[18px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]">
            <div className="flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[rgba(249,115,22,0.1)]">
              <GraduationCap className="size-[24px] text-[#f97316]" />
            </div>
            <div className="flex h-[48px] w-[263px] shrink-0 flex-col items-start gap-[4px] overflow-visible bg-white text-left">
              <p className="text-[19px] font-semibold text-[#0f172a]">Student</p>
              <p className="text-[13px] leading-[18px] text-[#64748b]">Find and assess study spaces on campus.</p>
            </div>
          </Link>

          <Link href="/university-admin/login" onClick={() => setRole("university-admin")} className="mt-[20px] flex w-full items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[18px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]">
            <div className="flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[rgba(249,115,22,0.1)]">
              <ShieldCheck className="size-[24px] text-[#f97316]" />
            </div>
            <div className="flex h-[48px] w-[263px] shrink-0 flex-col items-start gap-[4px] overflow-visible bg-white text-left">
              <p className="text-[19px] font-semibold text-[#0f172a]">University Admin</p>
              <p className="text-[13px] leading-[18px] text-[#64748b]">Manage your university&apos;s study locations.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
