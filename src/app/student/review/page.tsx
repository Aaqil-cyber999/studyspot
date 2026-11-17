"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { api, ApiError } from "@/services/api";

const isValid = (value: string | null, allowed: string[]) => !!value && allowed.includes(value);

function ReviewSubmission() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const noise = searchParams.get("noise");
  const crowd = searchParams.get("crowd");
  const seats = searchParams.get("seats");
  const wifi = searchParams.get("wifi");
  const comment = searchParams.get("comment") ?? "";
  const locationId = searchParams.get("locationId");
  const name = searchParams.get("name") ?? "Study space";

  const [submitting, setSubmitting] = useState(false);
  const ready =
    isValid(noise, ["Quiet", "Moderate", "Loud"]) &&
    isValid(crowd, ["Low", "Medium", "High"]) &&
    isValid(seats, ["Yes", "Limited", "No"]) &&
    isValid(wifi, ["Strong", "Medium", "Weak"]) &&
    !!locationId;

  async function confirm() {
    if (!ready || submitting) {
      if (!ready) toast.error("This report is incomplete. Please go back and try again.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reports", {
        locationId,
        noise,
        crowd,
        seats,
        wifi,
        comment: comment.trim() || undefined,
      });
      toast.success("Report submitted");
      router.replace("/student/result");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to submit the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#E2E8F0] px-[24px] pt-[32px] pb-[24px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[12px]">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex size-[36px] items-center justify-center overflow-clip rounded-[18px] border border-[#e2e8f0] bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="student-invert size-[18px] max-w-none" src="/assets/review/87c6d.svg" />
        </button>
        <div className="flex flex-1 flex-col gap-[4px]">
          <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Review your report</p>
          <p className="text-[13px] leading-[18px] text-[#64748b] truncate">{name}</p>
        </div>
      </div>

      <div className="flex flex-col items-start overflow-clip rounded-[10px] border border-[#b9bec7] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="relative h-[176px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/review/96063.png" />
          <Bookmark className="absolute left-[327px] top-[135px] size-[16px] text-[#334052]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col items-start overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] p-[16px]">
          <p className="text-[15px] font-semibold text-[#0f172a]">Your report</p>
        </div>
        {[
          { label: "Noise", value: noise },
          { label: "Crowd", value: crowd },
          { label: "Seats available", value: seats },
          { label: "Wi-Fi strength", value: wifi },
        ].map((row) => (
          <div key={row.label} className="flex w-full items-center justify-between gap-4 border-b border-[#e2e8f0] px-[16px] py-[14px] text-[14px]">
            <p className="text-[#334155]">{row.label}</p>
            <p className="font-medium text-[#0f172a]">{row.value ?? "—"}</p>
          </div>
        ))}
        <div className="flex w-full items-center justify-between gap-4 px-[16px] py-[14px] text-[14px]">
          <p className="text-[#334155]">Comment</p>
          <p className="min-w-0 max-w-[220px] break-words text-right text-[#0f172a]">
            {comment.trim() ? `“${comment.trim()}”` : "No comment added"}
          </p>
        </div>
      </div>

      <button
        onClick={confirm}
        disabled={submitting}
        className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px] text-[14px] font-medium text-white transition-colors hover:bg-[#ea6a0f] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="size-[16px] max-w-none" src="/assets/review/ae913.svg" />
        {submitting ? "Submitting…" : "Confirm submission"}
      </button>
    </div>
  );
}

export default function ReviewSubmissionPage() {
  return (
    <Suspense>
      <ReviewSubmission />
    </Suspense>
  );
}
