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

export type LiveMetricIcon = "armchair" | "users" | "wifi";

export interface LiveMetricSegment {
  label: string;
  color: string;
}

export interface LiveMetric {
  id: string;
  label: string;
  value: string;
  icon: LiveMetricIcon;
  iconBackground: string;
  iconColor: string;
  segments: LiveMetricSegment[];
}

export interface SpotAmenity {
  label: string;
  detail: string;
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
  year: string;
  meta: string;
  text: string;
  avatarBackground: string;
  avatarColor: string;
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
  };
  hours: OperatingHours;
  lastUpdated: string;
  metrics: LiveMetric[];
  amenities: SpotAmenity[];
  reviews: SpotReviewSummary & {
    items: SpotReview[];
  };
}
