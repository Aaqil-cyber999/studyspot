import type { Comment } from "@/types";

export const uaDashboard = {
  university: "University of Moratuwa",
  locations: 12,
  avgRating: 4.6,
  comments: 128,
  seatsAvailable: 240,
};

export const uaLocations = [
  { id: "ua-1", name: "Central Library Study Zone", building: "Library", rating: 4.6, reviews: 42, status: "Active" },
  { id: "ua-2", name: "Engineering Block", building: "Engineering", rating: 4.5, reviews: 31, status: "Active" },
  { id: "ua-3", name: "IT Computer Labs", building: "IT Faculty", rating: 4.6, reviews: 176, status: "Active" },
];

export const uaComments: Comment[] = [
  { id: "ua-c1", locationId: "ua-1", locationName: "Central Library Study Zone", author: "Student", rating: 4.6, text: "Quiet and bright.", createdAt: "3 days ago" },
  { id: "ua-c2", locationId: "ua-2", locationName: "Engineering Block", author: "Student", rating: 5.0, text: "Plenty of power outlets.", createdAt: "1 week ago" },
];

export const uaProfile = {
  name: "University Admin",
  email: "admin@uom.lk",
  university: "University of Moratuwa",
};