import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
      // Persist the parsed (and therefore trimmed/transformed) body, not the raw one.
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ error: "Validation error" });
    }
  };
}
