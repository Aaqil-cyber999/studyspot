"use client";

import Link from "next/link";

export default function SubmissionResultPage() {
  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-[#fbfbfc]">
      <div className="absolute left-1/2 top-[52px] h-[865px] w-[412px] -translate-x-1/2 overflow-clip">
        <div className="absolute left-[24px] right-[24px] top-[233px] h-[228px]">
          <div className="absolute left-[142px] top-[48px] flex size-[80px] items-center justify-center overflow-clip rounded-[40px] bg-[#16a34a] shadow-[0px_6px_20px_0px_rgba(22,163,74,0.3)]">
            <img alt="" className="size-[40px] max-w-none" src="/assets/result/4164b.svg" />
          </div>
          <p className="absolute left-1/2 top-[144px] -translate-x-1/2 whitespace-nowrap text-[22px] font-bold leading-[28px] text-[#0f172a]">
            Thanks for your report!
          </p>
          <p className="absolute left-1/2 top-[188px] h-[40px] w-[300px] -translate-x-1/2 text-center text-[14px] leading-[20px] text-[#64748b]">
            Your observation helps others find great study spaces.
          </p>
        </div>

        <Link
          href="/student/home"
          className="absolute left-[24px] right-[24px] top-[485px] block h-[48px] overflow-clip"
        >
          <div className="absolute left-0 right-0 top-0 flex h-[48px] items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px]">
            <img alt="" className="size-[16px] max-w-none" src="/assets/result/6a618.svg" />
            <p className="text-[14px] font-medium text-white">Go to Home Page</p>
          </div>
        </Link>
      </div>
    </div>
  );
}