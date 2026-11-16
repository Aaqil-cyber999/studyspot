export type Amenity = string;

export interface StudyLocation {
  id: string;
  name: string;
  university: string;
  building?: string;
  floor?: string;
  address?: string;
  hours?: string;
  rating: number;
  reviews: number;
  amenities: string[];
  seats?: number;
  saved?: boolean;
}

export interface Comment {
  id: string;
  locationId: string;
  locationName: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  admin?: string;
  locations: number;
  status: "Active" | "Pending" | "Inactive";
}

export interface UniversityAdmin {
  id: string;
  name: string;
  email: string;
  university: string;
  status: "Active" | "Inactive";
}

// Mirrors the university-admin registration form (/university-admin/register):
// Title, Name, University, Email, optional Note. The password the applicant
// submits is never exposed — it isn't stored on the request.
export interface RegistrationRequest {
  id: string;
  title: string;
  name: string;
  university: string;
  email: string;
  note?: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}