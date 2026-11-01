"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";
import { universities } from "@/mocks/data/shared";

export default function SelectUniversityPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filtered = universities.filter((u) => u.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto overflow-y-auto bg-white">
      <button
        onClick={() => router.back()}
        className="absolute left-[24px] top-[65px] flex size-[36px] items-center justify-center overflow-clip rounded-[18px] bg-[#ddd]"
      >
        <span className="font-material text-[18px] text-[#334052]">arrow_back</span>
      </button>

      <p className="absolute left-1/2 top-[66px] -translate-x-1/2 whitespace-nowrap text-[20px] font-semibold tracking-[-0.6px] text-[#0f172a]">
        Choose your university
      </p>

      <div className="absolute left-[24px] top-[117px] flex w-[364px] items-center gap-[12px] overflow-clip rounded-[26px] border border-[rgba(226,232,240,0.5)] bg-[#ddd] px-[18px] py-[14px] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.05)]">
        <Search className="size-[20px] text-[#64748b]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search university"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none"
        />
        <div className="h-[20px] w-px bg-[#e2e8f0]" />
      </div>

      <div className="absolute left-[24px] top-[192px] flex w-[364px] flex-col gap-[110px]">
        {filtered.map((u) => (
          <button
            key={u}
            onClick={() => setSelected(u)}
            className={`flex h-[96px] w-full items-center gap-[12px] overflow-clip rounded-[16px] border p-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] ${
              selected === u ? "border-[#f97316] bg-white" : "border-[#e2e8f0] bg-white"
            }`}
          >
            <div className="size-[72px] shrink-0 rounded-[12px] bg-orange-100" />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
              <p className="whitespace-nowrap text-[14px] font-semibold text-[#0f172a]">{u}</p>
              <p className="text-[12px] text-[#334155]">Select to continue</p>
            </div>
            {selected === u ? <Check className="size-[22px] text-[#f97316]" /> : null}
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push("/student/home")}
        className="absolute bottom-[24px] left-[24px] w-[364px] rounded-[16px] bg-[#f97316] py-[14px] text-[15px] font-medium text-white"
      >
        Continue
      </button>
    </div>
  );
}