import Link from "next/link";
import { Armchair, ChevronRight, ClipboardPen, Clock, Users, Wifi } from "lucide-react";
import type { LiveMetric, LiveMetricIcon } from "@/features/student/types/spot-detail";

const metricIcon: Record<LiveMetricIcon, typeof Armchair> = {
  armchair: Armchair,
  users: Users,
  wifi: Wifi,
};

interface CurrentStatusSectionProps {
  metrics: LiveMetric[];
  lastUpdated: string;
}

export function CurrentStatusSection({ metrics, lastUpdated }: CurrentStatusSectionProps) {
  return (
    <section aria-labelledby="current-status-heading" className="flex w-full flex-col gap-[15px]">
      <div className="flex h-[21px] w-full items-center justify-between gap-2">
        <h2 id="current-status-heading" className="font-body text-[18px] font-semibold leading-6 text-[#0b1c30]">
          Current Status
        </h2>

        <div className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#ddd] p-[5px]">
          <span className="flex size-5 shrink-0 items-center justify-center overflow-clip rounded-md bg-[rgba(66,133,244,0.14)]">
            <Clock aria-hidden="true" className="size-3 text-[#4285f4]" strokeWidth={2} />
          </span>
          <p className="font-body text-[11px] font-medium leading-[14px] text-black">{lastUpdated}</p>
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-3">
        {metrics.map((metric) => {
          const Icon = metricIcon[metric.icon];

          return (
            <article key={metric.id} aria-label={`${metric.label}: ${metric.value}`} className="flex h-[124px] min-w-px flex-1 flex-col items-start gap-2.5 rounded-xl bg-white px-3 py-3.5 ring-1 ring-[#e2e8f0] ring-inset drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-start">
                <span className="flex size-7 items-center justify-center rounded-[9px]" style={{ backgroundColor: metric.iconBackground }}>
                  <Icon aria-hidden="true" className="size-4" strokeWidth={2} style={{ color: metric.iconColor }} />
                </span>
                <p className="mt-2.5 font-body text-[11px] leading-[14px] text-[#64748b]">{metric.label}</p>
                <p className="mt-1 font-body text-[18px] font-semibold leading-6 text-[#0b1c30]">{metric.value}</p>
              </div>

              <div aria-hidden="true" className="flex h-1.5 w-full items-center gap-0.5 rounded-full">
                {metric.segments.map((segment) => (
                  <span key={segment.label} className="h-1.5 min-w-0 flex-1 rounded-full" style={{ backgroundColor: segment.color }} />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <Link href="/student/rate" className="flex h-[46px] w-full items-center justify-center gap-[10px] overflow-clip rounded-xl border border-[#e2e8f0] bg-[#f97316] px-3.5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#ea6a0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
        <span className="flex items-center gap-2.5">
          <ClipboardPen aria-hidden="true" className="size-[18px] shrink-0 text-white" strokeWidth={2} />
          <span className="text-[14px] font-semibold leading-normal text-white">Report Current Status</span>
        </span>
      </Link>
    </section>
  );
}
