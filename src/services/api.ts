"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("API connection failed:", error);
    throw new Error("Unable to reach the StudySpot server. Make sure the backend is running on port 4000.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: unknown) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path: string, body: unknown) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path: string) => request(path, { method: "DELETE" }),
};
