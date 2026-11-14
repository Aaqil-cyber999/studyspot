import { Router } from "express";
import { createUser, getUserByEmail, updateUserImage } from "../db/queries.js";
import { hashPassword } from "../lib/hash.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { registerSchema } from "../db/schema.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /users — super-admin creates university-admin account
router.post(
  "/",
  requireAuth,
  requireRole("super-admin"),
  validate(registerSchema),
  async (req: AuthRequest, res) => {
    const { email, password, name, university } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email,
      name,
      university,
      passwordHash,
      role: "university-admin",
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        university: user.university,
      },
    });
  }
);

// GET /users/me — current user profile
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  res.json({
    user: {
      id: req.user!.userId,
      email: req.user!.email,
      role: req.user!.role,
    },
  });
});

// PUT /users/me/image — update profile photo (base64)
router.put("/me/image", requireAuth, async (req: AuthRequest, res) => {
  const { image } = req.body as { image?: string };
  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }
  const user = await updateUserImage(req.user!.userId, image);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ image: user.image });
});

export default router;
