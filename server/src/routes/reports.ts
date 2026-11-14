import { Router } from "express";
import { getAllReports, createReport } from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { insertReportSchema } from "../db/schema.js";

import { requireAuth, requireRole } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /reports — admin view
router.get(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (_req, res) => {
    const reports = await getAllReports();
    res.json(reports);
  }
);

// POST /reports — students submit status reports
router.post(
  "/",
  requireAuth,
  validate(insertReportSchema),
  async (req: AuthRequest, res) => {
    const r = await createReport({
      ...req.body,
      userId: req.user!.userId,
    });
    res.status(201).json(r);
  }
);

export default router;
