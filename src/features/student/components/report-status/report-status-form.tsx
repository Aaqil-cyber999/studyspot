"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getReportOptions, type ApiReportOption } from "@/services/university-admin";
import { PageLoader } from "@/components/shared/page-loader";
import { StatusChoiceRow } from "./status-choice-row";

const OPTION_CATEGORY = {
  noise: "noise",
  crowd: "crowd",
  seats: "seats",
  wifi: "wifi",
} as const;

const NOISE_FALLBACK = "Quiet";
const CROWD_FALLBACK = "Low";
const SEATS_FALLBACK = "Yes";
const WIFI_FALLBACK = "Strong";

export function ReportStatusForm({ spotName, locationId }: { spotName: string; locationId?: string }) {
  const { data: options = [], isPending } = useQuery({
    queryKey: ["ua", "report-options", "active"],
    queryFn: () => getReportOptions(false),
    staleTime: 60_000,
  });

  if (isPending) {
    return <PageLoader className="min-h-[50vh]" />;
  }

  return <ReportStatusFormInner spotName={spotName} locationId={locationId} options={options} />;
}

function ReportStatusFormInner({ spotName, locationId, options }: { spotName: string; locationId?: string; options: ApiReportOption[] }) {
  const router = useRouter();

  const byCategory = (category: (typeof OPTION_CATEGORY)[keyof typeof OPTION_CATEGORY]) => {
    const active = options
      .filter((option) => option.category === category && option.active)
      .sort((a, b) => a.order - b.order)
      .map((option) => option.label);
    return active;
  };

  const noiseOptions = byCategory(OPTION_CATEGORY.noise);
  const crowdOptions = byCategory(OPTION_CATEGORY.crowd);
  const seatsOptions = byCategory(OPTION_CATEGORY.seats);
  const wifiOptions = byCategory(OPTION_CATEGORY.wifi);

  const [noise, setNoise] = useState(() => (noiseOptions[0] ?? NOISE_FALLBACK));
  const [crowd, setCrowd] = useState(() => (crowdOptions[0] ?? CROWD_FALLBACK));
  const [seats, setSeats] = useState(() => (seatsOptions[0] ?? SEATS_FALLBACK));
  const [wifi, setWifi] = useState(() => (wifiOptions[0] ?? WIFI_FALLBACK));
  const [comment, setComment] = useState("");

  const submit = () => {
    // The report is only persisted when the user confirms on the review step.
    const params = new URLSearchParams({ noise, crowd, seats, wifi, name: spotName });
    if (locationId) params.set("locationId", locationId);
    if (comment.trim()) params.set("comment", comment.trim());
    router.push(`/student/review?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full md:max-w-[412px] flex-col gap-[20px] bg-[#E2E8F0] px-[24px] pb-[24px] pt-[32px]">
      <header className="flex h-[46px] items-center gap-[12px]">
        <button
          type="button"
          onClick={() => router.push(`/student/results/${locationId}`, { transitionTypes: ["nav-back"] })}
          aria-label="Go back"
          className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-white transition-colors hover:bg-[#d0d0d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="student-invert size-[18px] max-w-none" src="/assets/rate/18c00.svg" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h1 className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">
            Report Current Status
          </h1>
          <p className="text-[13px] font-normal leading-[18px] text-[#64748b]">{spotName}</p>
        </div>
      </header>

      <div className="flex w-full flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] pb-0 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        <p className="border-b border-[#e2e8f0] pb-[12px] text-[15px] font-semibold leading-[20px] text-[#0f172a]">
          Current status
        </p>
        <div className="divide-y divide-[#e2e8f0]">
          <StatusChoiceRow label="Noise level" options={noiseOptions} value={noise} onChange={setNoise} />
          <StatusChoiceRow label="Crowd level" options={crowdOptions} value={crowd} onChange={setCrowd} />
          <StatusChoiceRow label="Seats available" options={seatsOptions} value={seats} onChange={setSeats} />
          <StatusChoiceRow label="Wi-Fi" options={wifiOptions} value={wifi} onChange={setWifi} />
        </div>
      </div>

      <div className="flex w-full flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white p-[16px] shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        <p className="text-[15px] font-semibold leading-[20px] text-[#0f172a]">
          Comment{" "}
          <span className="text-[13px] font-normal text-[#64748b]">(optional)</span>
        </p>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share what others should know."
          style={{ resize: "none" }}
          className="mt-[12px] block h-[153px] w-full resize-none rounded-[10px] border border-[#e2e8f0] bg-white px-[12px] py-[10px] font-body text-[14px] font-normal leading-[20px] text-[#0f172a] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        />
      </div>

      <div className="mt-auto flex flex-col gap-[12px]">
        <button
          type="button"
          onClick={submit}
          className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px] transition-colors hover:bg-[#ea6a0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[16px] max-w-none" src="/assets/rate/df482.svg" />
          <span className="font-body text-[14px] font-medium leading-[20px] text-white">
            Review report
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push(`/student/results/${locationId}`, { transitionTypes: ["nav-back"] })}
          className="flex h-[32px] w-full items-center justify-center gap-[8px] rounded-[10px] border border-[#e5e5e5] bg-white px-[10px] py-[6px] transition-colors hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[16px] max-w-none" src="/assets/rate/d3eff.svg" />
          <span className="font-body text-[14px] font-medium leading-[20px] text-black">
            Cancel
          </span>
        </button>
        <p className="text-center text-[12px] font-normal leading-[18px] text-[#64748b]">
          Reports help other students find the right spot.
        </p>
      </div>
    </main>
  );
}
