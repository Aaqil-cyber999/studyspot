import { Router } from "express";
import {
  getAllReviews,
  getReviewsByLocation,
  createReview,
  updateReviewStatus,
  getLocationById,
  getReviewById,
  toggleReviewVote,
} from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { insertReviewSchema } from "../db/schema.js";
import { z } from "zod";

import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import { universityScopeFor } from "../lib/scope.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /reviews?status=Visible|Hidden — admin moderation view
router.get(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const status =
      req.query.status === "Visible" || req.query.status === "Hidden" ? req.query.status : undefined;
    const scope = await universityScopeFor(req);
    if (req.user!.role === "university-admin" && !scope.universityId) {
      return res.json([]); // Not linked to a university — sees nothing.
    }
    res.json(await getAllReviews(status, req.user?.userId, scope.universityId ?? undefined));
  })
);

// GET /reviews/location/:locationId — reviews for one location
router.get(
  "/location/:locationId",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const isAdmin = !!req.user && ["super-admin", "university-admin"].includes(req.user.role);
    let includeHidden = isAdmin && req.query.includeHidden === "true";
    if (includeHidden && req.user?.role === "university-admin") {
      // University-admins may also see hidden reviews, but only for their own
      // university's locations — otherwise fall back to the public view.
      const scope = await universityScopeFor(req);
      const loc = await getLocationById(req.params.locationId);
      if (!scope.universityId || !loc || loc.universityId !== scope.universityId) {
        includeHidden = false;
      }
    }
    res.json(await getReviewsByLocation(req.params.locationId, includeHidden, req.user?.userId));
  })
);

// POST /reviews — students add reviews
router.post(
  "/",
  requireAuth,
  requireRole("student"),
  validate(insertReviewSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const location = await getLocationById(req.body.locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const review = await createReview({
      ...req.body,
      studentId: req.user!.userId,
    });
    res.status(201).json(review);
  })
);

const statusSchema = z.object({ status: z.enum(["Visible", "Hidden"]) });

// PUT /reviews/:id/status — admin hide/show
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  validate(statusSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    if (req.user!.role === "university-admin") {
      // University-admins can only moderate reviews for their own university's
      // locations — otherwise they could hide reviews for rival campuses.
      const scope = await universityScopeFor(req);
      if (!scope.universityId) {
        return res.status(403).json({ error: "Your account is not linked to a university" });
      }
      const review = await getReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      const loc = await getLocationById(review.locationId);
      if (!loc || loc.universityId !== scope.universityId) {
        return res.status(403).json({ error: "You can only moderate reviews for your own university" });
      }
    }
    const review = await updateReviewStatus(req.params.id, req.body.status);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  })
);

// POST /reviews/:id/vote — toggle the current student's "Helpful" vote
router.post(
  "/:id/vote",
  requireAuth,
  requireRole("student"),
  asyncHandler(async (req: AuthRequest, res) => {
    const review = await getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(await toggleReviewVote(review.id, req.user!.userId));
  })
);

export default router;
