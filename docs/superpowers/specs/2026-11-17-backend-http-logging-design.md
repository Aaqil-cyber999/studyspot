# Backend HTTP logging design

## Intent

Give the SpotWise Express backend a log line for every HTTP request (method, path, status, duration) and useful context when a request fails, so production issues can be traced from the server console.

## Goals / non-goals

- Goal: one log line per completed request; error responses additionally logged with method, sanitized path and resolved status.
- Non-goal: logging request/response bodies, cookies, tokens, query strings, passwords, OTP codes or base64 profile images.
- Non-goal: changing route behaviour, response shapes or authentication.

## Constraints

- Existing stack: Express 4, TypeScript (`NodeNext`, compiled to `server/dist`), central `HttpError`/error handler in `server/src/middleware/error.ts`.
- Startup, shutdown and DB script logging already exist and stay as-is.
- Dev seed password lines already exist; no new credential logging.

## Approaches considered

1. Custom `res.on("finish")` middleware — no dependency, most control; rejected by the user in favour of morgan.
2. **`morgan` (chosen)** — standard Express request logger; satisfies "add morgan" with minimal custom code. Its default `:url` token includes query strings, so a custom path token is used instead of `:url`.

## Decisions

- Add `morgan` (dependency) and `@types/morgan` (dev dependency) to `server/package.json`; regenerate the npm lockfile.
- Register morgan in `server/src/index.ts` after `express.json()`/`cookieParser()` and before all routes, using a custom format:
  `:method :path :status :response-time ms` (with `:path` a custom token returning `req.path`, i.e. no query string). Use `morgan("default", { ... })` style streaming to `process.stdout` (morgan's default stream), no file output.
- Every request is logged, including `/api/health`.
- Extend `errorHandler` in `server/src/middleware/error.ts` to print context (`[ERROR] METHOD /path STATUS message`) before the existing `console.error("Unhandled error:", err)` for unexpected errors. Expected `HttpError`/Postgres-mapped errors get the same concise context line without a stack trace. Paths are sanitized by stripping any query string.
- No changes to route files or database code.

## Verification

- `cd server && npm run build` (typecheck/compile) passes.
- Start the backend, call a few endpoints (including a 404 and `/api/health`), and confirm one log line per request with expected method/path/status/duration.
- Trigger an error (e.g. unknown route) and confirm the error context line appears.
