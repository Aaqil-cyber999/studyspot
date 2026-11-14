import { Router } from "express";
import {
  getAllLocations,
  getAllComments,
  getAllReports,
} from "../db/queries.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /dashboard/stats — aggregated counts
router.get(
  "/stats",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (_req, res) => {
    const [locations, comments, reports] = await Promise.all([
      getAllLocations(),
      getAllComments(),
      getAllReports(),
    ]);

    res.json({
      locations: locations.length,
      comments: comments.length,
      reports: reports.length,
      pendingReports: reports.filter((r) => r.status === "Pending").length,
    });
  }
);

export default router;
