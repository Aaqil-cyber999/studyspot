import { Router } from "express";
import {
  createUniversityAdmin,
  getUserByEmail,
  getUserById,
  getUniversityById,
  getUniversityByName,
  listUsers,
  setUserStatus,
  updateUserProfile,
  type AccountRole,
} from "../db/queries.js";
import { hashPassword } from "../lib/hash.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import {
  registerSchema,
  updateProfileSchema,
  updateProfileImageSchema,
} from "../db/schema.js";
import { publicUser } from "../lib/serializers.js";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /users — super-admin creates a university-admin account
router.post(
  "/",
  requireAuth,
  requireRole("super-admin"),
  validate(registerSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const { email, password, name, university } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const resolved =
      (await getUniversityById(university)) ?? (await getUniversityByName(university));
    if (!resolved) {
      return res.status(400).json({ error: "Unknown university" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUniversityAdmin({
      email,
      name,
      universityId: resolved.id,
      passwordHash,
    });

    res.status(201).json({ user: publicUser(user, resolved.name) });
  })
);

// GET /users?role=university-admin — super-admin lists accounts (default: university-admin)
router.get(
  "/",
  requireAuth,
  requireRole("super-admin"),
  asyncHandler(async (req, res) => {
    const role = typeof req.query.role === "string" ? req.query.role : "university-admin";
    if (!["student", "university-admin", "super-admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role filter" });
    }
    res.json(await listUsers(role as AccountRole));
  })
);

// GET /users/me — current user profile
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await getUserById(req.user!.userId, req.user!.role as AccountRole);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: publicUser(user) });
  })
);

// PUT /users/me — update name, area, university, preferences, amenities
router.put(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const role = req.user!.role as AccountRole;
    const { universityId, ...rest } = req.body;

    if (universityId) {
      const resolved =
        (await getUniversityById(universityId)) ?? (await getUniversityByName(universityId));
      if (!resolved) {
        return res.status(400).json({ error: "Unknown university" });
      }
      const user = await updateUserProfile(role, req.user!.userId, { ...rest, universityId: resolved.id });
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({ user: publicUser(user, resolved.name) });
    }

    const user = await updateUserProfile(role, req.user!.userId, {
      ...rest,
      ...(universityId === null ? { universityId: null } : {}),
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  })
);

// PUT /users/me/profile-image — update or remove (null) the profile photo
router.put(
  "/me/profile-image",
  requireAuth,
  validate(updateProfileImageSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const { profileImg } = req.body;
    const user = await updateUserProfile(req.user!.role as AccountRole, req.user!.userId, { profileImg });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ profileImg: user.profileImg });
  })
);

const statusSchema = z.object({
  role: z.enum(["student", "university-admin", "super-admin"]),
  status: z.enum(["Active", "Inactive"]),
});

// PUT /users/:id/status — super-admin activates/deactivates an account
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin"),
  validate(statusSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    if (req.params.id === req.user!.userId && req.body.role === req.user!.role) {
      return res.status(400).json({ error: "You cannot change your own account status" });
    }
    const user = await setUserStatus(req.body.role, req.params.id, req.body.status);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  })
);

export default router;
