import { GraduationCap } from "lucide-react";

interface PageLoaderProps {
  /** Text shown below the spinner. Announced to assistive technology via role="status". */
  label?: string;
  /** Extra classes for the wrapper, e.g. sizing it to fill the current page. */
  className?: string;
}

/**
 * Centered, iconed loading indicator shared by route-level `loading.tsx`
 * files and client pages that wait on mock query data.
 */
export function PageLoader({
  label = "Loading…",
  className = "py-[64px]",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full flex-col items-center justify-center gap-[14px] ${className}`}
    >
      <span aria-hidden="true" className="relative grid size-[64px] place-items-center">
        <span className="absolute inset-0 rounded-full border-[3px] border-[#fed7aa] border-t-[#f97316] motion-safe:animate-spin" />
        <GraduationCap
          aria-hidden="true"
          className="size-[28px] text-[#f97316]"
          strokeWidth={2}
        />
      </span>
      <span className="text-[14px] font-medium leading-[20px] text-[#64748b]">{label}</span>
    </div>
  );
}
