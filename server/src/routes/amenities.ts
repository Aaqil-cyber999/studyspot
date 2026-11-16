import { Router } from "express";
import { z } from "zod";
import {
  getAmenities,
  findInvalidAmenities,
} from "../db/queries.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";

const router = Router();

// GET /amenities — public catalog (active rows in sort order)
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getAmenities());
  })
);

const validateSchema = z.object({ labels: z.array(z.string().min(1).max(80)).min(1) });

// POST /amenities/validate — check that every label is an active catalog amenity
router.post(
  "/validate",
  requireAuth,
  validate(validateSchema),
  asyncHandler(async (req, res) => {
    res.json({ invalid: await findInvalidAmenities(req.body.labels) });
  })
);

export default router;
