import { Router } from "express";
import { getLocationById, submitLiveStatus } from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { submitReportSchema } from "../db/schema.js";

import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /reports — students submit a live status report; only the latest is kept on the location
router.post(
  "/",
  requireAuth,
  requireRole("student"),
  validate(submitReportSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const location = await getLocationById(req.body.locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const updated = await submitLiveStatus(req.body.locationId, req.user!.userId, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.status(201).json(updated);
  })
);

export default router;
