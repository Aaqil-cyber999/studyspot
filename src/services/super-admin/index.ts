import { saProfile } from "@/mocks/data/super-admin";
import { useSuperAdminStore } from "@/stores/super-admin-store";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSaDashboard() {
  await delay();
  const { universities, admins, requests, locations } = useSuperAdminStore.getState();

  return {
    universities: universities.length,
    admins: admins.length,
    requests: requests.filter((request) => request.status === "Pending").length,
    locations: locations.length,
  };
}

export async function getUniversities() {
  await delay();
  return useSuperAdminStore.getState().universities;
}

export async function getUniversityAdmins() {
  await delay();
  return useSuperAdminStore.getState().admins;
}

export async function getRegistrationRequests() {
  await delay();
  return useSuperAdminStore.getState().requests;
}

export async function getSaComments() {
  await delay();
  return useSuperAdminStore.getState().comments;
}

export async function getSaProfile() {
  await delay();
  return saProfile;
}

export async function getSaLocations() {
  await delay();
  return useSuperAdminStore.getState().locations;
}
