export type Tone = "closed" | "open" | "peak";

export interface TimelineSegment {
  label: string;
  /** Relative width of the segment within the timeline. */
  weight: number;
  tone: Tone;
}

export interface TimelineLabel {
  label: string;
  /** Position as a percentage of the timeline width. */
  left: number;
}

export interface OperatingHours {
  isOpen: boolean;
  openLabel: string;
  closesLabel: string;
  peakLabel: string;
  segments: TimelineSegment[];
  labels: TimelineLabel[];
}

export type LiveMetricIcon = "armchair" | "users" | "wifi" | "volume";

export interface LiveMetricSegment {
  label: string;
  color: string;
}

export interface LiveMetric {
  id: string;
  label: string;
  /** `null` means no student has reported this metric yet. */
  value: string | null;
  icon: LiveMetricIcon;
  iconBackground: string;
  iconColor: string;
  segments: LiveMetricSegment[];
}

export interface SpotAmenity {
  label: string;
  icon: string;
  /** Natural width of the icon artwork, in px. */
  iconWidth: number;
  /** Natural height of the icon artwork, in px. */
  iconHeight: number;
}

export interface SpotReview {
  id: string;
  rating: number;
  initials: string;
  author: string;
  meta: string;
  text: string;
  avatarBackground: string;
  avatarColor: string;
  helpfulVotes: number;
  votedByMe: boolean;
  /** Author's faculty (shown under the student name). */
  faculty?: string | null;
}

export interface SpotReviewSummary {
  verdict: string;
  verdictDetail: string;
  mentions: string[];
}

export interface SpotDetail {
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  staffMonitored: boolean;
  hero: {
    image: string;
    alt: string;
    photoCount: number;
    /** Full ordered gallery URLs — used by the carousel. */
    images: string[];
  };
  hours: OperatingHours;
  /** Relative time of the latest report; absent when nobody has reported yet. */
  lastUpdated?: string;
  /** Optional comment from the latest student status report. */
  reportComment?: string | null;
  /** Name of the student who filed the latest status report, when known. */
  lastReportedByName?: string | null;
  /** Faculty of the student who filed the latest status report, when known. */
  lastReportedByFaculty?: string | null;
  metrics: LiveMetric[];
  amenities: SpotAmenity[];
  reviews: SpotReviewSummary & {
    items: SpotReview[];
  };
}
