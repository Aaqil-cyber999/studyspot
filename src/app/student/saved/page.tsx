"use client";

import { useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { savedSpotCatalog } from "@/mocks/data/saved-spots";
import { SavedPlaceCard } from "@/features/student/components/saved/saved-place-card";
import { useSavedStore } from "@/stores/saved-store";

export default function SavedPage() {
  const savedSlugs = useSavedStore((state) => state.savedSlugs);
  const removeLocation = useSavedStore((state) => state.removeLocation);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const cardButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingFocus = useRef<string | "title" | null>(null);

  const cards = savedSlugs
    .map((slug) => savedSpotCatalog[slug])
    .filter((card) => card !== undefined);
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
  }, [savedSlugs]);

  function removeCard(slug: string, name: string) {
    const remaining = savedSlugs.filter((cardSlug) => cardSlug !== slug);

    pendingFocus.current = remaining[0] ?? "title";
    removeLocation(slug);
    toast.success(`${name} removed from saved places`);
  }

  return (
    <div className="flex min-h-screen w-[412px] mx-auto flex-col overflow-x-hidden overflow-y-auto bg-[#fbfbfc] px-[24px] pt-[20px] pb-[90px]">
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
          <SavedPlaceCard
            key={card.slug}
            card={card}
            buttonRef={(element) => {
              cardButtonRefs.current[card.slug] = element;
            }}
            onRemove={() => removeCard(card.slug, card.name)}
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
            <p className="text-[14px] leading-[20px] font-medium text-[#334155]">No saved places yet.</p>
          </>
        )}
      </div>
    </div>
  );
}
