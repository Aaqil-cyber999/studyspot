"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";

export default function ReviewSubmissionPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[52px] pb-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => router.back()}
            className="flex size-[36px] items-center justify-center overflow-clip rounded-[18px] border border-[#e2e8f0] bg-[#ddd]"
          >
            <img alt="" className="size-[18px] max-w-none" src="/assets/review/87c6d.svg" />
          </button>
          <div className="flex flex-1 flex-col gap-[4px]">
            <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Review your report</p>
            <p className="text-[13px] leading-[18px] text-[#64748b]">Please confirm before submitting</p>
          </div>
        </div>

        <div className="flex flex-col items-start overflow-clip rounded-[10px] border border-[#b9bec7] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
          <div className="relative h-[176px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/review/96063.png" />
            <Bookmark className="absolute left-[327px] top-[135px] size-[16px] text-[#334052]" />
          </div>
        </div>

        <div className="flex flex-col items-start overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
          <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] p-[16px]">
            <p className="text-[15px] font-semibold text-[#0f172a]">Your report</p>
          </div>
          {[
            { label: "Noise", value: "Quiet" },
            { label: "Crowd", value: "Low" },
            { label: "Seats", value: "Available" },
            { label: "Wi-Fi strength", value: "Medium" },
          ].map((row) => (
            <div key={row.label} className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-[16px] py-[14px] text-[14px]">
              <p className="text-[#334155]">{row.label}</p>
              <p className="font-medium text-[#0f172a]">{row.value}</p>
            </div>
          ))}
          <div className="flex w-full items-center justify-between px-[16px] py-[14px] text-[14px]">
            <p className="text-[#334155]">Comment</p>
            <p className="w-[210px] text-right text-[#0f172a]">&ldquo;Good natural light and quiet during afternoon.&rdquo;</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/student/result")}
          className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px] text-[14px] font-medium text-white"
        >
          <img alt="" className="size-[16px] max-w-none" src="/assets/review/ae913.svg" />
          Confirm submission
        </button>
    </div>
  );
}