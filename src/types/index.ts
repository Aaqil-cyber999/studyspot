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
  status: "Active" | "Pending";
}

export interface UniversityAdmin {
  id: string;
  name: string;
  email: string;
  university: string;
  status: "Active" | "Inactive";
}

export interface RegistrationRequest {
  id: string;
  university: string;
  applicant: string;
  email: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  details?: string;
}