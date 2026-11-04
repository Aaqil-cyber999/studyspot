"use client";

import { cn } from "@/lib/utils";
import type { SavedSpotCard } from "@/mocks/data/saved-spots";

interface SavedPlaceCardProps {
  card: SavedSpotCard;
  onRemove: () => void;
  buttonRef: (element: HTMLButtonElement | null) => void;
}

export function SavedPlaceCard({ card, onRemove, buttonRef }: SavedPlaceCardProps) {
  const outlined = card.variant === "outlined";

  return (
    <div
      className={cn(
        "mb-[19px] flex flex-col items-start rounded-[16px]",
        outlined
          ? "overflow-clip border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]"
          : "bg-[#ddd] drop-shadow-[0px_4px_8px_rgba(0,0,0,0.08)]",
      )}
    >
      <div
        className={cn(
          "relative h-[160px] w-full overflow-clip",
          !outlined && "rounded-tl-[16px] rounded-tr-[16px]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
          src={card.image}
        />
        <button
          ref={buttonRef}
          type="button"
          onClick={onRemove}
          className="absolute left-[320px] top-[12px] flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={`Remove ${card.name} from saved places`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[16px] max-w-none" src="/assets/saved/5cc8f.svg" />
        </button>
      </div>

      <div
        className={cn(
          "flex w-full flex-col gap-[8px] px-[16px] pb-[16px] pt-[14px]",
          outlined && "bg-[#ddd]",
        )}
      >
        <p className="text-[18px] font-semibold leading-[24px] text-[#0f172a]">{card.name}</p>
        <p className="text-[13px] font-medium leading-[18px] text-[#334155]">{card.subtitle}</p>
        <div className="flex items-center gap-[6px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="size-[14px] max-w-none" src="/assets/saved/30f3b.svg" />
          <p className="text-[13px] font-medium leading-[18px] text-[#0f172a]">
            {card.rating.toFixed(1)} · {card.reviews} reviews
          </p>
        </div>
        <div className="flex flex-wrap gap-[8px]">
          {card.amenities.map((amenity) => (
            <span
              key={amenity.label}
              className="inline-flex items-center gap-[6px] rounded-full bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium leading-[16px] text-[#334155]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="size-[14px] max-w-none" src={amenity.icon} /> {amenity.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
