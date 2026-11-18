import Link from "next/link";
import { Armchair, ClipboardPen, Clock, MessageCircle, User, Users, Volume2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveMetric, LiveMetricIcon } from "@/features/student/types/spot-detail";

const metricIcon: Record<LiveMetricIcon, typeof Armchair> = {
  armchair: Armchair,
  users: Users,
  wifi: Wifi,
  volume: Volume2,
};

function getFilledSegmentCount(metric: LiveMetric) {
  if (metric.value === null) return 0;

  if (metric.id === "seats") {
    if (metric.value === "Available" || metric.value === "Yes") return 3;
    if (metric.value === "Limited") return 2;
    return 1;
  }

  if (metric.id === "wifi") {
    return metric.value === "Strong" ? 3 : metric.value === "Medium" ? 2 : 1;
  }

  if (metric.id === "noise") {
    return metric.value === "Quiet" ? 3 : metric.value === "Moderate" ? 2 : 1;
  }

  return metric.value === "High" ? 3 : metric.value === "Medium" ? 2 : 1;
}

interface CurrentStatusSectionProps {
  metrics: LiveMetric[];
  /** Relative time of the latest report; omit when nothing has been reported. */
  lastUpdated?: string;
  showReportButton?: boolean;
  /** When given, the report button links to /student/rate with the spot id + name. */
  locationId?: string;
  spotName?: string;
  /** Optional latest-report comment from a student — rendered above the report button. */
  reportComment?: string | null;
  /** Name of the student who filed the latest status report — rendered above the report button. */
  lastReportedByName?: string | null;
  /** Faculty of the student who filed the latest status report — rendered next to their name. */
  lastReportedByFaculty?: string | null;
}

export function CurrentStatusSection({ metrics, lastUpdated, showReportButton = true, locationId, spotName, reportComment, lastReportedByName, lastReportedByFaculty }: CurrentStatusSectionProps) {
  const reportHref = locationId
    ? `/student/rate?locationId=${encodeURIComponent(locationId)}&name=${encodeURIComponent(spotName ?? "")}`
    : "/student/rate";
  return (
    <section aria-labelledby="current-status-heading" className="flex w-full flex-col gap-[15px]">
      <div className="flex h-[21px] w-full items-center justify-between gap-2">
        <h2 id="current-status-heading" className="font-body text-[18px] font-semibold leading-6 text-[#0b1c30]">
          Current Status
        </h2>

        {lastUpdated ? (
          <div className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#fed7aa] px-2.5 py-1.5">
            <Clock aria-hidden="true" className="size-3.5 text-[#f97316]" strokeWidth={2} />
            <p className="font-body text-[11px] font-medium leading-[14px] text-[#9a3412]">{lastUpdated}</p>
          </div>
        ) : null}
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metricIcon[metric.icon];
          const unreported = metric.value === null;
          const filledSegmentCount = getFilledSegmentCount(metric);

          return (
            <article
              key={metric.id}
              aria-label={unreported ? `${metric.label}: Not reported yet` : `${metric.label}: ${metric.value}`}
              className={cn(
                "flex h-[104px] min-w-0 flex-col items-start justify-between gap-2 rounded-xl px-3 py-3 ring-1 ring-inset drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)]",
                unreported ? "bg-[#f1f5f9] ring-[#e2e8f0]" : "bg-white ring-[#e2e8f0]",
              )}
            >
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-[9px]"
                    style={{ backgroundColor: unreported ? "#e2e8f0" : metric.iconBackground }}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={2}
                      style={{ color: unreported ? "#94a3b8" : metric.iconColor }}
                    />
                  </span>
                  <p className="min-w-0 font-body text-[11px] leading-[14px] text-[#64748b]">{metric.label}</p>
                </div>
                <p
                  className={cn(
                    "font-body leading-6",
                    unreported
                      ? "text-[12px] font-medium text-[#94a3b8]"
                      : "text-[18px] font-semibold text-[#0b1c30]",
                  )}
                >
                  {unreported ? "Not reported yet" : metric.value}
                </p>
              </div>

              <div aria-hidden="true" className="flex h-1.5 w-full items-center gap-0.5 rounded-full">
                {metric.segments.map((segment, index) => (
                  <span
                    key={segment.label}
                    className={cn(
                      "h-1.5 min-w-0 flex-1 rounded-full",
                      index >= filledSegmentCount && "bg-[#e2e8f0]",
                    )}
                    style={
                      index < filledSegmentCount
                        ? { backgroundColor: metric.iconColor }
                        : undefined
                    }
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {reportComment?.trim() ? (
        <blockquote
          aria-label="Latest reported comment"
          className="flex w-full items-start gap-2 rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-3 py-2.5"
        >
          <MessageCircle
            aria-hidden="true"
            className="mt-[2px] size-4 shrink-0 text-[#f97316]"
            strokeWidth={2}
          />
          <p className="text-[13px] leading-5 text-[#7c2d12]">{reportComment.trim()}</p>
        </blockquote>
      ) : null}

      {lastReportedByName ? (
        <div className="flex w-full items-center gap-2" aria-label="Last reported by">
          <User aria-hidden="true" className="size-4 shrink-0 text-[#f97316]" strokeWidth={2} />
          <p className="min-w-0 truncate font-body text-[12px] font-medium leading-5 text-[#515f74]">
            Last reported by{" "}
            <span className="font-semibold text-[#334052]">{lastReportedByName}</span>
            {lastReportedByFaculty?.trim() ? (
              <span className="font-normal text-[#94a3b8]"> — {lastReportedByFaculty.trim()}</span>
            ) : null}
          </p>
        </div>
      ) : null}

      {showReportButton && (
        <Link href={reportHref} className="flex h-[46px] w-full items-center justify-center gap-[10px] overflow-clip rounded-xl border border-[#e2e8f0] bg-[#f97316] px-3.5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#ea6a0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2">
          <span className="flex items-center gap-2.5">
            <ClipboardPen aria-hidden="true" className="size-[18px] shrink-0 text-white" strokeWidth={2} />
            <span className="text-[14px] font-semibold leading-normal text-white">Report Current Status</span>
          </span>
        </Link>
      )}
    </section>
  );
}
