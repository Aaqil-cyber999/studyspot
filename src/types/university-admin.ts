// Shared shapes for the university-admin portal's API-backed view models.

export interface Comment {
  id: string;
  locationId: string;
  locationName: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

export type AdminSeatStatus = "Yes" | "No" | "Limited";
export type AdminWifiStatus = "Strong" | "Medium" | "Weak" | "No";
export type AdminCrowdStatus = "Low" | "Medium" | "High";
export type AdminNoiseStatus = "Quiet" | "Moderate" | "Loud";

export interface AdminLocation {
  id: string;
  name: string;
  building: string;
  faculty?: string;
  department?: string;
  staffMonitored?: boolean;
  /** Full address string (the API stores this in a single `address` column). */
  area: string;
  hours: string;
  rating: number;
  reviews: number;
  status: "Active" | "Inactive";
  /** `null` until a student submits the first live status report. */
  seats: AdminSeatStatus | null;
  wifi: AdminWifiStatus | null;
  crowd: AdminCrowdStatus | null;
  noise: AdminNoiseStatus | null;
  description: string;
  amenities: string[];
  imageUrls?: string[];
  lastUpdated?: string;
  /** Latest report's comment (student report form), when present. */
  reportComment?: string | null;
  /** Name of the student who filed the latest report. */
  lastReportedByName?: string | null;
  /** Faculty of the student who filed the latest report. */
  lastReportedByFaculty?: string | null;
}

export interface AdminReview extends Comment {
  status: "Visible" | "Hidden";
  /** Author's faculty, when known (student reviewers carry one). */
  authorFaculty?: string | null;
  /** Author's avatar image (empty for initials). */
  authorImg?: string | null;
}
