import { uaDashboard, uaLocations, uaComments, uaProfile } from "@/mocks/data/university-admin";

let locations = [...uaLocations];
let comments = [...uaComments];
let profile = { ...uaProfile };

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUaDashboard() { await delay(); return uaDashboard; }
export async function getUaLocations() { await delay(); return locations; }
export async function getUaComments() { await delay(); return comments; }
export async function getUaProfile() { await delay(); return profile; }

export async function createUaLocation(input: { name: string; building: string }) {
  await delay(120);
  const location = { id: `ua-${Date.now()}`, name: input.name, building: input.building, rating: 0, reviews: 0, status: "Active" };
  locations = [...locations, location];
  return location;
}

export async function updateUaLocation(id: string, input: { name: string; building: string }) {
  await delay(120);
  locations = locations.map((location) => location.id === id ? { ...location, ...input } : location);
  return locations.find((location) => location.id === id) ?? null;
}

export async function moderateUaComment(id: string, action: "keep" | "remove") {
  await delay(100);
  if (action === "remove") comments = comments.filter((comment) => comment.id !== id);
  return comments.find((comment) => comment.id === id) ?? null;
}

export async function updateUaProfile(input: Pick<typeof uaProfile, "name" | "email">) {
  await delay(120);
  profile = { ...profile, ...input };
  return profile;
}