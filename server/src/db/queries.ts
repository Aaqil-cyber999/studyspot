import { and, count, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { db } from "./index.js";
import {
  students,
  universityAdmins,
  superAdmins,
  locations,
  reviews,
  reviewVotes,
  universities,
  registrationRequests,
  savedPlaces,
  amenities,
  reportOptions,
  locationHours,
} from "./schema.js";
import type {
  NewLocation,
  NewReview,
  NewUniversity,
  NewRegistrationRequest,
  ReportOptionCategory,
} from "./schema.js";

// ── Role-specific identity ──────────────────────────────────────────────────

export type AccountRole = "student" | "university-admin" | "super-admin";
export type AnyAccount =
  | (typeof students.$inferSelect & { role: "student" })
  | (typeof universityAdmins.$inferSelect & { role: "university-admin" })
  | (typeof superAdmins.$inferSelect & { role: "super-admin" });

export async function createStudent(data: typeof students.$inferInsert) {
  const [user] = await db.insert(students).values(data).returning();
  return withRole("student", user);
}

export async function createUniversityAdmin(data: typeof universityAdmins.$inferInsert) {
  const [user] = await db.insert(universityAdmins).values(data).returning();
  return withRole("university-admin", user);
}

export async function createSuperAdmin(data: typeof superAdmins.$inferInsert) {
  const [user] = await db.insert(superAdmins).values(data).returning();
  return withRole("super-admin", user);
}

function withRole<R extends AccountRole, T extends object>(role: R, user: T): T & { role: R } {
  return { ...user, role };
}

/** Case-insensitive email lookup across all three role tables. */
export async function getUserByEmail(email: string): Promise<AnyAccount | null> {
  const [student] = await db
    .select()
    .from(students)
    .where(sql`lower(${students.email}) = lower(${email})`);
  if (student) return withRole("student", student);

  const [admin] = await db
    .select()
    .from(universityAdmins)
    .where(sql`lower(${universityAdmins.email}) = lower(${email})`);
  if (admin) return withRole("university-admin", admin);

  const [superAdmin] = await db
    .select()
    .from(superAdmins)
    .where(sql`lower(${superAdmins.email}) = lower(${email})`);
  if (superAdmin) return withRole("super-admin", superAdmin);

  return null;
}

/** Role-dispatched lookup by id; probes all tables when role is omitted. */
export async function getUserById(id: string, role?: AccountRole): Promise<AnyAccount | null> {
  if (!role || role === "student") {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    if (student) return withRole("student", student);
    if (role) return null;
  }
  if (!role || role === "university-admin") {
    const [admin] = await db.select().from(universityAdmins).where(eq(universityAdmins.id, id));
    if (admin) return withRole("university-admin", admin);
    if (role) return null;
  }
  if (!role || role === "super-admin") {
    const [superAdmin] = await db.select().from(superAdmins).where(eq(superAdmins.id, id));
    if (superAdmin) return withRole("super-admin", superAdmin);
  }
  return null;
}

export async function listUsers(role: AccountRole) {
  if (role === "student") {
    return db
      .select({
        id: students.id,
        email: students.email,
        name: students.name,
        role: sql<string>`'student'`.as("role"),
        status: students.status,
        universityId: students.universityId,
        universityName: universities.name,
        address: students.address,
        profileImg: students.profileImg,
        createdAt: students.createdAt,
      })
      .from(students)
      .leftJoin(universities, eq(students.universityId, universities.id));
  }
  if (role === "university-admin") {
    return db
      .select({
        id: universityAdmins.id,
        email: universityAdmins.email,
        name: universityAdmins.name,
        title: universityAdmins.title,
        role: sql<string>`'university-admin'`.as("role"),
        status: universityAdmins.status,
        universityId: universityAdmins.universityId,
        universityName: universities.name,
        address: universityAdmins.address,
        profileImg: universityAdmins.profileImg,
        createdAt: universityAdmins.createdAt,
      })
      .from(universityAdmins)
      .leftJoin(universities, eq(universityAdmins.universityId, universities.id));
  }
  return db
    .select({
      id: superAdmins.id,
      email: superAdmins.email,
      name: superAdmins.name,
      role: sql<string>`'super-admin'`.as("role"),
      status: superAdmins.status,
      address: superAdmins.address,
      profileImg: superAdmins.profileImg,
      createdAt: superAdmins.createdAt,
    })
    .from(superAdmins);
}

export async function setUserStatus(role: AccountRole, id: string, status: "Active" | "Inactive") {
  const updatedAt = new Date();
  if (role === "student") {
    const [user] = await db.update(students).set({ status, updatedAt }).where(eq(students.id, id)).returning();
    return user ? withRole("student", user) : null;
  }
  if (role === "university-admin") {
    const [user] = await db.update(universityAdmins).set({ status, updatedAt }).where(eq(universityAdmins.id, id)).returning();
    return user ? withRole("university-admin", user) : null;
  }
  const [user] = await db.update(superAdmins).set({ status, updatedAt }).where(eq(superAdmins.id, id)).returning();
  return user ? withRole("super-admin", user) : null;
}

export type UpdateProfileInput = Partial<{
  name: string;
  title: string | null; // university-admins only
  address: string | null;
  universityId: string | null;
  faculty: string | null; // students only
  studyStyle: "Quiet" | "Focused" | "Social" | null; // students only
  noiseLevel: "Low" | "Medium" | "High" | null; // students only
  studyType: "Individual" | "Group" | "Hybrid" | null; // students only
  amenities: string[]; // students only — validated against the amenities table
  profileImg: string | null;
}>;

/** Validates amenity labels against the active rows in the amenities table. Returns invalid labels. */
export async function findInvalidAmenities(labels: string[]): Promise<string[]> {
  if (labels.length === 0) return [];
  const rows = await db
    .select({ label: amenities.label })
    .from(amenities)
    .where(and(eq(amenities.active, true), sql`lower(${amenities.label}) in (${sql.join(labels.map((l) => sql`lower(${l})`), sql`, `)})`));
  const valid = new Set(rows.map((r) => r.label.toLowerCase()));
  return labels.filter((label) => !valid.has(label.toLowerCase()));
}

export async function updateUserProfile(
  role: AccountRole,
  id: string,
  data: UpdateProfileInput
) {
  const updatedAt = new Date();
  if (role === "student") {
    const { studyStyle, noiseLevel, studyType, amenities: studentAmenities, ...rest } = data;
    const prefsPatch: Record<string, string | null> = {};
    if (studyStyle !== undefined) prefsPatch.studyStyle = studyStyle;
    if (noiseLevel !== undefined) prefsPatch.noiseLevel = noiseLevel;
    if (studyType !== undefined) prefsPatch.studyType = studyType;

    const [current] = await db.select().from(students).where(eq(students.id, id));
    if (!current) return null;

    const nextPreferences =
      Object.keys(prefsPatch).length > 0
        ? { ...(current.studyPreferences ?? { studyStyle: "Quiet", noiseLevel: "Low", studyType: "Individual" }), ...prefsPatch }
        : undefined;

    const [user] = await db
      .update(students)
      .set({
        ...rest,
        ...(nextPreferences ? { studyPreferences: nextPreferences } : {}),
        ...(studentAmenities ? { amenities: studentAmenities } : {}),
        updatedAt,
      })
      .where(eq(students.id, id))
      .returning();
    return user ? withRole("student", user) : null;
  }
  // Admins may change identity/contact fields, not student preferences.
  const { studyStyle: _s, noiseLevel: _n, studyType: _t, amenities: _a, faculty: _f, ...adminData } = data;
  if (role === "university-admin") {
    const [user] = await db
      .update(universityAdmins)
      .set({ ...adminData, updatedAt })
      .where(eq(universityAdmins.id, id))
      .returning();
    return user ? withRole("university-admin", user) : null;
  }
  const [user] = await db
    .update(superAdmins)
    .set({ ...adminData, updatedAt })
    .where(eq(superAdmins.id, id))
    .returning();
  return user ? withRole("super-admin", user) : null;
}

// ── Locations ────────────────────────────────────────────────────────────────

const reviewStats = db
  .select({
    locationId: reviews.locationId,
    rating: sql<number>`coalesce(avg(${reviews.rating}), 0)`.as("rating"),
    reviews: count(reviews.id).as("reviews"),
  })
  .from(reviews)
  .where(eq(reviews.status, "Visible"))
  .groupBy(reviews.locationId)
  .as("review_stats");

function withReviewStats() {
  return db
    .select({
      id: locations.id,
      name: locations.name,
      building: locations.building,
      faculty: locations.faculty,
      department: locations.department,
      staffMonitored: locations.staffMonitored,
      address: locations.address,
      hours: locations.hours,
      status: locations.status,
      seats: locations.seats,
      wifi: locations.wifi,
      crowd: locations.crowd,
      noise: locations.noise,
      reportComment: locations.reportComment,
      lastReportedBy: locations.lastReportedBy,
      lastReportedByName: students.name,
      lastReportedByFaculty: students.faculty,
      lastReportedAt: locations.lastReportedAt,
      description: locations.description,
      amenities: locations.amenities,
      imageUrls: locations.imageUrls,
      universityId: locations.universityId,
      universityName: universities.name,
      createdByUniversityAdminId: locations.createdByUniversityAdminId,
      createdBySuperAdminId: locations.createdBySuperAdminId,
      totalViews: locations.totalViews,
      lastUpdated: locations.lastUpdated,
      createdAt: locations.createdAt,
      rating: sql<number>`coalesce(${reviewStats.rating}, 0)`.mapWith(Number),
      reviews: sql<number>`coalesce(${reviewStats.reviews}, 0)`.mapWith(Number),
    })
    .from(locations)
    .innerJoin(universities, eq(locations.universityId, universities.id))
    .leftJoin(students, eq(students.id, locations.lastReportedBy))
    .leftJoin(reviewStats, eq(reviewStats.locationId, locations.id));
}

export async function getAllLocations(filters?: { universityId?: string; status?: "Active" | "Inactive" }) {
  const conditions: SQL[] = [];
  if (filters?.universityId) conditions.push(eq(locations.universityId, filters.universityId));
  if (filters?.status) conditions.push(eq(locations.status, filters.status));
  const query = withReviewStats();
  return conditions.length ? query.where(and(...conditions)) : query;
}

export async function getLocationById(id: string) {
  const [loc] = await withReviewStats().where(eq(locations.id, id));
  return loc ?? null;
}

/** Top locations by student detail-page opens (ties broken by review count then rating). */
export async function getTopLocations(scopeUniversityId?: string | null, limit = 5) {
  const conditions: SQL[] = [eq(locations.status, "Active")];
  if (scopeUniversityId) {
    conditions.push(eq(locations.universityId, scopeUniversityId));
  }
  return withReviewStats()
    .where(and(...conditions))
    .orderBy(
      sql`${locations.totalViews} desc`,
      sql`coalesce(${reviewStats.reviews}, 0) desc`,
      sql`coalesce(${reviewStats.rating}, 0) desc`,
    )
    .limit(limit);
}

/** Increment a location's popularity counter by one (student spot-detail open). */
export async function incrementLocationViews(id: string) {
  await db
    .update(locations)
    .set({ totalViews: sql`${locations.totalViews} + 1` })
    .where(eq(locations.id, id));
}

export async function createLocation(data: NewLocation) {
  const [loc] = await db.insert(locations).values(data).returning();
  return loc;
}

export async function updateLocation(id: string, data: Partial<NewLocation>) {
  const [loc] = await db
    .update(locations)
    .set({ ...data, lastUpdated: new Date() })
    .where(eq(locations.id, id))
    .returning();
  return loc ?? null;
}

/** Upsert the live status snapshot for a location (noise/crowd/seats/wifi) from a student report. */
export async function submitLiveStatus(
  locationId: string,
  studentId: string,
  data: { noise: string; crowd: string; seats: string; wifi: string; comment?: string }
) {
  const [row] = await db
    .update(locations)
    .set({
      noise: data.noise,
      crowd: data.crowd,
      seats: data.seats,
      wifi: data.wifi,
      reportComment: data.comment?.trim() || null,
      lastReportedBy: studentId,
      lastReportedAt: new Date(),
      lastUpdated: new Date(),
    })
    .where(eq(locations.id, locationId))
    .returning();
  return row ?? null;
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviewsByLocation(locationId: string, includeHidden = false, viewerId?: string) {
  const conditions = [eq(reviews.locationId, locationId)];
  if (!includeHidden) conditions.push(eq(reviews.status, "Visible"));
  return db
    .select({
      id: reviews.id,
      locationId: reviews.locationId,
      studentId: reviews.studentId,
      authorName: students.name,
      authorFaculty: students.faculty,
      authorImg: students.profileImg,
      rating: reviews.rating,
      text: reviews.text,
      status: reviews.status,
      createdAt: reviews.createdAt,
      helpfulVotes: sql<number>`coalesce((select cardinality(v.voter_ids) from review_votes v where v.review_id = ${reviews.id}), 0)`.mapWith(Number),
      ...(viewerId
        ? {
            votedByMe: sql<boolean>`exists(
              select 1 from review_votes v
              where v.review_id = ${reviews.id} and ${viewerId} = any(v.voter_ids)
            )`.mapWith(Boolean),
          }
        : {}),
    })
    .from(reviews)
    .innerJoin(students, eq(reviews.studentId, students.id))
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt));
}

