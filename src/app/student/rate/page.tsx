"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { rateCommentSchema } from "@/features/student/schemas";

const noiseOptions = ["Quiet", "Moderate", "Loud"];
const crowdOptions = ["Low", "Medium", "High"];
const seatsOptions = ["Yes", "No"];
const wifiOptions = ["Weak", "Medium", "Strong"];

export default function RateCommentPage() {
  const router = useRouter();
  const [noise, setNoise] = useState("Quiet");
  const [crowd, setCrowd] = useState("Low");
  const [seats, setSeats] = useState("Yes");
  const [wifi, setWifi] = useState("Medium");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = rateCommentSchema.safeParse({ rating: 5, comment });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid";
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    toast.success("Status report submitted");
    router.push("/student/review");
  }

  function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`h-[36px] rounded-[18px] px-[14px] py-[8px] text-[13px] font-medium ${
          active ? "bg-[#f97316] text-white" : "bg-[#ddd] text-[#334155]"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[52px] pb-[24px] flex flex-col gap-[20px]">
        <div className="flex h-[46px] items-center gap-[12px]">
          <button
            onClick={() => router.back()}
            className="flex size-[36px] items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-[#ddd]"
          >
            <img alt="" className="size-[18px] max-w-none" src="/assets/rate/18c00.svg" />
          </button>
          <div className="flex w-[316px] flex-col gap-[4px]">
            <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">Report Current Status</p>
            <p className="text-[13px] leading-[18px] text-[#64748b]">Central Library Study Zone</p>
          </div>
        </div>

        <div className="flex flex-col items-start rounded-[16px] border border-[#e2e8f0] bg-white p-px shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
          <div className="flex w-[362px] items-center justify-between border border-[#e2e8f0] p-[16px]">
            <p className="text-[15px] font-semibold text-[#0f172a]">Current status</p>
          </div>
          <div className="flex w-[362px] items-center justify-between border border-[#e2e8f0] px-[16px] py-[14px]">
            <p className="text-[14px] text-[#334155]">Noise level</p>
            <div className="flex h-[36px] gap-[8px]">
              {noiseOptions.map((o) => (
                <Chip key={o} label={o} active={noise === o} onClick={() => setNoise(o)} />
              ))}
            </div>
          </div>
          <div className="flex w-[362px] items-center justify-between border border-[#e2e8f0] px-[16px] py-[14px]">
            <p className="text-[14px] text-[#334155]">Crowd level</p>
            <div className="flex h-[36px] gap-[8px]">
              {crowdOptions.map((o) => (
                <Chip key={o} label={o} active={crowd === o} onClick={() => setCrowd(o)} />
              ))}
            </div>
          </div>
          <div className="flex w-[362px] items-center justify-between border border-[#e2e8f0] px-[16px] py-[14px]">
            <p className="text-[14px] text-[#334155]">Seats available</p>
            <div className="flex h-[36px] gap-[8px]">
              {seatsOptions.map((o) => (
                <Chip key={o} label={o} active={seats === o} onClick={() => setSeats(o)} />
              ))}
            </div>
          </div>
          <div className="flex w-[362px] items-center justify-between border border-[#e2e8f0] px-[16px] py-[14px]">
            <p className="text-[14px] text-[#334155]">Wi-Fi strength</p>
            <div className="flex h-[36px] gap-[8px]">
              {wifiOptions.map((o) => (
                <Chip key={o} label={o} active={wifi === o} onClick={() => setWifi(o)} />
              ))}
            </div>
          </div>
          <div className="flex w-[362px] items-center justify-between px-[16px] py-[14px]">
            <p className="text-[14px] text-[#334155]">Comment</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="h-[40px] w-[210px] resize-none rounded-[8px] border border-[#e2e8f0] p-[8px] text-[14px] text-[#0f172a] outline-none"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          onClick={submit}
          className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-[#f97316] px-[10px] py-[6px] text-[14px] font-medium text-white"
        >
          <img alt="" className="size-[16px] max-w-none" src="/assets/rate/df482.svg" />
          Submit
        </button>
    </div>
  );
}