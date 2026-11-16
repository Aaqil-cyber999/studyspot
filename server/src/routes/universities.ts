import { Router } from "express";
import {
  getAllUniversitiesWithStats,
  getUniversityById,
  createUniversity,
  updateUniversityStatus,
} from "../db/queries.js";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /universities — public list (super-admins additionally see the managing admin's name)
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const rows = await getAllUniversitiesWithStats();
    if (req.user?.role === "super-admin") {
      res.json(rows);
      return;
    }
    res.json(rows.map(({ id, name, status, createdAt, locationCount }) => ({
      id,
      name,
      status,
      createdAt,
      locationCount,
      adminName: null,
    })));
  })
);

// GET /universities/:id — public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const university = await getUniversityById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }
    res.json(university);
  })
);

const createSchema = z.object({
  name: z.string().min(2, "University name is required"),
  status: z.enum(["Pending", "Active", "Inactive"]).optional(),
});

// POST /universities — super-admin only
router.post(
  "/",
  requireAuth,
  requireRole("super-admin"),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { name, status } = req.body;
    const university = await createUniversity({ name, status: status ?? "Active" });
    res.status(201).json(university);
  })
);

const statusSchema = z.object({ status: z.enum(["Pending", "Active", "Inactive"]) });

// PUT /universities/:id/status — super-admin only
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin"),
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const university = await updateUniversityStatus(req.params.id, req.body.status);
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }
    res.json(university);
  })
);

export default router;
