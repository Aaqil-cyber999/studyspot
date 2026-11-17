"use client";

import { api, ApiError } from "./api";

export type ApiRole = "student" | "university-admin" | "super-admin";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  title?: string | null;
  role: ApiRole;
  status: "Active" | "Inactive";
  universityId: string | null;
  universityName: string | null;
  faculty: string | null;
  address: string | null;
  profileImg: string | null;
  studyPreferences: { studyStyle: string; noiseLevel: string; studyType: string } | null;
  amenities: string[];
  studyStyle: string | null;
  noiseLevel: string | null;
  studyType: string | null;
  createdAt: string;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const res = await api.post<{ user: ApiUser }>("/auth/login", { email, password });
  return res.user;
}

export async function updateProfile(values: Partial<{ name: string; address: string | null; universityId: string | null; title: string | null }>): Promise<ApiUser> {
  const res = await api.put<{ user: ApiUser }>("/users/me", values);
  return res.user;
}

export async function updateProfileImage(profileImg: string | null): Promise<{ profileImg: string | null }> {
  return api.put<{ profileImg: string | null }>("/users/me/profile-image", { profileImg });
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout", {});
}

/** Returns the current session user, or null when not authenticated. */
export async function me(): Promise<ApiUser | null> {
  try {
    const res = await api.get<{ user: ApiUser }>("/auth/me");
    return res.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    // Network or server errors: don't treat as signed out, just report unavailable.
    throw error;
  }
}
