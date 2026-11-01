"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export default function WelcomePage() {
  const setRole = useAuthStore((s) => s.setRole);
  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-white">
      {/* background ellipses */}
      <div className="absolute left-[-345px] top-[307px] h-[1078.912px] w-[1058.88px] flex items-center justify-center">
        <div className="flex-none rotate-[-47.42deg]">
          <div className="relative h-[589px] w-[924px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse3.svg" />
          </div>
        </div>
      </div>
      <div className="absolute left-[-512px] top-[440px] h-[589px] w-[924px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse2.svg" />
      </div>
      <div className="absolute left-[-178px] top-[516px] h-[589px] w-[924px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/welcome/ellipse1.svg" />
      </div>

      <div className="absolute left-[80px] top-[89px] h-[228px] w-[251px] rounded-[26px] shadow-[0px_8px_28px_0px_rgba(249,115,22,0.24)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[26px] size-full" src="/assets/welcome/logo.png" />
      </div>

      <p className="absolute left-1/2 top-[297px] -translate-x-1/2 h-[63px] w-[412px] text-center text-[50px] tracking-[-0.9px] font-normal text-[#0f172a] font-[family-name:var(--font-geologica)]">
        Spot<span className="text-[#f97316]">Wise</span>
      </p>
      <p className="absolute left-1/2 top-[368px] -translate-x-1/2 h-[22px] w-[412px] text-center text-[15px] font-medium text-black">
        Where focus finds you
      </p>
      <p className="absolute left-[166px] top-[592px] text-[15px] font-medium text-white tracking-[1.6px]">
        Continue as
      </p>

      <Link
        href="/student/choose-university"
        onClick={() => setRole("student")}
        className="absolute left-[24px] top-[630px] flex w-[364px] items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[18px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[rgba(249,115,22,0.1)]">
          <span className="font-material text-[24px] text-[#f97316]">school</span>
        </div>
        <div className="flex h-[48px] w-[263px] shrink-0 flex-col items-start gap-[4px] overflow-clip bg-white text-left">
          <p className="text-[19px] font-semibold text-[#0f172a]">Student</p>
          <p className="text-[13px] leading-[18px] text-[#64748b]">Find and assess study spaces on campus.</p>
        </div>
      </Link>

      <div
        onClick={() => setRole("university-admin")}
        className="absolute left-[24px] top-[735px] flex w-[364px] cursor-pointer items-center gap-[16px] overflow-clip rounded-[50px] border border-[rgba(226,232,240,0.6)] bg-white p-[18px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[rgba(249,115,22,0.1)]">
          <span className="font-material text-[24px] text-[#f97316]">admin_panel_settings</span>
        </div>
        <div className="flex h-[48px] w-[263px] shrink-0 flex-col items-start gap-[4px] overflow-clip bg-white text-left">
          <p className="text-[19px] font-semibold text-[#0f172a]">University Admin</p>
          <p className="text-[13px] leading-[18px] text-[#64748b]">Manage your university&apos;s study locations.</p>
        </div>
      </div>
    </div>
  );
}