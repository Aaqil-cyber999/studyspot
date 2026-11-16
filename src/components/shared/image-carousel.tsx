"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageCarouselProps {
  previewUrls: string[];
  currentIdx: number;
  onRemove: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  showRemoveButton?: boolean;
}

export function ImageCarousel({
  previewUrls,
  currentIdx,
  onRemove,
  onPrev,
  onNext,
  showRemoveButton = true,
}: ImageCarouselProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[12px] bg-[white]">
      {previewUrls.length === 0 && (
        <p className="h-[200px] flex items-center justify-center text-center text-[12px] text-[#64748b]">
          No images uploaded
        </p>
      )}
      {previewUrls.length > 0 && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrls[Math.min(currentIdx, previewUrls.length - 1)]}
            alt={`Preview ${Math.min(currentIdx, previewUrls.length - 1) + 1} of ${previewUrls.length}`}
            className="h-[200px] w-full object-cover"
          />

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
              <div
                className="absolute top-1/2 left-2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                onClick={onPrev}
              >
                <ChevronLeft size={18} aria-label="Previous image" />
              </div>
              <div
                className="absolute top-1/2 right-2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-sm hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                onClick={onNext}
              >
                <ChevronRight size={18} aria-label="Next image" />
              </div>
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