import { z } from "zod";
import { Router } from "express";
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  getLocationHours,
  upsertLocationHours,
  incrementLocationViews,
} from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { insertLocationSchema, updateLocationSchema } from "../db/schema.js";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import { universityScopeFor } from "../lib/scope.js";
import { db } from "../db/index.js";
import { locations } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// University-admins are confined to their own university; super-admins are not.
const scopeFor = universityScopeFor;

// GET /locations — public list, optional ?universityId=&status=
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const universityId = typeof req.query.universityId === "string" ? req.query.universityId : undefined;
    const status = req.query.status === "Active" || req.query.status === "Inactive" ? req.query.status : undefined;
    res.json(await getAllLocations({ universityId, status }));
  })
);

// GET /locations/:id — public detail, includes the latest student report
router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const loc = await getLocationById(req.params.id);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    // Count real student spot-detail opens towards popularity — anonymous/admin
    // hits don't count, so the "top" list isn't inflated by tooling.
    if (req.user?.role === "student") {
      incrementLocationViews(req.params.id).catch(() => {
        // fire-and-forget: popularity must never break the read
      });
    }
    res.json(loc);
  })
);

// GET /locations/:id/hours — public opening hours for all weekdays
router.get(
  "/:id/hours",
  asyncHandler(async (req, res) => {
    const loc = await getLocationById(req.params.id);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(await getLocationHours(loc.id));
  })
);

const hoursDaySchema = z.object({
  weekday: z.number().int().min(0).max(6),
  isClosed: z.boolean().optional(),
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM").optional(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM").optional(),
  peakStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),
  peakEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),
});
const hoursSchema = z.object({ days: z.array(hoursDaySchema).min(1).max(7) });

// PUT /locations/:id/hours — admin upsert of opening hours (scoped like the location itself)
router.put(
  "/:id/hours",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  validate(hoursSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await scopeFor(req);
    const loc = await getLocationById(req.params.id);
    if (!loc) return res.status(404).json({ error: "Location not found" });
    if (scope.universityId && loc.universityId !== scope.universityId) {
      return res.status(403).json({ error: "You can only edit locations for your own university" });
    }

    const saved = await upsertLocationHours(loc.id, req.body.days);
    res.json(saved);
  })
);

// POST /locations — admins only; university-admins are scoped to their university
router.post(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  validate(insertLocationSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await scopeFor(req);
    if (req.user!.role === "university-admin" && !scope.universityId) {
      return res.status(403).json({ error: "Your account is not linked to a university" });
    }
    const universityId = scope.universityId ?? req.body.universityId;
    if (scope.universityId && req.body.universityId !== scope.universityId) {
      return res.status(403).json({ error: "You can only create locations for your own university" });
    }

    const creator =
      req.user!.role === "university-admin"
        ? { createdByUniversityAdminId: req.user!.userId }
        : { createdBySuperAdminId: req.user!.userId };
    const loc = await createLocation({
      ...req.body,
      universityId,
      ...creator,
    });
    res.status(201).json(loc);
  })
);

// PUT /locations/:id — admins only; university-admins confined to their university
router.put(
  "/:id",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  validate(updateLocationSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await scopeFor(req);
    if (scope.universityId) {
      const existing = await getLocationById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Location not found" });
      if (existing.universityId !== scope.universityId) {
        return res.status(403).json({ error: "You can only edit locations for your own university" });
      }
    }

    const loc = await updateLocation(req.params.id, req.body);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(loc);
  })
);

// DELETE /locations/:id — admins only; university-admins confined to their university
router.delete(
  "/:id",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await scopeFor(req);
    if (scope.universityId) {
      const existing = await getLocationById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Location not found" });
      if (existing.universityId !== scope.universityId) {
        return res.status(403).json({ error: "You can only delete locations for your own university" });
      }
    }

    const deleted = await db.delete(locations).where(eq(locations.id, req.params.id)).returning();
    if (deleted.length === 0) return res.status(404).json({ error: "Location not found" });
    res.json({ ok: true });
  })
);

export default router;
