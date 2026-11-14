import { uaDashboard, uaProfile } from "@/mocks/data/university-admin";
import { useUniversityAdminStore } from "@/stores/university-admin-store";

export async function getUaDashboard() {
  return api.get("/api/dashboard/stats");
}

export async function getUaDashboard() { await delay(); return uaDashboard; }
export async function getUaLocations() { await delay(); return useUniversityAdminStore.getState().locations; }
export async function getUaComments() { await delay(); return useUniversityAdminStore.getState().comments; }
export async function getUaProfile() { await delay(); return uaProfile; }
