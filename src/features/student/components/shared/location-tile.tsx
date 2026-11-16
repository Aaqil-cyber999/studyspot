"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { ApiLocation } from "@/services/student";

const HOME_ASSET = (name: string) => `/assets/home/${name}`;

export interface LocationTileSpot {
  /** Used for the /student/results/[id] link and the bookmark action. */
  id: string;
  imageUrls: string[];
  lastUpdated?: string;
  name: string;
  building: string;
  address: string;
  description: string;
  rating: number;
  reviews: number;
  hours: string;
  amenities: string[];
  /** The student's own university — hidden in the subtitle (lists are already filtered). */
  universityName?: string | null;
}

export function toLocationTileSpot(location: ApiLocation): LocationTileSpot {
  return {
    id: location.id,
    imageUrls: location.imageUrls,
    lastUpdated: relative(location.lastUpdated),
    name: location.name,
    building: location.faculty ?? location.building ?? "Study space",
    address: location.address,
    description: location.description ?? "",
    rating: location.rating,
    reviews: location.reviews,
    hours: location.hours ?? "Hours vary",
    amenities: location.amenities ?? [],
    universityName: location.universityName,
  };
}

function relative(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Updated ${days}d ago`;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Trim repeated faculty/building and the redundant own-university name from the address. */
function displayLocation(building: string, address: string, universityName?: string | null): string {
  const b = building.trim();
  let a = address.trim();
  const strip = (text: string, prefix: string) => {
    const rx = new RegExp(`^${escapeRegExp(prefix.trim())}[\\s�-]*`, "i");
    return rx.test(text) ? text.replace(rx, "") : text;
  };
  if (b) {
    while (strip(a, b) !== a) a = strip(a, b);
  }
  if (universityName) {
    while (strip(a, universityName) !== a) a = strip(a, universityName);
  }
  return a || b || universityName?.trim() || "";
}

/** Shared study-space tile: photo header, rating/hours row, text-only amenity pills and a bookmark slot. */
export function LocationTile({
  spot,
  bookmark,
}: {
  spot: LocationTileSpot;
  /** 32px action button absolutely positioned over the photo (right-top). */
  bookmark?: React.ReactNode;
}) {
  const image = spot.imageUrls[0] ?? "/assets/home/838a8.png";

  return (
    <div className="relative mb-[12px]">
      <Link
        href={`/student/results/${spot.id}`}
        aria-label={`Open ${spot.name}`}
        className="block overflow-clip rounded-[16px] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
      >
        <div className="relative h-[160px] w-full overflow-clip rounded-tl-[16px] rounded-tr-[16px] bg-[#cbd5e1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full max-w-none scale-[1.05] object-cover" src={image} />
          {spot.lastUpdated ? (
            <p className="absolute left-[10px] top-[10px] rounded-full bg-white px-[9px] py-[4px] text-[11px] leading-[14px] text-black">
              {spot.lastUpdated}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]">
          <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">{spot.name}</p>
          <p className="text-[13px] font-medium leading-[18px] text-[#334155]">
            {(() => {
              const area = displayLocation(spot.building, spot.address, spot.universityName);
              return `${spot.building}${area ? ` · ${area}` : ""}`;
            })()}
          </p>
          {spot.description ? (
            <p className="line-clamp-2 text-[12px] leading-[17px] text-[#64748b]">{spot.description}</p>
          ) : null}
          <div className="flex items-center gap-[6px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="size-[14px] max-w-none" src={HOME_ASSET("30f3b.svg")} />
            <p className="text-[13px] font-medium tabular-nums text-[#0f172a]">{Number(spot.rating).toFixed(1)}</p>
            <p className="shrink-0 text-[13px] text-[#64748b]">·</p>
            <MessageSquare aria-hidden="true" className="size-[14px] shrink-0 text-[#94a3b8]" strokeWidth={2} />
            <p className="shrink-0 whitespace-nowrap text-[13px] font-medium tabular-nums text-[#0f172a]">{spot.reviews} reviews</p>
            <p className="shrink-0 text-[13px] text-[#64748b]">·</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="size-[14px] max-w-none student-invert" src={HOME_ASSET("9abac.svg")} />
            <p className="min-w-0 truncate text-[13px] text-[#334155]">{spot.hours}</p>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {spot.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center rounded-full bg-[#ddd] px-[10px] py-[6px] text-[12px] font-medium text-[#334155]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </Link>
      {bookmark}
    </div>
  );
}
