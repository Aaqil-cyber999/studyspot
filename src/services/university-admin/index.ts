import { uaDashboard, uaLocations, uaComments, uaProfile } from "@/mocks/data/university-admin";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUaDashboard() { await delay(); return uaDashboard; }
export async function getUaLocations() { await delay(); return uaLocations; }
export async function getUaComments() { await delay(); return uaComments; }
export async function getUaProfile() { await delay(); return uaProfile; }