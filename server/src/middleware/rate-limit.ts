import type { Request, Response, NextFunction } from "express";

/**
 * Minimal in-memory fixed-window rate limiter. Suitable for a single-process
 * deployment; swap for a shared store (Redis) if you scale horizontally.
 */
export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = "Too many requests, please try again later" } = options;
  const hits = new Map<string, { count: number; resetAt: number }>();

  // Periodically drop expired windows so the map does not grow unbounded.
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  sweeper.unref?.();

  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ error: message });
    }
    next();
  };
}
