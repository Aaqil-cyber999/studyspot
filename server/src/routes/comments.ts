import { Router } from "express";
import {
  getAllComments,
  createComment,
  updateCommentStatus,
} from "../db/queries.js";
import { validate } from "../middleware/validate.js";
import { insertCommentSchema } from "../db/schema.js";

import { requireAuth, requireRole } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /comments — admin moderation view
router.get(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (_req, res) => {
    const comments = await getAllComments();
    res.json(comments);
  }
);

// POST /comments — students add reviews
router.post(
  "/",
  requireAuth,
  validate(insertCommentSchema),
  async (req: AuthRequest, res) => {
    const c = await createComment({
      ...req.body,
      userId: req.user!.userId,
    });
    res.status(201).json(c);
  }
);

// PUT /comments/:id/status — admin hide/show
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (req, res) => {
    const { status } = req.body as { status: "Visible" | "Hidden" };
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const c = await updateCommentStatus(req.params.id, status);
    if (!c) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(c);
  }
);

export default router;
