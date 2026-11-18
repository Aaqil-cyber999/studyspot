"use client";

import { useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { LocationTile, toLocationTileSpot } from "@/features/student/components/shared/location-tile";
import { useSavedPlaces } from "@/hooks/use-saved-places";

export default function SavedPage() {
  const { savedPlaces, isPending, removeSaved } = useSavedPlaces();
  const titleRef = useRef<HTMLParagraphElement>(null);
  const cardButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingFocus = useRef<string | "title" | null>(null);

  const cards = savedPlaces.map((row) => toLocationTileSpot(row.location));
  const isEmpty = cards.length === 0;

  // After a card is removed, move focus to the next bookmark (or the title)
  // so keyboard users are not dropped back to the top of the document.
  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;

    pendingFocus.current = null;

    const element =
      target === "title"
        ? titleRef.current
        : (cardButtonRefs.current[target] ?? titleRef.current);

    element?.focus();
  }, [savedPlaces]);

  function removeCard(id: string, name: string) {
    const remaining = cards.filter((card) => card.id !== id);

    pendingFocus.current = remaining[0]?.id ?? "title";
    removeSaved(id);
    toast.success(`${name} removed from saved places`);
  }

  return (
    <div className="flex min-h-screen w-full md:max-w-[412px] mx-auto flex-col overflow-x-hidden overflow-y-auto bg-[#E2E8F0] px-[24px] pt-[20px] pb-[90px]">
      <p
        ref={titleRef}
        tabIndex={-1}
        className="mb-[19px] text-[20px] font-bold leading-[25px] tracking-[-0.3px] text-[#0f172a]"
      >
        Saved places
      </p>

      <div
        className={
          isEmpty
            ? "flex flex-1 flex-col items-center justify-center gap-[16px] text-center"
            : "flex flex-col"
        }
      >
        {cards.map((card) => (
          <LocationTile
            key={card.id}
            spot={card}
            bookmark={
              <button
                ref={(element) => {
                  cardButtonRefs.current[card.id] = element;
                }}
                type="button"
                onClick={() => removeCard(card.id, card.name)}
                aria-label={`Remove ${card.name} from saved places`}
                aria-pressed="true"
                className="absolute right-[12px] top-[12px] z-10 flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="size-[16px] max-w-none" src="/assets/saved/5cc8f.svg" />
              </button>
            }
          />
        ))}

        {isEmpty && (
          <>
            <span className="flex size-[64px] items-center justify-center rounded-full bg-[#ffdbca]">
              <Bookmark
                aria-hidden
                strokeWidth={1.5}
                className="size-[28px] fill-[#f97316] text-[#f97316]"
              />
            </span>
            <p className="text-[14px] leading-[20px] font-medium text-[#334155]">
              {isPending ? "Loading saved places…" : "No saved places yet."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
