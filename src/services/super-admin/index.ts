import { api } from "@/services/api";

export async function getSaDashboard() {
  return api.get("/api/dashboard/stats");
}

export async function getUniversities() {
  return api.get("/api/universities");
}

export async function getUniversityAdmins() {
  return api.get("/api/users");
}

export async function getRegistrationRequests() {
  return api.get("/api/registration-requests");
}

export async function getSaComments() {
  return api.get("/api/comments");
}

export async function getSaProfile() {
  return api.get("/api/auth/me");
}

export async function getSaLocations() {
  return api.get("/api/locations");
}