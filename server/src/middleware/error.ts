import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) });
    return;
  }

  // Postgres unique-violation (e.g. duplicate email)
  const pgCode = (err as { code?: string } | null)?.code;
  if (pgCode === "23505") {
    res.status(409).json({ error: "A record with this value already exists" });
    return;
  }
  if (pgCode === "23503") {
    res.status(400).json({ error: "Referenced record does not exist" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
