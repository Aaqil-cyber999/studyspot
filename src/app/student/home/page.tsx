"use client";

import Link from "next/link";
import { GraduationCap, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getStudyLocations, getStudentProfile } from "@/services/student";
import { LocationTile } from "@/features/student/components/shared/location-tile";
import { SpotBookmark } from "@/features/student/components/discover/spot-bookmark";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { useProfileStore } from "@/stores/profile-store";
import { STUDENT_AMENITY_OPTIONS } from "@/services/student";


const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

type Spot = Awaited<ReturnType<typeof getStudyLocations>>[number];

const searchableText = (spot: Spot) =>
  normalize([spot.name, spot.category, spot.area, spot.description, spot.hours, ...spot.amenities].join(" "));

function matchesFilter(spot: Spot, filter: string) {
  if (filter === "Quiet") {
    const text = [spot.name, spot.category, spot.description, ...spot.amenities].join(" ").toLocaleLowerCase();
    return text.includes("quiet") || text.includes("silent");
  }

  if (filter === "Seats available") return spot.seats === "Yes";

  const normalizedFilter = normalize(filter);
  return spot.amenities.some((amenity) => {
    const normalizedAmenity = normalize(amenity);

    if (normalizedFilter === "wifi") return normalizedAmenity.includes("wifi");
    if (normalizedFilter === "poweroutlet") return normalizedAmenity.includes("poweroutlet");
    if (normalizedFilter === "printer") return normalizedAmenity.includes("print");
    if (normalizedFilter === "accessibleseating") return normalizedAmenity.includes("accessible");

    return normalizedAmenity === normalizedFilter;
  });
}

export default function StudentHomePage() {
  const profileName = useProfileStore((state) => state.name);
  const profileImage = useProfileStore((state) => state.image);
  const configuredAmenities = useMemo(() => [...STUDENT_AMENITY_OPTIONS], []);
  const filterChips = useMemo(() => ["Quiet", "Seats available", ...configuredAmenities], [configuredAmenities]);
  const { data: me } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: getStudentProfile,
  });
  const universityId = me?.universityId;
  const { data: studySpotCatalog = [], isPending } = useQuery({
    queryKey: ["student", "locations", universityId],
    queryFn: () => getStudyLocations(universityId),
    enabled: !!me,
  });
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const normalizedQuery = normalize(query);
  const firstName = profileName.trim().split(/\s+/)[0] || profileName;
  const visibleSpots = useMemo(
    () =>
      studySpotCatalog.filter((spot) => {
        const matchesSearch = !normalizedQuery || searchableText(spot).includes(normalizedQuery);
        const matchesSelectedFilter = !selectedFilter || matchesFilter(spot, selectedFilter);

        return matchesSearch && matchesSelectedFilter;
      }),
    [studySpotCatalog, normalizedQuery, selectedFilter],
  );

  return (
    <>
      <div className="relative left-0 right-0 top-0 mx-auto h-[200px] overflow-x-hidden overflow-y-auto bg-[#f97316]">
        <div className="px-[24px] pt-[20px]">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[24px] font-bold leading-[29px] tracking-[-0.5px] text-white">Hey, {firstName}!</p>
              <p className="text-[14px] leading-[20px] text-white/90">Find your next study spot</p>
            </div>
            <Link href="/student/profile" aria-label="Open your profile" className="relative flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-[20px] border-2 border-solid border-white">
              <ProfileAvatar name={profileName} imageUrl={profileImage} className="student-keep-light size-full rounded-[20px] bg-white" textClassName="text-[13px] text-[#f97316]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative -mt-[110px] w-full rounded-tl-[40px] rounded-tr-[40px] bg-[#E2E8F0] px-[24px] pb-0 pt-[16px]">
        <div className="mt-[5px] flex items-center gap-[12px] overflow-clip rounded-[26px] bg-white px-[18px] py-[14px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <Search className="size-[20px] shrink-0 text-[#64748b]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search place, area, amenity"
            aria-label="Search study places"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#64748b] outline-none placeholder:text-[#64748b]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="flex size-[20px] shrink-0 items-center justify-center rounded-full text-[#64748b] focus-visible:outline-2 focus-visible:outline-[#f97316]">
              <X className="size-[16px]" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div role="group" aria-label="Filters" tabIndex={0} className="-mx-[24px] mt-[15px] flex gap-[8px] overflow-x-auto overscroll-x-contain px-[24px] [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] [&::-webkit-scrollbar]:hidden">
          {filterChips.map((filter) => {
            const active = selectedFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedFilter(active ? "" : filter)}
                className={cn("inline-flex h-[34px] shrink-0 items-center rounded-[18px] px-[14px] py-0 focus-visible:outline-2 focus-visible:outline-[#f97316]", active ? "bg-[#f97316]" : "bg-white")}
              >
                <span className={cn("whitespace-nowrap text-[13px] font-medium", active ? "text-white" : "text-[#334052]")}>{filter}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-3 mt-[16px] flex items-baseline justify-between gap-3">
          <p className="text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[#0f172a]">Recommended study spaces</p>
          <p className="shrink-0 text-[12px] text-[#64748b]" aria-live="polite">
            {visibleSpots.length} {visibleSpots.length === 1 ? "place" : "places"}
          </p>
        </div>

        {isPending ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading study spaces…</div>
        ) : visibleSpots.length ? (
          <div>
            {visibleSpots.map((spot) => (
              <LocationTile
                key={spot.id}
                spot={{ ...spot, building: spot.category, address: spot.area }}
                bookmark={<SpotBookmark slug={spot.id} name={spot.name} />}
              />
            ))}
          </div>
        ) : !universityId ? (
          <div className="flex min-h-[calc(100dvh-420px)] flex-col items-center justify-center rounded-[16px] bg-[#f8fafc] px-6 text-center">
            <GraduationCap className="mb-3 size-8 text-[#f97316]" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-[#0f172a]">Select your university</p>
            <p className="mt-1 text-[13px] text-[#64748b]">Discover shows study spots on your own campus only.</p>
            <Link href="/student/select-university" className="mt-4 rounded-full bg-[#fed7aa] px-4 py-2 text-[13px] font-medium text-[#9a3412] focus-visible:outline-2 focus-visible:outline-[#f97316]">
              Choose university
            </Link>
          </div>
        ) : (
          <div className="flex min-h-[calc(100dvh-420px)] flex-col items-center justify-center rounded-[16px] bg-[#f8fafc] px-6 text-center">
            <Search className="mb-3 size-8 text-[#f97316]" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-[#0f172a]">No study places found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">Try a faculty, amenity, or shorter search phrase.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-4 rounded-full bg-[#fed7aa] px-4 py-2 text-[13px] font-medium text-[#9a3412] focus-visible:outline-2 focus-visible:outline-[#f97316]">
              Clear search
            </button>
          </div>
        )}
      </div>
    </>
  );
}
