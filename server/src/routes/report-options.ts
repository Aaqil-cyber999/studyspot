import { Router } from "express";
import { z } from "zod";
import {
  getReportOptions,
  getMaxReportOptionOrder,
  createReportOption,
  updateReportOption,
  deleteReportOption,
  swapReportOptionOrder,
} from "../db/queries.js";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

const categorySchema = z.enum(["wifi", "noise", "crowd", "seats"]);

// GET /report-options?category=&includeInactive=true — public read; actives only unless an admin asks for all
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const parsed =
      typeof req.query.category === "string" ? categorySchema.safeParse(req.query.category) : null;
    if (parsed && !parsed.success) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const includeInactive =
      req.query.includeInactive === "true" &&
      !!req.user &&
      ["super-admin", "university-admin"].includes(req.user.role);
    res.json(await getReportOptions({ category: parsed?.data, includeInactive }));
  })
);

const createSchema = z.object({
  category: categorySchema,
  label: z.string().trim().min(1, "Label is required").max(40, "Use 40 characters or fewer"),
});

// POST /report-options — admins manage the lists
router.post(
  "/",
  requireAuth,
  requireRole("university-admin", "super-admin"),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { category, label } = req.body as z.infer<typeof createSchema>;
    const order = (await getMaxReportOptionOrder(category)) + 1;
    const option = await createReportOption({ category, label, active: true, order });
    res.status(201).json(option);
  })
);

const updateSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(40, "Use 40 characters or fewer").optional(),
  active: z.boolean().optional(),
});

// PUT /report-options/:id — rename or toggle active
router.put(
  "/:id",
  requireAuth,
  requireRole("university-admin", "super-admin"),
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const updated = await updateReportOption(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Option not found" });
    }
    res.json(updated);
  })
);

const moveSchema = z.object({ direction: z.enum(["up", "down"]) });

// POST /report-options/:id/move — reorder within its category
router.post(
  "/:id/move",
  requireAuth,
  requireRole("university-admin", "super-admin"),
  validate(moveSchema),
  asyncHandler(async (req, res) => {
    const moved = await swapReportOptionOrder(req.params.id, req.body.direction);
    if (!moved) {
      return res.status(404).json({ error: "Option not found" });
    }
    res.json(moved);
  })
);

// DELETE /report-options/:id
router.delete(
  "/:id",
  requireAuth,
  requireRole("university-admin", "super-admin"),
  asyncHandler(async (req, res) => {
    const deleted = await deleteReportOption(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Option not found" });
    }
    res.json({ ok: true });
  })
);

export default router;
