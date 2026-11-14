import { api } from "@/services/api";

export async function getStudyLocations() {
  return api.get("/locations");
}

export async function getSavedLocations() {
  return api.get("/saved-spots");
}

export async function getComments() {
  return api.get("/comments");
}

export async function getStudentProfile() {
  return api.get("/api/auth/me");
}