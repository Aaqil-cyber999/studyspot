import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  universities as initialUniversities,
  universityAdmins as initialAdmins,
  registrationRequests as initialRequests,
  saLocations as initialLocations,
  saComments as initialComments,
} from "@/mocks/data/super-admin";
import type { SaComment, SaLocation } from "@/mocks/data/super-admin";
import type { University, UniversityAdmin, RegistrationRequest } from "@/types";

interface SuperAdminState {
  universities: University[];
  admins: UniversityAdmin[];
  requests: RegistrationRequest[];
  locations: SaLocation[];
  comments: SaComment[];
  toggleUniversityStatus: (id: string) => void;
  toggleAdminStatus: (id: string) => void;
  toggleLocationStatus: (id: string) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  submitRequest: (request: Omit<RegistrationRequest, "id" | "submittedAt" | "status">) => void;
  moderateComment: (id: string, status: SaComment["status"]) => void;
}

// Persisted so a registration submitted from /university-admin/register still
// shows up in the super-admin queue after a full page load or a tab switch.
// Only the data arrays are serialized — the action functions stay in code.
export const useSuperAdminStore = create<SuperAdminState>()(
  persist(
    (set) => ({
  universities: initialUniversities,
  admins: initialAdmins,
  requests: initialRequests,
  locations: initialLocations,
  comments: initialComments,

  toggleUniversityStatus: (id) =>
    set((state) => ({
      universities: state.universities.map((university) =>
        university.id === id
          ? { ...university, status: university.status === "Active" ? "Inactive" : "Active" }
          : university
      ),
    })),

  toggleAdminStatus: (id) =>
    set((state) => ({
      admins: state.admins.map((admin) =>
        admin.id === id
          ? { ...admin, status: admin.status === "Active" ? "Inactive" : "Active" }
          : admin
      ),
    })),

  toggleLocationStatus: (id) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? { ...location, status: location.status === "Active" ? "Inactive" : "Active" }
          : location
      ),
    })),

  // Backing for the university-admin registration form: a fresh request
  // lands in the Pending queue exactly as the applicant submitted it.
  submitRequest: (request) =>
    set((state) => ({
      requests: [
        {
          ...request,
          id: `r-${Date.now()}`,
          submittedAt: "Just now",
          status: "Pending",
        },
        ...state.requests,
      ],
    })),

  approveRequest: (id) =>
    set((state) => {
      const request = state.requests.find((item) => item.id === id);
      if (!request || request.status !== "Pending") return state;

      const fullName = `${request.title} ${request.name}`;

      // Approving a request spins up the university and its admin. If the
      // university already exists (re-approval), don't duplicate it.
      const universityExists = state.universities.some(
        (university) => university.name === request.university,
      );
      const university: University = {
        id: `u-${Date.now()}`,
        name: request.university,
        admin: fullName,
        locations: 0,
        status: "Active",
      };
      const admin: UniversityAdmin = {
        id: `a-${Date.now()}`,
        name: fullName,
        email: request.email,
        university: request.university,
        status: "Active",
      };

      return {
        requests: state.requests.map((item) =>
          item.id === id ? { ...item, status: "Approved" } : item,
        ),
        universities: universityExists ? state.universities : [university, ...state.universities],
        admins: [admin, ...state.admins],
      };
    }),

  rejectRequest: (id) =>
    set((state) => ({
      requests: state.requests.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item,
      ),
    })),

  moderateComment: (id, status) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, status } : comment,
      ),
    })),
    }),
    {
      name: "spotwise-sa",
      version: 1,
    },
  ),
);
