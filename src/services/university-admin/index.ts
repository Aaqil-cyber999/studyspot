import { api } from "@/services/api";
import { me } from "@/services/auth";
import type { AdminLocation, AdminReview } from "@/types/university-admin";

export interface ApiDashboardOverview {
  stats: {
    universities: number;
    admins: number;
    pendingRequests: number;
    locations: number;
    reviews: number;
    visibleReviews: number;
  };
  pendingApprovals: Array<Record<string, unknown>>;
  recentReviews: Array<ApiReview>;
}

export async function getUaDashboard(): Promise<ApiDashboardOverview> {
  return api.get<ApiDashboardOverview>("/dashboard/overview");
}

export interface TopLocation {
  id: string;
  name: string;
  building: string | null;
  rating: number;
  reviews: number;
  totalViews: number;
}

export async function getUaTopLocations(): Promise<TopLocation[]> {
  return api.get<TopLocation[]>("/dashboard/top-locations");
}

// ── Locations (backed by the SpotWise API) ───────────────────────────────────

interface ApiLocation {
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
  amenities: string[];
  imageUrls: string[];
  description: string | null;
  rating: number;
  reviews: number;
  lastUpdated: string | null;
  lastReportedBy: string | null;
  lastReportedByName?: string | null;
  lastReportedByFaculty?: string | null;
  lastReportedAt: string | null;
  reportComment?: string | null;
  universityId: string;
  universityName: string;
}

function formatRelative(iso: string | null): string | undefined {
  if (!iso) return undefined;
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Updated ${days}d ago`;
}

function toAdminLocation(location: ApiLocation): AdminLocation {
  return {
    id: location.id,
    name: location.name,
    building: location.building ?? "",
    faculty: location.faculty ?? undefined,
    department: location.department ?? undefined,
    staffMonitored: location.staffMonitored,
    area: location.address,
    hours: location.hours ?? "",
    rating: Number(location.rating ?? 0),
    reviews: Number(location.reviews ?? 0),
    status: location.status,
    seats: location.seats,
    wifi: location.wifi,
    crowd: location.crowd,
    noise: location.noise,
    description: location.description ?? "",
    amenities: location.amenities ?? [],
    imageUrls: location.imageUrls ?? [],
    lastUpdated: formatRelative(location.lastReportedAt),
    reportComment: location.reportComment ?? null,
    lastReportedByName: location.lastReportedByName ?? (location.lastReportedBy ? "A student" : null),
    lastReportedByFaculty: location.lastReportedByFaculty ?? null,
  };
}

/** Resolve the signed-in admin's university, or throw when the session is gone. */
async function requireUniversityId(): Promise<string> {
  const user = await me();
  if (!user) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!user.universityId) {
    throw new Error("Your account is not linked to a university.");
  }
  return user.universityId;
}

export async function getUaLocations(): Promise<AdminLocation[]> {
  const universityId = await requireUniversityId();
  const locations = await api.get<ApiLocation[]>(
    `/locations?universityId=${encodeURIComponent(universityId)}`,
  );
  return locations.map(toAdminLocation);
}

export async function getUaLocation(id: string): Promise<AdminLocation> {
  const response = await api.get<ApiLocation>(`/locations/${id}`);
  return toAdminLocation(response);
}

export interface UaLocationInput {
  name: string;
  building?: string;
  faculty?: string;
  department?: string;
  staffMonitored?: boolean;
  address: string;
  hours?: string;
  status?: "Active" | "Inactive";
  seats?: "Yes" | "Limited" | "No";
  wifi?: "Strong" | "Medium" | "Weak";
  crowd?: "Low" | "Medium" | "High";
  noise?: "Quiet" | "Moderate" | "Loud";
  description?: string;
  amenities?: string[];
  imageUrls?: string[];
}

export async function createUaLocation(input: UaLocationInput): Promise<AdminLocation> {
  const universityId = await requireUniversityId();
  const created = await api.post<ApiLocation>("/locations", { ...input, universityId });
  return toAdminLocation(created);
}

export async function updateUaLocation(
  id: string,
  values: Partial<UaLocationInput>,
): Promise<AdminLocation> {
  const updated = await api.put<ApiLocation>(`/locations/${id}`, values);
  return toAdminLocation(updated);
}

export async function deleteUaLocation(id: string): Promise<void> {
  await api.del(`/locations/${id}`);
}

// ── Reviews (backed by the SpotWise API) ─────────────────────────────────────

interface ApiReview {
  id: string;
  locationId: string;
  locationName?: string;
  authorName?: string;
  authorFaculty?: string | null;
  authorImg?: string | null;
  rating: number;
  text: string;
  status: "Visible" | "Hidden";
  createdAt: string;
  helpfulVotes?: number;
}

function toAdminReview(review: ApiReview, locationName = ""): AdminReview {
  return {
    id: review.id,
    locationId: review.locationId,
    locationName: review.locationName ?? locationName,
    author: review.authorName ?? "Anonymous",
    authorFaculty: review.authorFaculty ?? null,
    authorImg: review.authorImg ?? null,
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt,
    status: review.status,
  };
}

export async function getUaReviews(): Promise<AdminReview[]> {
  const reviews = await api.get<ApiReview[]>("/reviews");
  return reviews.map((review) => toAdminReview(review));
}

export async function getUaLocationReviews(
  locationId: string,
  includeHidden = true,
): Promise<AdminReview[]> {
  const reviews = await api.get<ApiReview[]>(
    `/reviews/location/${locationId}${includeHidden ? "?includeHidden=true" : ""}`,
  );
  return reviews.map((review) => toAdminReview(review));
}

export async function moderateUaReview(
  id: string,
  status: "Visible" | "Hidden",
): Promise<void> {
  await api.put(`/reviews/${id}/status`, { status });
}

// ── Amenities (backed by the SpotWise API) ───────────────────────────────────

export interface ApiAmenity {
  id: string;
  label: string;
  active: boolean;
  order: number;
}

export async function getAmenities(): Promise<ApiAmenity[]> {
  return api.get<ApiAmenity[]>("/amenities");
}

// ── Report options (backed by the SpotWise API) ─────────────────────────────

export type ReportOptionCategory = "wifi" | "noise" | "crowd" | "seats";

export interface ApiReportOption {
  id: string;
  category: ReportOptionCategory;
  label: string;
  active: boolean;
  order: number;
}

export async function getReportOptions(includeInactive = true): Promise<ApiReportOption[]> {
  return api.get<ApiReportOption[]>(`/report-options${includeInactive ? "?includeInactive=true" : ""}`);
}