export async function getAllReviews(status?: "Visible" | "Hidden", viewerId?: string, universityId?: string) {
  const base = db
    .select({
      id: reviews.id,
      locationId: reviews.locationId,
      locationName: locations.name,
      universityName: universities.name,
      studentId: reviews.studentId,
      authorName: students.name,
      authorFaculty: students.faculty,
      authorImg: students.profileImg,
      rating: reviews.rating,
      text: reviews.text,
      status: reviews.status,
      createdAt: reviews.createdAt,
      helpfulVotes: sql<number>`coalesce((select cardinality(v.voter_ids) from review_votes v where v.review_id = ${reviews.id}), 0)`.mapWith(Number),
      ...(viewerId
        ? {
            votedByMe: sql<boolean>`exists(
              select 1 from review_votes v
              where v.review_id = ${reviews.id} and ${viewerId} = any(v.voter_ids)
            )`.mapWith(Boolean),
          }
        : {}),
    })
    .from(reviews)
    .innerJoin(students, eq(reviews.studentId, students.id))
    .innerJoin(locations, eq(reviews.locationId, locations.id))
    .innerJoin(universities, eq(locations.universityId, universities.id));
  const conditions = [
    ...(status ? [eq(reviews.status, status)] : []),
    ...(universityId ? [eq(locations.universityId, universityId)] : []),
  ];
  const rows = conditions.length ? await base.where(and(...conditions)) : await base;
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createReview(data: NewReview) {
  const [review] = await db.insert(reviews).values(data).returning();
  return review;
}

export async function updateReviewStatus(id: string, status: "Visible" | "Hidden") {
  const [review] = await db.update(reviews).set({ status }).where(eq(reviews.id, id)).returning();
  return review ?? null;
}

export async function getReviewById(id: string) {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
  return review ?? null;
}

// ── Amenities catalog ──────────────────────────────────────────────────────

export async function getAmenities(includeInactive = false) {
  const base = db.select().from(amenities);
  const rows = includeInactive ? await base : await base.where(eq(amenities.active, true));
  return rows.sort((a, b) => a.order - b.order);
}

// ── Saved places ─────────────────────────────────────────────────────────────

/** Saved places for a student, restricted to the student's own university. */
export async function listSavedPlaces(studentId: string, universityId?: string | null) {
  if (!universityId) return []; // Student with no linked university — nothing to show.

  const saved = await db
    .select({
      locationId: savedPlaces.locationId,
      createdAt: savedPlaces.createdAt,
    })
    .from(savedPlaces)
    .where(eq(savedPlaces.studentId, studentId))
    .orderBy(savedPlaces.createdAt);

  if (saved.length === 0) return [];

  // Join the review-stat aggregates so saved places carry the same rating /
  // reviews / universityName shape as the Discover and detail views.
  const rows = await withReviewStats().where(
    and(
      inArray(locations.id, saved.map((entry) => entry.locationId)),
      eq(locations.universityId, universityId),
    ),
  );
  const byId = new Map(rows.map((row) => [row.id, row]));

  return saved
    .map((entry) => ({ ...entry, location: byId.get(entry.locationId) }))
    .filter(
      (entry): entry is { locationId: string; createdAt: Date; location: NonNullable<typeof entry.location> } =>
        entry.location != null,
    );
}

export async function savePlace(studentId: string, locationId: string) {
  await db
    .insert(savedPlaces)
    .values({ studentId, locationId })
    .onConflictDoNothing();
  const [row] = await db
    .select()
    .from(savedPlaces)
    .where(and(eq(savedPlaces.studentId, studentId), eq(savedPlaces.locationId, locationId)));
  return row;
}

export async function unsavePlace(studentId: string, locationId: string) {
  const deleted = await db
    .delete(savedPlaces)
    .where(and(eq(savedPlaces.studentId, studentId), eq(savedPlaces.locationId, locationId)))
    .returning();
  return deleted.length > 0;
}

// ── Universities ─────────────────────────────────────────────────────────────

export async function createUniversity(data: NewUniversity) {
  const [u] = await db.insert(universities).values(data).returning();
  return u;
}

export async function getAllUniversitiesWithStats() {
  const rows = await db
    .select({
      id: universities.id,
      name: universities.name,
      status: universities.status,
      createdAt: universities.createdAt,
      locationCount: sql<number>`coalesce(count(distinct ${locations.id}), 0)`.as("location_count"),
      adminName: sql<string | null>`max(${universityAdmins.name})`.as("admin_name"),
      adminTitle: sql<string | null>`max(${universityAdmins.title})`.as("admin_title"),
    })
    .from(universities)
    .leftJoin(locations, eq(locations.universityId, universities.id))
    .leftJoin(universityAdmins, eq(universityAdmins.universityId, universities.id))
    .groupBy(universities.id);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    createdAt: row.createdAt,
    locationCount: Number(row.locationCount ?? 0),
    adminName: row.adminTitle ? `${row.adminTitle} ${row.adminName}` : row.adminName,
  }));
}

