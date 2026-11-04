"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@/stores/onboarding-store";

const asset = (name: string) => `/assets/select-university/${name}`;

const universities = [
  { id: "uom", name: "University of Moratuwa", location: "Katubedda, Moratuwa", meta: "Est. 1978 · 6 faculties · 10,000+ stu" },
  { id: "uoc", name: "University of Colombo", location: "College House, Colombo 03", meta: "Est. 1921 · Sri Lanka's oldest university" },
  { id: "usjp", name: "University of Sri Jayewardenepura", location: "Gangodawila, Nugegoda", meta: "Est. 1958 · 8 faculties · 14,000+ stu" },
];

export default function SelectUniversityPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("uom");
  const setUniversity = useOnboardingStore((state) => state.setUniversity);

  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="flex min-h-screen w-[412px] mx-auto flex-col bg-white px-[24px] pt-[32px] overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="mb-[24px] flex h-[36px] items-center gap-[12px]">
        <button onClick={() => router.back()} className="flex size-[36px] items-center justify-center overflow-clip rounded-[18px] bg-[#ddd]">
          <ArrowLeft className="size-[18px] text-[#334052]" />
        </button>
        <p className="min-w-0 flex-1 truncate text-left text-[20px] font-semibold leading-normal tracking-[-0.6px] text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Choose your university
        </p>
      </div>

      {/* Search field */}
      <div className="mb-[15px] flex items-center gap-[12px] overflow-clip rounded-[26px] border border-[rgba(226,232,240,0.5)] bg-[#ddd] px-[18px] py-[14px] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.05)]">
        <Search className="size-[20px] shrink-0 text-[#64748b]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search university"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none placeholder:text-[#64748b]"
        />
        <div className="h-[20px] w-px bg-[#e2e8f0]" />
      </div>

      {/* University tiles */}
      <div className="flex flex-col gap-[10px]">
        {filtered.map((u, i) => (
          <button
            key={u.id}
            onClick={() => {
              setSelected(u.id);
              toast.success(`${u.name} selected`);
            }}
            className={`flex h-[96px] w-full items-center gap-[12px] overflow-clip rounded-[16px] border bg-white p-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] ${selected === u.id ? "border-2 border-[#f97316]" : "border border-[#e2e8f0]"}`}
          >
            <div className="relative size-[72px] shrink-0 overflow-clip rounded-[12px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[12px] size-full" src={i === 0 ? asset("265e0.png") : i === 1 ? asset("c10fd.png") : asset("50ace.png")} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[2px] items-start overflow-clip">
              <p className="w-full truncate text-left text-[14px] font-semibold leading-[20px] text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                {u.name}
              </p>
              <div className="flex items-center gap-[4px]">
                <img alt="" className="size-[12px] max-w-none" src={asset("19d6c.svg")} />
                <p className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-[#334155]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                  {u.location}
                </p>
              </div>
              <div className="flex items-center gap-[4px]">
                <img alt="" className="size-[12px] max-w-none" src={asset("b6b86.svg")} />
                <p className="whitespace-nowrap text-[11px] font-normal leading-[16px] text-[#64748b]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                  {u.meta}
                </p>
              </div>
            </div>
            {selected === u.id ? (
              <div className="flex size-[22px] shrink-0 items-center justify-center">
                <div className="size-[12px] rounded-full bg-[#f97316]" />
              </div>
            ) : (
              <div className="size-[22px] shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Continue button */}
      <button
        onClick={() => {
          const chosen = universities.find((u) => u.id === selected);
          if (chosen) setUniversity(chosen.name);
          router.push("/student/info");
        }}
        className="mt-[20px] flex w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-[#f97316] p-[16px] cursor-pointer"
      >
        <p className="text-[15px] font-medium leading-normal text-white whitespace-nowrap" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Select university
        </p>
        <ArrowRight className="size-[18px] text-white" />
      </button>
    </main>
  );
}