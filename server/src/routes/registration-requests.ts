import { Router } from "express";
import { randomBytes } from "crypto";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";
import { registrationRequestSchema } from "../db/schema.js";
import {
  createRegistrationRequest,
  getRegistrationRequests,
  getRegistrationRequestById,
  updateRegistrationRequestStatus,
  getUserByEmail,
} from "../db/queries.js";
import { db } from "../db/index.js";
import { universities, universityAdmins, registrationRequests } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "../lib/hash.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { z } from "zod";

const router = Router();

const submitLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: "Too many requests submitted" });

// GET /registration-requests?status= — super-admin only
router.get(
  "/",
  requireAuth,
  requireRole("super-admin"),
  asyncHandler(async (req, res) => {
    const status =
      req.query.status === "Pending" || req.query.status === "Approved" || req.query.status === "Rejected"
        ? req.query.status
        : undefined;
    res.json(await getRegistrationRequests(status));
  })
);

// GET /registration-requests/:id — super-admin only
router.get(
  "/:id",
  requireAuth,
  requireRole("super-admin"),
  asyncHandler(async (req, res) => {
    const request = await getRegistrationRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  })
);

// POST /registration-requests — public university registration request
router.post(
  "/",
  submitLimiter,
  validate(registrationRequestSchema),
  asyncHandler(async (req, res) => {
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    const request = await createRegistrationRequest(req.body);

    res.status(201).json(request);
  })
);

const statusSchema = z.object({ status: z.enum(["Approved", "Rejected"]) });

/**
 * Approving a request provisions the university (if missing) and a
 * university-admin account with a one-time temporary password.
 * The temporary password is returned in the response and never stored in plain text.
 */
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin"),
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const request = await getRegistrationRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(409).json({ error: "This request has already been decided" });
    }

    if (req.body.status === "Approved") {
      // Emails must be globally unique across the account tables for sign-in to
      // resolve unambiguously; refuse to create an unreachable admin account.
      const existingAccount = await getUserByEmail(request.email);
      if (existingAccount && existingAccount.role !== "university-admin") {
        return res.status(409).json({
          error: `This email already belongs to a ${existingAccount.role} account.`,
        });
      }
    }

    if (req.body.status === "Rejected") {
      const updated = await updateRegistrationRequestStatus(request.id, "Rejected");
      return res.json({ request: updated });
    }

    const temporaryPassword = randomBytes(9).toString("base64url"); // 12 chars

    const result = await db.transaction(async (tx) => {
      // University: reuse an existing one (case-insensitive) or create it Active.
      const all = await tx.select().from(universities);
      let university = all.find((u) => u.name.toLowerCase() === request.university.toLowerCase());
      if (!university) {
        [university] = await tx
          .insert(universities)
          .values({ name: request.university, status: "Active" })
          .returning();
      } else if (university.status !== "Active") {
        [university] = await tx
          .update(universities)
          .set({ status: "Active" })
          .where(eq(universities.id, university.id))
          .returning();
      }

      // Admin account: create or reactivate a university-admin for this email.
      const passwordHash = await hashPassword(temporaryPassword);
      const [existing] = await tx
        .select()
        .from(universityAdmins)
        .where(sql`lower(${universityAdmins.email}) = lower(${request.email})`);
      let admin;
      if (existing) {
        [admin] = await tx
          .update(universityAdmins)
          .set({
            status: "Active",
            title: request.title ?? null,
            universityId: university.id,
            passwordHash,
            updatedAt: new Date(),
          })
          .where(eq(universityAdmins.id, existing.id))
          .returning();
      } else {
        [admin] = await tx
          .insert(universityAdmins)
          .values({
            email: request.email,
            name: request.name,
            title: request.title ?? null,
            passwordHash,
            status: "Active",
            universityId: university.id,
          })
          .returning();
      }

      const [updated] = await tx
        .update(registrationRequests)
        .set({ status: "Approved", decidedAt: new Date() })
        .where(eq(registrationRequests.id, request.id))
        .returning();

      return { university, admin, request: updated };
    });

    res.json({
      request: result.request,
      university: result.university,
      admin: { id: result.admin.id, email: result.admin.email, name: result.admin.name },
      temporaryPassword,
    });
  })
);

export default router;
