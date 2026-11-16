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

export type AdminSeatStatus = "Yes" | "No" | "Unsure" | "Limited";
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
  seats: AdminSeatStatus;
  wifi: AdminWifiStatus;
  crowd: AdminCrowdStatus;
  noise: AdminNoiseStatus;
  description: string;
  amenities: string[];
  imageUrls?: string[];
  lastUpdated?: string;
}

export interface AdminReview extends Comment {
  status: "Visible" | "Hidden";
}
