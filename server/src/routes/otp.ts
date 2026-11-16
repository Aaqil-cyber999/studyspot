import { Router } from "express";
import { randomInt, randomBytes } from "crypto";
import { z } from "zod";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { otpCodes } from "../db/schema.js";
import { createStudent, getUserByEmail } from "../db/queries.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { signToken, AUTH_COOKIE, authCookieOptions } from "../lib/jwt.js";
import { validate } from "../middleware/validate.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { asyncHandler } from "../lib/async-handler.js";
import { publicUser } from "../lib/serializers.js";

const router = Router();

const devMode = process.env.NODE_ENV !== "production";
const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // Development convenience: allow repeated sign-ins while wiring/testing the flow.
  max: devMode ? 100 : 5,
  message: "Too many codes requested, please try again later",
});
const verifyLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: devMode ? 100 : 15, message: "Too many attempts, please try again later" });

const requestSchema = z.object({ email: z.string().email("Enter a valid email address") });

/**
 * POST /auth/otp/request — send a 6-digit code.
 * Always responds 200 so the endpoint can't be used to enumerate accounts.
 * In non-production environments the code is returned as `devCode`.
 */
router.post(
  "/request",
  requestLimiter,
  validate(requestSchema),
  asyncHandler(async (req, res) => {
    const email = req.body.email.toLowerCase().trim();

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const codeHash = await hashPassword(code);

    await db.insert(otpCodes).values({
      email,
      codeHash,
      purpose: "login",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // TODO: send the code via email once an email provider is configured.
    const devCode = process.env.NODE_ENV === "production" ? undefined : code;
    res.json({ ok: true, ...(devCode ? { devCode } : {}) });
  })
);

const verifySchema = z.object({
  email: z.string().email("Enter a valid email address"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

/** POST /auth/otp/verify — check the code, sign the user in (creating student accounts on first login). */
router.post(
  "/verify",
  verifyLimiter,
  validate(verifySchema),
  asyncHandler(async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
    const { code } = req.body;

    const [latest] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          isNull(otpCodes.consumedAt),
          gt(otpCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!latest) {
      return res.status(400).json({ error: "Code expired or not requested" });
    }
    if (latest.attempts >= 5) {
      return res.status(400).json({ error: "Too many attempts — request a new code" });
    }

    const valid = await comparePassword(code, latest.codeHash);
    if (!valid) {
      await db
        .update(otpCodes)
        .set({ attempts: latest.attempts + 1 })
        .where(eq(otpCodes.id, latest.id));
      return res.status(401).json({ error: "Invalid code" });
    }

    await db
      .update(otpCodes)
      .set({ consumedAt: new Date() })
      .where(eq(otpCodes.id, latest.id));

    // Find or create the student account for this email.
    // Admin accounts must not be able to sign in through the student OTP
    // flow — that would bypass the admin password entirely.
    let isNewAccount = false;
    let user = await getUserByEmail(email);
    if (user && user.role !== "student") {
      return res.status(403).json({
        error: "This email is registered with another portal. Sign in with your portal password.",
      });
    }
    if (!user) {
      const name = email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      const passwordHash = await hashPassword(randomBytes(32).toString("base64url"));
      user = await createStudent({ email, name, passwordHash });
      isNewAccount = true;
    }
    if (user.status === "Inactive") {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.cookie(AUTH_COOKIE, token, authCookieOptions());
    res.json({ user: publicUser(user), isNewAccount });
  })
);

export default router;
