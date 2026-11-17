import { api } from "@/services/api";
import type { SpotAmenity, SpotDetail, LiveMetric, OperatingHours } from "@/features/student/types/spot-detail";

export const STUDENT_AMENITY_OPTIONS = ["Wi-Fi", "Power outlet", "Cafeteria", "Printer", "Parking", "Elevator", "Accessible seating"];

export interface ApiLocation {
  id: string;
  name: string;
  building: string | null;
  faculty: string | null;
  department: string | null;
  staffMonitored: boolean;
  address: string;
  hours: string | null;
  status: "Active" | "Inactive";
  seats: "Yes" | "Limited" | "No" | null;
  wifi: "Strong" | "Medium" | "Weak" | null;
  crowd: "Low" | "Medium" | "High" | null;
  noise: "Quiet" | "Moderate" | "Loud" | null;
  reportComment: string | null;
  lastReportedBy: string | null;
  lastReportedByName: string | null;
  lastReportedByFaculty?: string | null;
  lastReportedAt: string | null;
  description: string | null;
  amenities: string[];
  imageUrls: string[];
  universityId: string;
  universityName: string;
  rating: number;
  reviews: number;
  lastUpdated: string | null;
  createdAt: string;
}



export async function getStudyLocations(universityId?: string | null) {
  const params = new URLSearchParams({ status: "Active" });
  if (universityId) params.set("universityId", universityId);
  const locations = await api.get<ApiLocation[]>(`/locations?${params}`);
  return locations.map(toStudentSpot);
}

export async function getStudentProfile() {
  const { user } = await api.get<{ user: { name: string; email: string; universityId: string | null; universityName: string | null; faculty: string | null; address: string | null; studyStyle: string | null; noiseLevel: string | null; studyType: string | null; amenities: string[]; profileImg: string | null; } }>("/auth/me");
  return user;
}

/** Fetch everyone's saved places (the saved tab needs the full payload). */
export async function getSavedPlaces(): Promise<ApiLocation[]> {
  const rows = await api.get<Array<{ locationId: string; location: ApiLocation }>>("/saved");
  return rows.map((row) => row.location);
}

export async function getSpotDetail(id: string) {
  const [location, locationReviews] = await Promise.all([
    api.get<ApiLocation>(`/locations/${id}`),
    api.get<Array<{ id: string; authorName: string; authorFaculty: string | null; rating: number; text: string; createdAt: string; helpfulVotes: number; votedByMe?: boolean }>>(`/reviews/location/${id}`),
  ]);
  return toSpotDetail(location, locationReviews);
}

// ── Mappers ──────────────────────────────────────────────────────────────────

const toRating = (value: number) => Math.round(value * 10) / 10;

function toStudentSpot(location: ApiLocation) {
  return {
    id: location.id,
    name: location.name,
    category: location.building ? location.building : "Study space",
    area: location.address,
    hours: location.hours ?? "Hours vary",
    rating: toRating(location.rating),
    reviews: location.reviews,
    amenities: location.amenities,
    imageUrls: location.imageUrls,
    status: location.status,
    seats: location.seats ?? "Limited",
    wifi: location.wifi ?? "Weak",
    crowd: location.crowd ?? "Medium",
    noise: location.noise ?? "Moderate",
    staffMonitored: location.staffMonitored,
    description: location.description ?? "",
    universityName: location.universityName,
    lastUpdated: relative(location.lastUpdated),
  };
}

function toSpotDetail(location: ApiLocation, reviews: Array<{ id: string; authorName: string; authorFaculty: string | null; rating: number; text: string; createdAt: string; helpfulVotes: number; votedByMe?: boolean }>): SpotDetail {
  const image = location.imageUrls[0] ?? "/assets/home/838a8.png";
  return {
    slug: location.id,
    name: location.name,
    rating: toRating(location.rating),
    reviewCount: location.reviews,
    staffMonitored: location.staffMonitored,
    hero: { image, alt: `Students studying at ${location.name}`, photoCount: location.imageUrls.length || 1, images: location.imageUrls.length ? location.imageUrls : [image] },
    hours: toOperatingHours(location.hours),
    lastUpdated: relative(location.lastUpdated) ?? "Recently updated",
    reportComment: location.reportComment ?? null,
    lastReportedByName: location.lastReportedByName ?? (location.lastReportedBy ? "A student" : null),
    lastReportedByFaculty: location.lastReportedByFaculty ?? null,
    metrics: toMetrics(location),
    amenities: toSpotAmenities(location.amenities),
    reviews: {
      verdict: ratingVerdict(location.rating),
      verdictDetail: `Based on ${location.reviews} ${location.reviews === 1 ? "review" : "reviews"}`,
      mentions: [],
      items: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        initials: initials(review.authorName),
        author: review.authorName,
        meta: ago(review.createdAt),
        text: review.text,
        avatarBackground: "#ffdbca",
        avatarColor: "#9d4300",
        helpfulVotes: review.helpfulVotes ?? 0,
        votedByMe: review.votedByMe ?? false,
        faculty: review.authorFaculty ?? null,
      })),
    },
  };
}

