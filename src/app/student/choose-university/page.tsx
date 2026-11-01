"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { chooseUniversitySchema } from "@/features/student/schemas";

export default function ChooseUniversityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = chooseUniversitySchema.safeParse({ name, university, address });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setError(null);
    router.push("/student/select-university");
  }

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-white">
      <div className="absolute left-[-341.13px] top-[456.59px] flex h-[852.986px] w-[1088.298px] items-center justify-center">
        <div className="flex-none rotate-[-90.33deg]">
          <div className="relative h-[846.826px] w-[1083.49px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/choose-university/ellipse2.svg" />
          </div>
        </div>
      </div>

      <p className="absolute left-1/2 top-[492px] -translate-x-1/2 whitespace-nowrap text-[27px] tracking-[-0.6px] font-normal text-white">
        Your details
      </p>

      <div className="absolute left-[13px] top-[552px] flex w-[387px] flex-col gap-[23px] overflow-clip rounded-[24px] border border-[#fed7aa] bg-white px-[24px] py-[28px] shadow-[0px_4px_12px_0px_rgba(66,20,8,0.06)]">
        <div className="flex flex-col items-start gap-0">
          <div className="flex h-[58px] w-[337px] items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
            <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
              <span className="font-material text-[18px] text-[#f97316]">person</span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="shrink-0 text-[15px] font-light text-[#334155] outline-none placeholder:text-[#334155]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <button
            onClick={() => setUniversity(university ? "" : "University of Moratuwa")}
            className="flex h-[58px] w-[337px] items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]"
          >
            <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
              <span className="font-material text-[18px] text-[#f97316]">school</span>
            </div>
            <span className="shrink-0 text-[15px] font-light text-[#334155]">
              {university || "Select university"}
            </span>
            <div className="h-[100px] min-w-px flex-1" />
            <span className="font-material text-[18px] text-[#64748b]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col items-start">
          <div className="flex h-[58px] w-[337px] items-center gap-[12px] overflow-clip rounded-[14px] border border-[#fed7aa] bg-white px-[14px] py-[10px]">
            <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
              <span className="font-material text-[18px] text-[#f97316]">location_on</span>
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address (optional)"
              className="shrink-0 text-[15px] font-light text-[#334155] outline-none placeholder:text-[#334155]"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          onClick={submit}
          className="flex h-[51px] w-[337px] items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-[#f97316] p-[16px] text-[15px] font-medium text-white"
        >
          Start exploring
          <span className="font-material text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}