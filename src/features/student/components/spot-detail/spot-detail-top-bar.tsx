"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSavedStore } from "@/stores/saved-store";

const iconButton =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddd] transition-colors hover:bg-[#d0d0d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2";

// Bookmark icon from the Saved tab, sized to the neighbouring icons (16px)
// inside the shared 40px icon button.
const favoriteIcon = "h-[16px] w-[16px] max-w-none";

export function SpotDetailTopBar({
  slug,
  onAddReview,
}: {
  slug: string;
  onAddReview: () => void;
}) {
  const router = useRouter();
  const saved = useSavedStore((state) => state.savedSlugs.includes(slug));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  function toggleSavedWithToast() {
    toggleSaved(slug);
    toast.success(
      saved ? "Removed from saved places" : "Added to saved places",
    );
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to copy the link");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-[rgba(248,249,255,0.9)] px-4 py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[6px]">
      <button type="button" onClick={() => router.back()} className={iconButton} aria-label="Go back">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-[13.333px] w-[13.333px] max-w-none" src="/assets/detail/c667a.svg" />
      </button>

      <div className="flex items-center gap-1">
        <button type="button" onClick={share} className={iconButton} aria-label="Share this spot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="h-[16.667px] w-[15px] max-w-none" src="/assets/detail/70707.svg" />
        </button>

        <button
          type="button"
          onClick={onAddReview}
          className={iconButton}
          aria-label="Add a review"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="h-[15.747px] w-[16.5px] max-w-none" src="/assets/detail/6fcc3.svg" />
        </button>

        <button
          type="button"
          onClick={toggleSavedWithToast}
          className={iconButton}
          aria-label={saved ? "Remove from saved spots" : "Save this spot"}
          aria-pressed={saved}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className={favoriteIcon}
            src={
              saved
                ? "/assets/saved/5cc8f.svg"
                : "/assets/saved/bookmark-outline.svg"
            }
          />
        </button>
      </div>

    </header>
  );
}