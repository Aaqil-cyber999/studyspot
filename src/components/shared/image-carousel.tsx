"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageCarouselProps {
  previewUrls: string[];
  currentIdx: number;
  onRemove: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  showRemoveButton?: boolean;
  /** Auto-advance delay in ms. Set to 0 to disable. Default 5000. */
  autoAdvanceMs?: number;
  /** Square-off the bottom-left/right corners (e.g. image bleeding into a body flush with it). Default false. */
  squareBottomCorners?: boolean;
}

export function ImageCarousel({
  previewUrls,
  currentIdx,
  onRemove,
  onPrev,
  onNext,
  showRemoveButton = true,
  autoAdvanceMs = 5000,
  squareBottomCorners = false,
}: ImageCarouselProps) {
  const [paused, setPaused] = useState(false);

  // Auto-advance through the gallery. Restarts whenever the slide changes,
  // pauses on hover/focus, and respects reduced-motion preferences.
  useEffect(() => {
    if (previewUrls.length <= 1) return;
    if (autoAdvanceMs <= 0) return;
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(onNext, autoAdvanceMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, paused, previewUrls.length, autoAdvanceMs]);
  return (
    <div
      className={squareBottomCorners
        ? "relative w-full overflow-hidden rounded-t-[12px] rounded-b-none bg-[white]"
        : "relative w-full overflow-hidden rounded-[12px] bg-[white]"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {previewUrls.length === 0 && (
        <p className="h-[200px] flex items-center justify-center text-center text-[12px] text-[#64748b]">
          No images uploaded
        </p>
      )}
      {previewUrls.length > 0 && (
        <>
          {/* Horizontal track: translates so each image slides in from the side */}
          <div className="h-[200px] w-full overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0.24,1)] motion-reduce:transition-none will-change-transform"
              style={{ transform: `translate3d(-${Math.min(currentIdx, previewUrls.length - 1) * 100}%, 0, 0)` }}
            >
              {previewUrls.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`Preview ${index + 1} of ${previewUrls.length}`}
                  className="h-[200px] w-full shrink-0 object-cover"
                  draggable={false}
                />
              ))}
            </div>
          </div>

          {showRemoveButton && (
            <button
              type="button"
              onClick={() => onRemove(currentIdx)}
              aria-label="Remove this image"
              className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
            >
              <X size={14} className="text-[#f97316]" />
            </button>
          )}

          {/* Navigation arrows and count - only rendered when multiple images */}
          {previewUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous image"
                className="absolute top-1/2 left-2 -translate-y-1/2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next image"
                className="absolute top-1/2 right-2 -translate-y-1/2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                {currentIdx + 1} / {previewUrls.length}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}