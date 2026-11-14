import { Router } from "express";
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
} from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { insertLocationSchema } from "../db/schema.js";

import { requireAuth, requireRole } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /locations — public list
router.get("/", async (_req, res) => {
  const locations = await getAllLocations();
  res.json(locations);
});

// GET /locations/:id — public detail
router.get("/:id", async (req, res) => {
  const loc = await getLocationById(req.params.id);
  if (!loc) {
    return res.status(404).json({ error: "Location not found" });
  }
  res.json(loc);
});

// POST /locations — admin only
router.post(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  validate(insertLocationSchema),
  async (req: AuthRequest, res) => {
    const loc = await createLocation({
      ...req.body,
      createdBy: req.user!.userId,
      universityId: req.body.universityId || "default-university",
    });
    res.status(201).json(loc);
  }
);

// PUT /locations/:id — admin only
router.put(
  "/:id",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (req: AuthRequest, res) => {
    const loc = await updateLocation(req.params.id, req.body);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(loc);
  }
);

export default router;
