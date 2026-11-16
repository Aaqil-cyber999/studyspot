import { api } from "@/services/api";

export interface ApiRegistrationRequest {
  id: string;
  title: string | null;
  name: string;
  university: string;
  email: string;
  note: string | null;
  status: "Pending" | "Approved" | "Rejected";
  decidedAt: string | null;
  createdAt: string;
}

export interface ApiReview {
  id: string;
  locationId: string;
  locationName: string;
  studentId: string;
  authorName: string;
  rating: number;
  text: string;
  status: "Visible" | "Hidden";
  createdAt: string;
  helpfulVotes: number;
  votedByMe?: boolean;
}

export interface ApiSaOverview {
  stats: {
    universities: number;
    admins: number;
    pendingRequests: number;
    locations: number;
    reviews: number;
    visibleReviews: number;
  };
  pendingApprovals: ApiRegistrationRequest[];
  recentReviews: ApiReview[];
}

export async function getSaOverview(): Promise<ApiSaOverview> {
  return api.get<ApiSaOverview>("/dashboard/overview");
}

export interface ApiSaUniversity {
  id: string;
  name: string;
  status: "Pending" | "Active" | "Inactive";
  createdAt: string;
  locationCount: number;
  adminName: string | null;
}

export async function getSaUniversities(): Promise<ApiSaUniversity[]> {
  return api.get<ApiSaUniversity[]>("/universities");
}

export async function setSaUniversityStatus(
  id: string,
  status: "Active" | "Inactive",
): Promise<ApiSaUniversity> {
  return api.put<ApiSaUniversity>(`/universities/${id}/status`, { status });
}

export interface ApiSaAdmin {
  id: string;
  email: string;
  name: string;
  title?: string | null;
  role: string;
  status: "Active" | "Inactive";
  universityId: string | null;
  universityName: string | null;
  createdAt: string;
}

export async function getSaUniversityAdmins(): Promise<ApiSaAdmin[]> {
  return api.get<ApiSaAdmin[]>("/users?role=university-admin");
}

export async function setSaAdminStatus(
  id: string,
  status: "Active" | "Inactive",
): Promise<{ user: ApiSaAdmin }> {
  return api.put<{ user: ApiSaAdmin }>(`/users/${id}/status`, { role: "university-admin", status });
}

export async function getSaRequests(status?: "Pending" | "Approved" | "Rejected"): Promise<ApiRegistrationRequest[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api.get<ApiRegistrationRequest[]>(`/registration-requests${query}`);
}

export async function getSaRequestById(id: string): Promise<ApiRegistrationRequest> {
  return api.get<ApiRegistrationRequest>(`/registration-requests/${id}`);
}

export async function approveSaRequest(id: string): Promise<{
  request: ApiRegistrationRequest;
  university: ApiSaUniversity;
  admin: { id: string; email: string; name: string };
  temporaryPassword: string;
}> {
  return api.put(`/registration-requests/${id}/status`, { status: "Approved" });
}

export async function rejectSaRequest(id: string): Promise<{ request: ApiRegistrationRequest }> {
  return api.put(`/registration-requests/${id}/status`, { status: "Rejected" });
}

export interface ApiSaReview {
  id: string;
  locationId: string;
  locationName: string;
  studentId: string;
  authorName: string;
  rating: number;
  text: string;
  status: "Visible" | "Hidden";
  createdAt: string;
  helpfulVotes: number;
}

export async function getSaReviews(status?: "Visible" | "Hidden"): Promise<ApiSaReview[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api.get<ApiSaReview[]>(`/reviews${query}`);
}

export async function getSaLocationReviews(
  locationId: string,
  includeHidden = true,
): Promise<ApiSaReview[]> {
  const query = includeHidden ? "?includeHidden=true" : "";
  // Reuse the admin review endpoint but scoped server-side isn't available yet —
  // filter the location's reviews client-side via the dedicated endpoint.
  const reviews = await api.get<ApiSaReview[]>(`/reviews/location/${locationId}${query}`);
  return reviews;
}

export async function moderateSaReview(
  id: string,
  status: "Visible" | "Hidden",
): Promise<ApiSaReview> {
  return api.put<ApiSaReview>(`/reviews/${id}/status`, { status });
}

export interface ApiSaLocation {
  id: string;
  name: string;
  building: string | null;
  address: string;
  hours: string | null;
  status: "Active" | "Inactive";
  staffMonitored: boolean;
  seats: "Yes" | "Limited" | "No" | "Unsure" | null;
  wifi: "Strong" | "Medium" | "Weak" | null;
  crowd: "Low" | "Medium" | "High" | null;
  noise: "Quiet" | "Moderate" | "Loud" | null;
  lastReportedBy: string | null;
  lastReportedAt: string | null;
  description: string | null;
  amenities: string[];
  imageUrls: string[];
  rating: number;
  reviews: number;
  universityId: string;
  universityName: string;
  lastUpdated: string | null;
  createdAt: string;
}

export async function getSaLocationById(id: string): Promise<ApiSaLocation> {
  // No dedicated endpoint yet — filter the shared list down to this id.
  const all = await getSaLocations();
  const found = all.find((l) => l.id === id);
  if (!found) throw new Error("Location not found");
  return found;
}

export async function getSaLocations(): Promise<ApiSaLocation[]> {
  return api.get<ApiSaLocation[]>("/locations");
}

export async function setSaLocationStatus(
  id: string,
  status: "Active" | "Inactive",
): Promise<ApiSaLocation> {
  return api.put<ApiSaLocation>(`/locations/${id}`, { status });
}
