"use client";

import toast from "react-hot-toast";
import { useSavedStore } from "@/stores/saved-store";

interface SpotBookmarkProps {
  slug: string;
  name: string;
}

/**
 * Bookmark control on a Discover tile. Toggles the place in the shared saved
 * list (same icon assets as the spot info page) without following the tile link.
 */
export function SpotBookmark({ slug, name }: SpotBookmarkProps) {
  const saved = useSavedStore((state) => state.savedSlugs.includes(slug));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  function handleToggle() {
    toggleSaved(slug);
    toast.success(
      saved ? `${name} removed from saved places` : `${name} added to saved places`,
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={saved ? `Remove ${name} from saved places` : `Save ${name} to saved places`}
      aria-pressed={saved}
      className="absolute left-[320px] top-[12px] z-10 flex size-[32px] items-center justify-center overflow-clip rounded-[16px] bg-white focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="size-[16px] max-w-none"
        src={saved ? "/assets/saved/5cc8f.svg" : "/assets/saved/bookmark-outline.svg"}
      />
    </button>
  );
}
