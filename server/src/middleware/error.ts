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

function logErrorContext(req: Request, status: number, message: string) {
  console.error(`[ERROR] ${req.method} ${req.path} ${status} ${message}`);
}

export function notFoundHandler(req: Request, res: Response) {
  logErrorContext(req, 404, "Not found");
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    logErrorContext(req, err.status, err.message);
    res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) });
    return;
  }

  // Postgres unique-violation (e.g. duplicate email)
  const pgCode = (err as { code?: string } | null)?.code;
  if (pgCode === "23505") {
    logErrorContext(req, 409, "A record with this value already exists");
    res.status(409).json({ error: "A record with this value already exists" });
    return;
  }
  if (pgCode === "23503") {
    logErrorContext(req, 400, "Referenced record does not exist");
    res.status(400).json({ error: "Referenced record does not exist" });
    return;
  }

  logErrorContext(req, 500, "Internal server error");
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
