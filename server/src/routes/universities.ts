import { Router } from "express";
import {
  getAllUniversities,
  createUniversity,
} from "../db/queries.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /universities
router.get("/", async (_req, res) => {
  const universities = await getAllUniversities();
  res.json(universities);
});

// POST /universities — super-admin only
router.post(
  "/",
  requireAuth,
  requireRole("super-admin"),
  async (req, res) => {
    const { name } = req.body as { name: string };
    if (!name) {
      return res.status(400).json({ error: "University name is required" });
    }
    const u = await createUniversity({ name, status: "Active" });
    res.status(201).json(u);
  }
);

export default router;
