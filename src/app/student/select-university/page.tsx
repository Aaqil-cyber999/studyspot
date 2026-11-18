"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const asset = (name: string) => `/assets/select-university/${name}`;

interface UniversityOption {
  id: string;
  name: string;
  status: "Pending" | "Active" | "Inactive";
  locationCount: number;
}

async function fetchActiveUniversities(): Promise<UniversityOption[]> {
  const all = await api.get<UniversityOption[]>("/universities");
  return all.filter((u) => u.status === "Active");
}

const TILE_IMAGES = [asset("265e0.png"), asset("c10fd.png"), asset("50ace.png")];

export default function SelectUniversityPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const setUniversity = useOnboardingStore((state) => state.setUniversity);

  const { data: universities = [], isPending } = useQuery({
    queryKey: ["student", "onboarding-universities"],
    queryFn: fetchActiveUniversities,
  });

  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()),
  );

  // Default to the first available university without an effect.
  const effectiveSelected = selected ?? universities[0]?.id ?? null;

  return (
    <main className="flex min-h-screen w-full md:max-w-[412px] mx-auto flex-col bg-[#E2E8F0] px-[24px] pt-[32px] overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="mb-[24px] flex h-[36px] items-center gap-[12px]">
        <button onClick={() => router.push("/student/info", { transitionTypes: ["nav-back"] })} className="flex size-[36px] items-center justify-center overflow-clip rounded-[18px] bg-white" aria-label="Go back">
          <ArrowLeft className="size-[18px] text-[#334052]" />
        </button>
        <p className="min-w-0 flex-1 truncate text-left text-[20px] font-semibold leading-normal tracking-[-0.6px] text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Choose your university
        </p>
      </div>

      {/* Search field */}
      <div className="mb-[15px] flex items-center gap-[12px] overflow-clip rounded-[26px] border border-[rgba(226,232,240,0.5)] bg-white px-[18px] py-[14px] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.05)]">
        <Search className="size-[20px] shrink-0 text-[#64748b]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search university"
          aria-label="Search universities"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none placeholder:text-[#64748b]"
        />
        <div className="h-[20px] w-px bg-[#e2e8f0]" />
      </div>

      {/* University tiles */}
      <div className="flex flex-col gap-[10px]" role="listbox" aria-label="Universities" aria-busy={isPending}>
        {isPending ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading universities…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            {query ? `No universities match "${query}".` : "No universities available."}
          </div>
        ) : (
          filtered.map((u, i) => (
            <button
              key={u.id}
              role="option"
              aria-selected={effectiveSelected === u.id}
              onClick={() => {
                setSelected(u.id);
                toast.success(`${u.name} selected`);
              }}
              className={`flex h-[96px] w-full items-center gap-[12px] overflow-clip rounded-[16px] border bg-white p-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] ${effectiveSelected === u.id ? "border-2 border-[#f97316]" : "border border-[#e2e8f0]"}`}
            >
              <div className="relative size-[72px] shrink-0 overflow-clip rounded-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[12px] size-full" src={TILE_IMAGES[i % TILE_IMAGES.length]} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px] items-start overflow-clip">
                <p className="w-full truncate text-left text-[14px] font-semibold leading-[20px] text-[#0f172a]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                  {u.name}
                </p>
                <div className="flex items-center gap-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="size-[12px] max-w-none" src={asset("19d6c.svg")} />
                  <p className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-[#334155]" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
                    {u.locationCount} study {u.locationCount === 1 ? "location" : "locations"}
                  </p>
                </div>
              </div>
              {effectiveSelected === u.id ? (
                <div className="flex size-[22px] shrink-0 items-center justify-center">
                  <div className="size-[12px] rounded-full bg-[#f97316]" />
                </div>
              ) : (
                <div className="size-[22px] shrink-0" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Continue button */}
      <button
        onClick={() => {
          const chosen = universities.find((u) => u.id === effectiveSelected);
          if (chosen) setUniversity(chosen.name, chosen.id);
          router.push("/student/info");
        }}
        disabled={!effectiveSelected}
        className="mt-[20px] flex w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-[#f97316] p-[16px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <p className="text-[15px] font-medium leading-normal text-white whitespace-nowrap" style={{ fontVariationSettings: '"CRSV" 0, "SHRP" 0' }}>
          Select university
        </p>
        <ArrowRight className="size-[18px] text-white" />
      </button>
    </main>
  );
}
