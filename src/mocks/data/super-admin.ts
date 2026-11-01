import type { University, UniversityAdmin, RegistrationRequest, Comment } from "@/types";

export const saDashboard = {
  universities: 8,
  admins: 24,
  requests: 5,
  locations: 96,
};

export const universities: University[] = [
  { id: "u-1", name: "University of Moratuwa", admin: "Admin One", locations: 12, status: "Active" },
  { id: "u-2", name: "University of Colombo", admin: "Admin Two", locations: 8, status: "Active" },
  { id: "u-3", name: "University of Peradeniya", admin: "Admin Three", locations: 15, status: "Pending" },
];

export const universityAdmins: UniversityAdmin[] = [
  { id: "a-1", name: "Admin One", email: "admin1@uom.lk", university: "University of Moratuwa", status: "Active" },
  { id: "a-2", name: "Admin Two", email: "admin2@uc.lk", university: "University of Colombo", status: "Active" },
];

export const registrationRequests: RegistrationRequest[] = [
  { id: "r-1", university: "University of Kelaniya", applicant: "Dr. Silva", email: "silva@kln.ac.lk", submittedAt: "2 days ago", status: "Pending", details: "Request to register university admin." },
  { id: "r-2", university: "University of Jaffna", applicant: "Dr. Kumar", email: "kumar@jfn.ac.lk", submittedAt: "5 days ago", status: "Pending", details: "Request to register university admin." },
];

export const saComments: Comment[] = [
  { id: "sa-c1", locationId: "loc-1", locationName: "Central Library Study Zone", author: "Student", rating: 4.6, text: "Quiet and bright.", createdAt: "3 days ago" },
];

export const saLocations = [
  { id: "sa-loc-1", name: "Central Library Study Zone", university: "University of Moratuwa", rating: 4.6 },
  { id: "sa-loc-2", name: "Engineering Block", university: "University of Colombo", rating: 4.5 },
];

export const saProfile = {
  name: "Super Admin",
  email: "superadmin@spotwise.lk",
};