/** Like `relative`, but without the "Updated" prefix — e.g. "2h ago" (used on review tiles). */
function ago(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function relative(iso: string | null): string | undefined {
  if (!iso) return undefined;
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Updated ${days}d ago`;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  return `${Array.from(words[0])[0] ?? ""}${Array.from(words[words.length - 1])[0] ?? ""}`.toUpperCase();
}

const ratingVerdict = (rating: number) => (rating >= 4.5 ? "Highly rated" : rating >= 4 ? "Well regarded" : rating >= 3 ? "Mixed reviews" : "Needs improvement");

function toMetrics(location: ApiLocation): LiveMetric[] {
  return [
    {
      id: "seats",
      label: "Seats available",
      value: location.seats === "Yes" ? "Available" : location.seats === "Limited" ? "Limited" : location.seats === "No" ? "Full" : "Limited",
      icon: "armchair",
      iconBackground: "rgba(16, 185, 129, 0.14)",
      iconColor: "#10b981",
      segments: [
        { label: "Available", color: "#10b981" },
        { label: "Limited", color: "#19bc86" },
        { label: "Full", color: "#19bc86" },
      ],
    },
    {
      id: "wifi",
      label: "Wi-Fi Strength",
      value: location.wifi ?? "Weak",
      icon: "wifi",
      iconBackground: "rgba(66, 133, 244, 0.14)",
      iconColor: "#4285f4",
      segments: [
        { label: "Strong", color: "#4285f4" },
        { label: "Medium", color: "#498af4" },
        { label: "Weak", color: "#e2e8f0" },
      ],
    },
    {
      id: "crowd",
      label: "Crowd level",
      value: location.crowd ?? "Medium",
      icon: "users",
      iconBackground: "rgba(249, 115, 22, 0.14)",
      iconColor: "#f97316",
      segments: [
        { label: "Low", color: "#f97316" },
        { label: "Medium", color: "#e2e8f0" },
        { label: "High", color: "#e2e8f0" },
      ],
    },
    {
      id: "noise",
      label: "Noise level",
      value: location.noise ?? "Moderate",
      icon: "volume",
      iconBackground: "rgba(139, 92, 246, 0.14)",
      iconColor: "#8b5cf6",
      segments: [
        { label: "Quiet", color: "#8b5cf6" },
        { label: "Moderate", color: "#e2e8f0" },
        { label: "Loud", color: "#e2e8f0" },
      ],
    },
  ];
}

function toOperatingHours(hours: string | null): OperatingHours {
  const segments: OperatingHours["segments"] = [
    { label: "Closed 6–8 AM", weight: 38, tone: "closed" },
    { label: "Open 8 AM–6 PM", weight: 188, tone: "open" },
    { label: "Peak 6–8 PM", weight: 37, tone: "peak" },
    { label: "Open 8–10 PM", weight: 38, tone: "open" },
    { label: "Closed 10 PM–12 AM", weight: 37, tone: "closed" },
  ];
  const labels: OperatingHours["labels"] = [
    { label: "6 AM", left: 0 },
    { label: "9 AM", left: 12.62 },
    { label: "12 PM", left: 28.71 },
    { label: "3 PM", left: 46.1 },
    { label: "6 PM", left: 62.77 },
    { label: "9 PM", left: 79.43 },
    { label: "12 AM", left: 90.46 },
  ];
  return { isOpen: true, openLabel: "Open now", closesLabel: hours ?? "Hours vary", peakLabel: "Peak 6–8 PM", segments, labels };
}

const AMENITY_ICON_MAP: Record<string, { icon: string; width: number; height: number }> = {
  "Wi-Fi": { icon: "/assets/detail/165b6.svg", width: 11.667, height: 15 },
  "Power outlets": { icon: "/assets/detail/c6e1e.svg", width: 18.333, height: 18.333 },
  Computers: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  "Silent zones": { icon: "/assets/detail/f5477.svg", width: 15, height: 15 },
  "Quiet zones": { icon: "/assets/detail/f5477.svg", width: 15, height: 15 },
  "Group work": { icon: "/assets/detail/1f4f4.svg", width: 20, height: 39 },
  "Individual carrels": { icon: "/assets/detail/e70fe.svg", width: 16.667, height: 15 },
  "Reading desks": { icon: "/assets/detail/e70fe.svg", width: 16.667, height: 15 },
  "Group study": { icon: "/assets/detail/1f4f4.svg", width: 20, height: 39 },
  "Print station": { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  Printing: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  Cafeteria: { icon: "/assets/detail/4dc4b.svg", width: 13.333, height: 16.667 },
  "Power outlet": { icon: "/assets/detail/c6e1e.svg", width: 18.333, height: 18.333 },
};

// Amenity with no dedicated Figma icon — use a general check-circle glyph.
const GENERAL_AMENITY_ICON = { icon: "/assets/detail/general-amenity.svg", width: 16, height: 16 };

function toSpotAmenities(labels: string[]): SpotAmenity[] {
  return labels.slice(0, 8).map((label) => {
    const meta = AMENITY_ICON_MAP[label];
    return {
      label,
      icon: meta?.icon ?? GENERAL_AMENITY_ICON.icon,
      iconWidth: meta?.width ?? GENERAL_AMENITY_ICON.width,
      iconHeight: meta?.height ?? GENERAL_AMENITY_ICON.height,
    };
  });
}
