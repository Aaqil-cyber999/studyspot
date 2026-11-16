import { Router } from "express";
import {
  getDashboardStats,
  getRegistrationRequests,
  getAllReviews,
} from "../db/queries.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import { universityScopeFor } from "../lib/scope.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /dashboard/stats — aggregated counts (super-admin: platform-wide; university-admin: own university)
router.get(
  "/stats",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await universityScopeFor(req);
    res.json(await getDashboardStats(scope.universityId));
  })
);

// GET /dashboard/overview — stats + pending approvals + recent reviews
router.get(
  "/overview",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = await universityScopeFor(req);

    if (req.user!.role === "university-admin") {
      // University-admins see their own university's numbers; platform
      // registration requests are super-admin-only.
      if (!scope.universityId) {
        res.json({
          stats: { universities: 0, admins: 0, pendingRequests: 0, locations: 0, reviews: 0, pendingReports: 0, visibleReviews: 0 },
          pendingApprovals: [],
          recentReviews: [],
        });
        return;
      }

      const [stats, recentReviews] = await Promise.all([
        getDashboardStats(scope.universityId),
        getAllReviews("Visible", undefined, scope.universityId),
      ]);

      res.json({
        stats,
        pendingApprovals: [],
        recentReviews: recentReviews.slice(0, 5),
      });
      return;
    }

    const [stats, pendingRequests, recentReviews] = await Promise.all([
      getDashboardStats(),
      getRegistrationRequests("Pending"),
      getAllReviews("Visible"),
    ]);

    res.json({
      stats,
      pendingApprovals: pendingRequests.slice(0, 5),
      recentReviews: recentReviews.slice(0, 5),
    });
  })
);

export default router;
