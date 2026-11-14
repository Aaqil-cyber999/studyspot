import { Router } from "express";
import { createUser, getUserByEmail, getUserById } from "../db/queries.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { signToken, verifyToken } from "../lib/jwt.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../db/schema.js";

const router = Router();

// POST /auth/register — students self-register
router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, name, university, password } = req.body;

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
    role: "student",
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      university: user.university,
    },
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      university: user.university,
    },
  });
});

// POST /auth/logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  });
  res.json({ ok: true });
});

// GET /auth/me — verify session and return current user
router.get("/me", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = await getUserById(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      university: user.university,
      image: user.image,
    },
  });
});

export default router;
