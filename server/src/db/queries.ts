import { eq } from "drizzle-orm";
import { db, users, locations, comments, reports, universities, registrationRequests } from "./index.js";
import type { NewUser, NewLocation, NewComment, NewReport, NewUniversity } from "./schema.js";

export async function createUser(data: NewUser) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

export async function updateUserImage(id: string, image: string) {
  const [user] = await db.update(users).set({ image }).where(eq(users.id, id)).returning();
  return user;
}

export async function getAllLocations() {
  return db.select().from(locations);
}

export async function getLocationById(id: string) {
  const [loc] = await db.select().from(locations).where(eq(locations.id, id));
  return loc ?? null;
}

export async function createLocation(data: NewLocation) {
  const [loc] = await db.insert(locations).values(data).returning();
  return loc;
}

export async function updateLocation(id: string, data: Partial<NewLocation>) {
  const [loc] = await db.update(locations).set(data).where(eq(locations.id, id)).returning();
  return loc ?? null;
}

export async function getAllComments() {
  return db.select().from(comments);
}

export async function createComment(data: NewComment) {
  const [c] = await db.insert(comments).values(data).returning();
  return c;
}

export async function updateCommentStatus(id: string, status: "Visible" | "Hidden") {
  const [c] = await db.update(comments).set({ status }).where(eq(comments.id, id)).returning();
  return c ?? null;
}

export async function getAllReports() {
  return db.select().from(reports);
}

export async function createReport(data: NewReport) {
  const [r] = await db.insert(reports).values(data).returning();
  return r;
}

export async function createUniversity(data: NewUniversity) {
  const [u] = await db.insert(universities).values(data).returning();
  return u;
}

export async function getAllUniversities() {
  return db.select().from(universities);
}

export async function createRegistrationRequest(data: { university: string; email: string; applicant?: string }) {
  const [req] = await db.insert(registrationRequests).values(data).returning();
  return req;
}

export async function getRegistrationRequests() {
  return db.select().from(registrationRequests);
}

export async function updateRegistrationRequestStatus(id: string, status: "Pending" | "Approved" | "Rejected") {
  const [req] = await db.update(registrationRequests).set({ status }).where(eq(registrationRequests.id, id)).returning();
  return req ?? null;
}
