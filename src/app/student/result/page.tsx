"use client";

import Link from "next/link";

export default function SubmissionResultPage() {
  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[52px] flex flex-col items-center justify-center gap-[24px]">
      <div className="flex flex-col items-center gap-[12px]">
        <div className="flex size-[80px] items-center justify-center rounded-[40px] bg-[#16a34a] shadow-[0px_6px_20px_0px_rgba(22,163,74,0.3)]">
          <img alt="" className="size-[40px] max-w-none" src="/assets/result/4164b.svg" />
        </div>
        <p className="text-center text-[22px] font-bold leading-[28px] text-[#0f172a]">
          Thanks for your report!
        </p>
        <p className="h-[40px] w-[300px] text-center text-[14px] leading-[20px] text-[#64748b]">
          Your observation helps others find great study spaces.
        </p>
      </div>

      <Link
        href="/student/home"
        className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px]"
      >
        <img alt="" className="size-[16px] max-w-none" src="/assets/result/6a618.svg" />
        <p className="text-[14px] font-medium text-white">Go to Home Page</p>
      </Link>
    </div>
  );
}