export async function getUniversityById(id: string) {
  const [u] = await db.select().from(universities).where(eq(universities.id, id));
  return u ?? null;
}

export async function getUniversityByName(name: string) {
  const [u] = await db
    .select()
    .from(universities)
    .where(sql`lower(${universities.name}) = lower(${name})`);
  return u ?? null;
}

export async function updateUniversityStatus(id: string, status: "Pending" | "Active" | "Inactive") {
  const [u] = await db.update(universities).set({ status }).where(eq(universities.id, id)).returning();
  return u ?? null;
}

// ── Registration requests ────────────────────────────────────────────────────

export async function createRegistrationRequest(data: NewRegistrationRequest) {
  const [request] = await db.insert(registrationRequests).values(data).returning();
  return request;
}

export async function getRegistrationRequests(status?: "Pending" | "Approved" | "Rejected") {
  const base = db.select().from(registrationRequests).orderBy(desc(registrationRequests.createdAt));
  return status ? base.where(eq(registrationRequests.status, status)) : base;
}

export async function getRegistrationRequestById(id: string) {
  const [request] = await db.select().from(registrationRequests).where(eq(registrationRequests.id, id));
  return request ?? null;
}

export async function updateRegistrationRequestStatus(
  id: string,
  status: "Pending" | "Approved" | "Rejected"
) {
  const [request] = await db
    .update(registrationRequests)
    .set({ status, decidedAt: status === "Pending" ? null : new Date() })
    .where(eq(registrationRequests.id, id))
    .returning();
  return request ?? null;
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(universityId?: string | null) {
  // null means "scoped to nothing" (university-admin with no linked university):
  // return zeros rather than platform-wide counts.
  if (universityId === null) {
    return { universities: 0, admins: 0, pendingRequests: 0, locations: 0, reviews: 0, pendingReports: 0, visibleReviews: 0 };
  }
  const scoped = typeof universityId === "string" && universityId.length > 0;
  const ownAdmins = scoped ? [eq(universityAdmins.universityId, universityId)] : [];
  const ownLocations = scoped ? [eq(locations.universityId, universityId)] : [];
  const reviewWhereVisible = [eq(reviews.status, "Visible")];

  const [[universityCount], [adminCount], [pendingRequestCount], [locationCount], [reviewCount], [visibleReviewCount]] =
    await Promise.all([
      scoped
        ? db.select({ value: count() }).from(universities).where(and(eq(universities.id, universityId), eq(universities.status, "Active")))
        : db.select({ value: count() }).from(universities).where(eq(universities.status, "Active")),
      scoped
        ? db.select({ value: count() }).from(universityAdmins).where(and(...ownAdmins))
        : db.select({ value: count() }).from(universityAdmins),
      scoped
        ? Promise.resolve([{ value: 0 }])
        : db.select({ value: count() }).from(registrationRequests).where(eq(registrationRequests.status, "Pending")),
      db.select({ value: count() }).from(locations).where(and(eq(locations.status, "Active"), ...ownLocations)),
      scoped
        ? db.select({ value: count() }).from(reviews).innerJoin(locations, eq(reviews.locationId, locations.id)).where(and(eq(locations.universityId, universityId)))
        : db.select({ value: count() }).from(reviews),
      scoped
        ? db.select({ value: count() }).from(reviews).innerJoin(locations, eq(reviews.locationId, locations.id)).where(and(eq(locations.universityId, universityId), ...reviewWhereVisible))
        : db.select({ value: count() }).from(reviews).where(eq(reviews.status, "Visible")),
    ]);

  return {
    universities: Number(universityCount?.value ?? 0),
    admins: Number(adminCount?.value ?? 0),
    pendingRequests: Number(pendingRequestCount?.value ?? 0),
    locations: Number(locationCount?.value ?? 0),
    reviews: Number(reviewCount?.value ?? 0),
    pendingReports: 0, // kept for API compatibility until frontend drops it
    visibleReviews: Number(visibleReviewCount?.value ?? 0),
  };
}

// -- Report options -----------------------------------------------------------

export async function getReportOptions(filters?: { category?: ReportOptionCategory; includeInactive?: boolean }) {
  const conditions = [];
  if (filters?.category) conditions.push(eq(reportOptions.category, filters.category));
  if (!filters?.includeInactive) conditions.push(eq(reportOptions.active, true));
  const base = db.select().from(reportOptions);
  const rows = conditions.length ? await base.where(and(...conditions)) : await base;
  return rows.sort((a, b) =>
    a.category === b.category ? a.order - b.order : a.category.localeCompare(b.category)
  );
}

export async function getMaxReportOptionOrder(category: ReportOptionCategory) {
  const [row] = await db
    .select({ value: sql<number>`coalesce(max(${reportOptions.order}), -1)`.mapWith(Number) })
    .from(reportOptions)
    .where(eq(reportOptions.category, category));
  return row?.value ?? -1;
}

export async function createReportOption(data: typeof reportOptions.$inferInsert) {
  const [row] = await db.insert(reportOptions).values(data).returning();
  return row;
}

export async function updateReportOption(
  id: string,
  data: Partial<{ label: string; active: boolean; order: number }>
) {
  const [row] = await db
    .update(reportOptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(reportOptions.id, id))
    .returning();
  return row ?? null;
}

export async function deleteReportOption(id: string) {
  const deleted = await db.delete(reportOptions).where(eq(reportOptions.id, id)).returning();
  return deleted.length > 0;
}

export async function swapReportOptionOrder(id: string, direction: "up" | "down") {
  const [current] = await db.select().from(reportOptions).where(eq(reportOptions.id, id));
  if (!current) return null;
  const siblings = await db
    .select()
    .from(reportOptions)
    .where(eq(reportOptions.category, current.category));
  const sorted = [...siblings].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((o) => o.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= sorted.length) return current;
  const swap = sorted[swapIndex];
  await db.transaction(async (tx) => {
    await tx.update(reportOptions).set({ order: swap.order, updatedAt: new Date() }).where(eq(reportOptions.id, current.id));
    await tx.update(reportOptions).set({ order: current.order, updatedAt: new Date() }).where(eq(reportOptions.id, swap.id));
  });
  const [updated] = await db.select().from(reportOptions).where(eq(reportOptions.id, id));
  return updated ?? current;
}

// -- Location hours -----------------------------------------------------------

export async function getLocationHours(locationId: string) {
  const rows = await db
    .select()
    .from(locationHours)
    .where(eq(locationHours.locationId, locationId))
    .orderBy(locationHours.weekday);
  return rows;
}

export async function upsertLocationHours(
  locationId: string,
  days: Array<{
    weekday: number;
    isClosed?: boolean;
    openTime?: string;
    closeTime?: string;
    peakStart?: string | null;
    peakEnd?: string | null;
  }>
) {
  if (days.length === 0) return [];

  // Merge with existing rows so partial updates don't reset unspecified fields.
  const existing = await getLocationHours(locationId);
  const existingByWeekday = new Map(existing.map((row) => [row.weekday, row]));

  const merged = days.map((day) => {
    const prev = existingByWeekday.get(day.weekday);
    return {
      locationId,
      weekday: day.weekday,
      isClosed: day.isClosed ?? prev?.isClosed ?? false,
      openTime: day.openTime ?? prev?.openTime ?? "08:00",
      closeTime: day.closeTime ?? prev?.closeTime ?? "20:00",
      peakStart: day.peakStart !== undefined ? day.peakStart : prev?.peakStart ?? null,
      peakEnd: day.peakEnd !== undefined ? day.peakEnd : prev?.peakEnd ?? null,
    };
  });

  return db
    .insert(locationHours)
    .values(merged)
    .onConflictDoUpdate({
      target: [locationHours.locationId, locationHours.weekday],
      set: {
        isClosed: sql`excluded.is_closed`,
        openTime: sql`excluded.open_time`,
        closeTime: sql`excluded.close_time`,
        peakStart: sql`excluded.peak_start`,
        peakEnd: sql`excluded.peak_end`,
      },
    })
    .returning();
}

// -- Review votes ("Helpful") -------------------------------------------------

/** Toggle the student's helpful vote. Returns { voted, votes } after the toggle. */
export async function toggleReviewVote(reviewId: string, studentId: string) {
  const [row] = await db
    .insert(reviewVotes)
    .values({ reviewId, voterIds: [studentId] })
    .onConflictDoUpdate({
      target: reviewVotes.reviewId,
      set: {
        voterIds: sql`case
          when ${studentId} = any(${reviewVotes.voterIds})
            then array_remove(${reviewVotes.voterIds}, ${studentId})
          else array_append(${reviewVotes.voterIds}, ${studentId})
        end`,
      },
    })
    .returning({ voterIds: reviewVotes.voterIds });

  const voterIds = row?.voterIds ?? [];
  const voted = voterIds.includes(studentId);
  return { voted, votes: voterIds.length };
}
