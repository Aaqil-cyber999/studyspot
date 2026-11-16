import type { Request, Response, NextFunction } from "express";
import { verifyToken, AUTH_COOKIE } from "../lib/jwt.js";

export type AuthRequest = Request & {
  user?: { userId: string; email: string; role: string };
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = payload;
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

/** Attaches req.user when a valid session cookie is present; never rejects. */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return next();
  const payload = verifyToken(token);
  if (payload) req.user = payload;
  next();
}
