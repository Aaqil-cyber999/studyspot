import {
  saDashboard,
  universities,
  universityAdmins,
  registrationRequests,
  saComments,
  saProfile,
  saLocations,
} from "@/mocks/data/super-admin";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSaDashboard() { await delay(); return saDashboard; }
export async function getUniversities() { await delay(); return universities; }
export async function getUniversityAdmins() { await delay(); return universityAdmins; }
export async function getRegistrationRequests() { await delay(); return registrationRequests; }
export async function getSaComments() { await delay(); return saComments; }
export async function getSaProfile() { await delay(); return saProfile; }
export async function getSaLocations() { await delay(); return saLocations; }