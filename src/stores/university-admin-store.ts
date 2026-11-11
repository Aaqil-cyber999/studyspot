import { create } from "zustand";
import { uaComments, uaLocations } from "@/mocks/data/university-admin";
import type { Comment } from "@/types";

export type AdminSeatStatus = "Yes" | "No" | "Unsure";
export type AdminWifiStatus = "Strong" | "Medium" | "Weak";
export type AdminCrowdStatus = "Low" | "Medium" | "High";
export type AdminNoiseStatus = "Quiet" | "Moderate" | "Loud";

export interface AdminLocation {
  id: string;
  name: string;
  building: string;
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
  category: "Library" | "Labs" | "Study space";
  amenities: string[];
  imageUrls?: string[];
}

export interface AdminComment extends Comment {
  status: "Visible" | "Hidden";
}

export interface AdminReport {
  id: string;
  locationId: string;
  locationName: string;
  submittedAt: string;
  noise: AdminNoiseStatus;
  crowd: AdminCrowdStatus;
  seats: AdminSeatStatus;
  wifi: AdminWifiStatus;
  comment: string;
  status: "Pending" | "Reviewed" | "Dismissed";
}

const initialLocations: AdminLocation[] = uaLocations.map((location) => ({
  ...location,
  status: location.status as "Active" | "Inactive",
}));

const initialComments: AdminComment[] = uaComments.map((comment) => ({
  ...comment,
  status: "Visible",
}));

// Status reports mirror the shared student spots, so moderation flows reference
// real catalog ids/names instead of separate admin-only placeholders.
const libraryLocation = uaLocations[0];
const itLocation = uaLocations[3] ?? libraryLocation;

const initialReports: AdminReport[] = [
  {
    id: "report-1",
    locationId: libraryLocation.id,
    locationName: libraryLocation.name,
    submittedAt: "12 minutes ago",
    noise: "Quiet",
    crowd: "Low",
    seats: "Yes",
    wifi: "Strong",
    comment: "Quiet and bright with plenty of open desks.",
    status: "Pending",
  },
  {
    id: "report-2",
    locationId: itLocation.id,
    locationName: itLocation.name,
    submittedAt: "1 hour ago",
    noise: "Loud",
    crowd: "High",
    seats: "No",
    wifi: "Medium",
    comment: "All seats were occupied when I visited.",
    status: "Pending",
  },
];

interface UniversityAdminState {
  locations: AdminLocation[];
  comments: AdminComment[];
  reports: AdminReport[];
  addLocation: (location: Omit<AdminLocation, "id" | "rating" | "reviews">) => void;
  updateLocation: (id: string, values: Partial<Omit<AdminLocation, "id">>) => void;
  toggleLocation: (id: string) => void;
  deleteLocation: (id: string) => void;
  moderateComment: (id: string, status: AdminComment["status"]) => void;
  moderateReport: (id: string, status: AdminReport["status"]) => void;
}

export const useUniversityAdminStore = create<UniversityAdminState>((set) => ({
  locations: initialLocations,
  comments: initialComments,
  reports: initialReports,
  addLocation: (location) =>
    set((state) => ({
      locations: [
        ...state.locations,
        { ...location, id: `ua-${Date.now()}`, rating: 0, reviews: 0 },
      ],
    })),
  updateLocation: (id, values) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id ? { ...location, ...values } : location
      ),
    })),
  toggleLocation: (id) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? { ...location, status: location.status === "Active" ? "Inactive" : "Active" }
          : location
      ),
    })),
  deleteLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
      comments: state.comments.filter((comment) => comment.locationId !== id),
      reports: state.reports.filter((report) => report.locationId !== id),
    })),
  moderateComment: (id, status) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, status } : comment
      ),
    })),
  moderateReport: (id, status) =>
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, status } : report
      ),
    })),
}));
