import { api } from "@/services/api";

export async function getUaDashboard() {
  return api.get("/api/dashboard/stats");
}

export async function getUaLocations() {
  return api.get("/api/locations");
}

export async function getUaComments() {
  return api.get("/api/comments");
}

export async function getUaProfile() {
  return api.get("/api/auth/me");
}