"use client";

import Link from "next/link";
import {
  Accessibility,
  AirVent,
  Armchair,
  Beaker,
  BookOpen,
  Boxes,
  Clock3,
  CircleHelp,
  Coffee,
  FlaskConical,
  Library,
  Monitor,
  Microscope,
  PencilRuler,
  Presentation,
  Plug,
  Printer,
  Search,
  ScanLine,
  Table2,
  Users,
  VolumeX,
  Waves,
  Wifi,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { studySpotCatalog } from "@/mocks/data/study-spots";
import { SpotBookmark } from "@/features/student/components/discover/spot-bookmark";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { useProfileStore } from "@/stores/profile-store";
import { useAdminOptionsStore } from "@/stores/admin-options-store";

const a = (name: string) => `/assets/home/${name}`;
const amenityIcons: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  "Power outlets": Plug,
  "Power outlet": Plug,
  Computers: Monitor,
  "60 computers": Monitor,
  "Air conditioning": AirVent,
  "Silent zones": VolumeX,
  "Quiet zones": VolumeX,
  "Quiet seating": Armchair,
  "Individual carrels": Table2,
  "Open tables": Table2,
  "Group work": Users,
  "Group study": Users,
  "Casual seating": Armchair,
  "Spacious seating": Armchair,
  "Design studios": PencilRuler,
  "Open late": Clock3,
  "Library space": Library,
  "Reading desks": BookOpen,
  "Reference books": BookOpen,
  "Lecture rooms": BookOpen,
  "Seminar space": Presentation,
  Whiteboard: Presentation,
  "Near photocopier": Printer,
  Printing: Printer,
  Printers: Printer,
  Photocopier: Printer,
  Scanners: ScanLine,
  "Research equipment": FlaskConical,
  Equipment: Wrench,
  "Computer access": Monitor,
  "GIS software": Boxes,
  Matlab: Monitor,
  Petrel: Monitor,
  "Simulation software": Monitor,
  "Medical technology": Beaker,
  "Hands-on learning": Wrench,
  Prototyping: Wrench,
  "Project space": Boxes,
  "Project work": Boxes,
  "Research work": Boxes,
  "Practical work": FlaskConical,
  Oceanography: Waves,
  Characterisation: Microscope,
  Synthesis: FlaskConical,
  Processing: Wrench,
  "Motion analysis": Accessibility,
  Cafeteria: Coffee,
};

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

const searchableText = (spot: (typeof studySpotCatalog)[number]) =>
  normalize([spot.name, spot.category, spot.area, spot.description, spot.hours, ...spot.amenities].join(" "));

function matchesFilter(spot: (typeof studySpotCatalog)[number], filter: string) {
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
  const options = useAdminOptionsStore((state) => state.options);
  const configuredAmenities = useMemo(
    () =>
      options
        .filter((option) => option.category === "amenities" && option.active)
        .sort((a, b) => a.order - b.order)
        .map((option) => option.label),
    [options],
  );
  const filterChips = useMemo(() => ["Quiet", "Seats available", ...configuredAmenities], [configuredAmenities]);
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
    [normalizedQuery, selectedFilter],
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
              <ProfileAvatar name={profileName} imageUrl={profileImage} className="size-full rounded-[20px] bg-white" textClassName="text-[13px] text-[#f97316]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative -mt-[110px] w-full rounded-tl-[40px] rounded-tr-[40px] bg-white px-[24px] pb-0 pt-[16px]">
        <div className="mt-[5px] flex items-center gap-[12px] overflow-clip rounded-[26px] bg-[#ddd] px-[18px] py-[14px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
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
                className={cn("inline-flex h-[34px] shrink-0 items-center rounded-[18px] px-[14px] py-0 focus-visible:outline-2 focus-visible:outline-[#f97316]", active ? "bg-[#f97316]" : "bg-[#ddd]")}
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

        {visibleSpots.length ? (
          <div>
            {visibleSpots.map((spot) => (
              <div key={spot.slug} className="relative mb-[12px]">
                <Link href={`/student/results/${spot.slug}`} className="block overflow-clip rounded-[16px] bg-[#ddd] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
                  <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px] bg-[#cbd5e1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" className="absolute inset-0 size-full max-w-none scale-[1.05] object-cover" src={spot.imageUrls[0]} />
                    <p className="absolute left-[10px] top-[10px] rounded-full bg-white px-[9px] py-[4px] text-[11px] leading-[14px] text-black">
                      {spot.lastUpdated}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
                    <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">{spot.name}</p>
                    <p className="text-[13px] font-medium leading-[18px] text-[#334155]">{spot.category} · {spot.area}</p>
                    <p className="line-clamp-2 text-[12px] leading-[17px] text-[#64748b]">{spot.description}</p>
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="size-[14px] max-w-none" src={a("30f3b.svg")} />
                      <p className="text-[13px] font-medium text-[#0f172a]">{spot.rating.toFixed(1)} · {spot.reviews} reviews</p>
                      <p className="text-[13px] text-[#64748b]">·</p>
                      <img alt="" className="size-[14px] max-w-none" src={a("9abac.svg")} />
                      <p className="truncate text-[13px] text-[#334155]">{spot.hours}</p>
                    </div>
                    <div className="flex flex-wrap gap-[8px]">
                      {spot.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]">
                          {(() => {
                            const Icon = amenityIcons[amenity] ?? CircleHelp;
                            return <Icon aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2} />;
                          })()}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <SpotBookmark slug={spot.slug} name={spot.name} />
              </div>
            ))}
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
