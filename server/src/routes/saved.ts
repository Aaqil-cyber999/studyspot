import { Router } from "express";
import {
  listSavedPlaces,
  savePlace,
  unsavePlace,
  getLocationById,
  getUserById,
} from "../db/queries.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("student"));

// Resolve the student's universityId once per request (students are
// restricted to spots on their own campus).
async function studentUniversityId(req: AuthRequest): Promise<string | null> {
  const user = await getUserById(req.user!.userId, "student");
  return user && "universityId" in user ? user.universityId : null;
}

// GET /saved — current user's saved places (own university only), oldest first
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const universityId = await studentUniversityId(req);
    res.json(await listSavedPlaces(req.user!.userId, universityId));
  })
);

// POST /saved — body: { locationId }
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const locationId = req.body?.locationId;
    if (typeof locationId !== "string" || !locationId) {
      return res.status(400).json({ error: "locationId is required" });
    }

    const location = await getLocationById(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const universityId = await studentUniversityId(req);
    if (!universityId || location.universityId !== universityId) {
      return res.status(403).json({ error: "You can only save spots on your own campus" });
    }

    const saved = await savePlace(req.user!.userId, locationId);
    res.status(201).json(saved);
  })
);

// DELETE /saved/:locationId
router.delete(
  "/:locationId",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const removed = await unsavePlace(req.user!.userId, req.params.locationId);
    if (!removed) {
      return res.status(404).json({ error: "Saved place not found" });
    }
    res.json({ ok: true });
  })
);

export default router;
