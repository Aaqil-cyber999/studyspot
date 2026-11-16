import { sign, verify } from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export function signToken(payload: TokenPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
  return sign(payload, getSecret(), { expiresIn });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = verify(token, getSecret());
    if (typeof decoded === "string") return null;
    const { userId, email, role } = decoded as Record<string, unknown>;
    if (typeof userId !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }
    return { userId, email, role };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = "token";

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}
