"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReportStore } from "@/stores/report-store";
import { useAdminOptionsStore } from "@/stores/admin-options-store";
import { StatusChoiceRow } from "./status-choice-row";

interface ReportStatusFormProps {
  spotName: string;
}

// Noise level uses these three canonical values, matching the admin noise model.
const NOISE_LEVELS = ["Quiet", "Moderate", "Loud"] as const;

/**
 * Figma "STU / 11 Rate & Comment" (node 25:1187) — current-status report form.
 */
export function ReportStatusForm({ spotName }: ReportStatusFormProps) {
  const router = useRouter();
  const setReport = useReportStore((state) => state.setReport);
  const storedNoise = useReportStore((state) => state.noise);
  const storedCrowd = useReportStore((state) => state.crowd);
  const storedSeats = useReportStore((state) => state.seats);
  const storedWifi = useReportStore((state) => state.wifi);
  const storedComment = useReportStore((state) => state.comment);
  const options = useAdminOptionsStore((state) => state.options);
  const getActiveOptions = (category: "noise" | "crowd" | "seats" | "wifi", currentValue: string) =>
    options
      .filter((option) => option.category === category && (option.active || option.label === currentValue))
      .sort((a, b) => a.order - b.order)
      .map((option) => option.label);
  const [noise, setNoise] = useState<string>(
    NOISE_LEVELS.includes(storedNoise as (typeof NOISE_LEVELS)[number]) ? storedNoise : "Quiet",
  );
  const [crowd, setCrowd] = useState<string>(storedCrowd);
  const [seats, setSeats] = useState<string>(storedSeats);
  const [wifi, setWifi] = useState<string>(storedWifi);
  const [comment, setComment] = useState(storedComment);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[412px] flex-col gap-[20px] bg-[#fbfbfc] px-[24px] pb-[24px] pt-[32px]">
      <header className="flex h-[46px] items-center gap-[12px]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-[#ddd] transition-colors hover:bg-[#d0d0d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[18px] max-w-none" src="/assets/rate/18c00.svg" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h1 className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">
            Report Current Status
          </h1>
          <p className="text-[13px] font-normal leading-[18px] text-[#64748b]">{spotName}</p>
        </div>
      </header>

      <form
        className="flex flex-1 flex-col gap-[20px]"
        onSubmit={(event) => {
          event.preventDefault();
          setReport({ noise, crowd, seats, wifi, comment });
          router.push("/student/review");
        }}
      >
        <section
          aria-labelledby="current-status-heading"
          className="flex flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white p-px shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center border border-[#e2e8f0] p-[16px]">
            <h2
              id="current-status-heading"
              className="text-[15px] font-semibold leading-[20px] text-[#0f172a]"
            >
              Current status
            </h2>
          </div>

          <StatusChoiceRow
            label="Noise level"
            options={[...NOISE_LEVELS]}
            value={noise}
            onChange={setNoise}
          />
          <StatusChoiceRow
            label="Crowd level"
            options={getActiveOptions("crowd", crowd)}
            value={crowd}
            onChange={setCrowd}
          />
          <StatusChoiceRow
            label="Seats available"
            options={getActiveOptions("seats", seats)}
            value={seats}
            onChange={setSeats}
          />
          <StatusChoiceRow
            label="Wi-Fi"
            options={getActiveOptions("wifi", wifi)}
            value={wifi}
            onChange={setWifi}
          />
        </section>

        <section
          aria-labelledby="report-comment-heading"
          className="flex flex-col overflow-clip rounded-[16px] border border-[#e2e8f0] bg-white p-px shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]"
        >
          <div className="flex h-[54px] items-center border border-[#e2e8f0] px-[16px]">
            <h2
              id="report-comment-heading"
              className="w-[80px] shrink-0 text-[15px] font-semibold leading-[20px] text-[#0f172a]"
            >
              Comment
            </h2>
            <span className="text-[13px] font-normal leading-[18px] text-[#64748b]">
              (optional)
            </span>
          </div>

          <div className="p-[16px]">
            <label htmlFor="report-comment" className="sr-only">
              Comment (optional)
            </label>
            <textarea
              id="report-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share what others should know…"
              className="block h-[153px] w-full resize-none rounded-[10px] border border-[#e2e8f0] bg-white px-[12px] py-[10px] font-body text-[14px] font-normal leading-[20px] text-[#0f172a] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#f97316]"
            />
          </div>
        </section>

        <div aria-hidden="true" className="min-h-px flex-1" />

        <div className="flex flex-col gap-[12px]">
          <button
            type="submit"
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
            onClick={() => router.back()}
            className="flex h-[32px] w-full items-center justify-center gap-[8px] rounded-[10px] border border-[#e5e5e5] bg-white px-[10px] py-[6px] transition-colors hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="size-[16px] max-w-none" src="/assets/rate/d3eff.svg" />
            <span className="font-body text-[14px] font-medium leading-[20px] text-black">
              Cancel
            </span>
          </button>

          <p className="text-center text-[12px] font-normal leading-[18px] text-[#64748b]">
            Your feedback helps others find great study spaces.
          </p>
        </div>
      </form>
    </main>
  );
}
