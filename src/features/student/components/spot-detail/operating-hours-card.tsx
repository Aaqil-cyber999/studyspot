import { Clock, TrendingUp } from "lucide-react";
import type { OperatingHours, Tone } from "@/features/student/types/spot-detail";

const toneColor: Record<Tone, string> = {
  closed: "bg-[#cbd5de]",
  open: "bg-[#10b981]",
  peak: "bg-[#f97316]",
};

export function OperatingHoursCard({ hours }: { hours: OperatingHours }) {
  return (
    <section
      aria-label="Operating hours and peak prediction"
      className="relative flex w-full flex-col gap-2 rounded-xl bg-white px-[14px] py-3 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)]"
    >
      <div className="flex h-[22px] w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-[7px]">
          <Clock aria-hidden="true" className="size-[15px] shrink-0 text-[#64748a]" strokeWidth={2} />
          {hours.isOpen ? (
            <p className="shrink-0 font-body text-[13px] font-semibold text-[#077857]">{hours.openLabel}</p>
          ) : (
            <p className="shrink-0 font-body text-[13px] font-semibold text-[#9d4300]">Closed now</p>
          )}
          <span aria-hidden="true" className="h-[13px] w-px shrink-0 bg-[#e2e8f0]" />
          <p className="truncate font-body text-[13px] text-[#515f74]">{hours.closesLabel}</p>
        </div>

        <div className="flex h-[22px] shrink-0 items-center gap-[5px] rounded-full bg-[#ffdbca] px-[9px]">
          <TrendingUp aria-hidden="true" className="size-[13px] shrink-0 text-[#f97316]" strokeWidth={2} />
          <p className="font-body text-[11px] font-semibold text-[#341100]">{hours.peakLabel}</p>
        </div>
      </div>

      <div
        role="img"
        aria-label={hours.segments.map((segment) => segment.label).join(". ")}
        className="flex h-2 w-full items-center gap-0.5 overflow-clip rounded-full bg-[#f1f5f8]"
      >
        {hours.segments.map((segment, index) => (
          <span
            key={`${segment.label}-${index}`}
            className={`h-2 min-w-0 ${toneColor[segment.tone]} ${
              index === 0 || index === hours.segments.length - 1 ? "rounded-[4px]" : "rounded-[2px]"
            }`}
            style={{ flexGrow: segment.weight, flexBasis: 0 }}
          />
        ))}
      </div>

      <div aria-hidden="true" className="relative h-3.5 w-full overflow-clip font-body text-[11px] text-[#64748a]">
        {hours.labels.map((label) => (
          <span key={label.label} className="absolute top-0 whitespace-nowrap" style={{ left: `${label.left}%` }}>
            {label.label}
          </span>
        ))}
      </div>

      <p className="sr-only">
        {hours.openLabel}. {hours.closesLabel}. {hours.peakLabel}.
      </p>
    </section>
  );
}
