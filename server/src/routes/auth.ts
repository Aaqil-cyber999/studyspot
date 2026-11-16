import { Router } from "express";
import {
  createStudent,
  getUserByEmail,
  getUserById,
  getUniversityById,
  getUniversityByName,
  type AccountRole,
} from "../db/queries.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { signToken, verifyToken, AUTH_COOKIE, authCookieOptions } from "../lib/jwt.js";
import { validate } from "../middleware/validate.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { asyncHandler } from "../lib/async-handler.js";
import { registerSchema, loginSchema } from "../db/schema.js";
import { publicUser } from "../lib/serializers.js";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: "Too many attempts, please try again later" });

async function universityNameFor(universityId: string | null) {
  if (!universityId) return null;
  const university = await getUniversityById(universityId);
  return university?.name ?? null;
}

async function resolveUniversity(input: string) {
  return (await getUniversityById(input)) ?? (await getUniversityByName(input));
}

// POST /auth/register — students self-register
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, name, university, password } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const resolved = await resolveUniversity(university);
    if (!resolved) {
      return res.status(400).json({ error: "Unknown university" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createStudent({
      email,
      name,
      universityId: resolved.id,
      passwordHash,
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.cookie(AUTH_COOKIE, token, authCookieOptions());
    res.status(201).json({ user: publicUser(user, resolved.name) });
  })
);

// POST /auth/login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    const valid = user ? await comparePassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.status === "Inactive") {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.cookie(AUTH_COOKIE, token, authCookieOptions());
    res.json({ user: publicUser(user, await universityNameFor("universityId" in user ? user.universityId : null)) });
  })
);

// POST /auth/logout
router.post("/logout", (_req, res) => {
  const { maxAge: _maxAge, ...options } = authCookieOptions();
  res.clearCookie(AUTH_COOKIE, options);
  res.json({ ok: true });
});

// GET /auth/me — verify session and return current user
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await getUserById(decoded.userId, decoded.role as AccountRole);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.status === "Inactive") {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    res.json({ user: publicUser(user, await universityNameFor("universityId" in user ? user.universityId : null)) });
  })
);

export default router;
