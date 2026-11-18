# Auto-create the database during migrations

## Intent

`npm run db:migrate` currently fails if the target database in `DATABASE_URL` doesn't exist. Make it check first and create the database when missing, so a fresh Postgres instance needs no manual `CREATE DATABASE` step before migrating.

## Goals / non-goals

- Goal: `db:migrate` succeeds on a fresh server where the target database is absent.
- Goal: an existing database is left untouched — no data loss, no drop/recreate.
- Non-goal: changes to schema, migrations, seed data or runtime API behaviour.
- Non-goal: granting database privileges; the Postgres role still needs `CREATEDB`, and a lack of it must surface as a clear failure.

## Constraints

- `server/src/db/create-db.ts` already creates `studyspot` as a standalone CLI, but runs immediately on import and hardcodes the `/studyspot` → `/postgres` URL replacement. It must become import-safe and work for any database name in `DATABASE_URL`.
- `server/src/db/migrate.ts` throws when `DATABASE_URL` is unset and calls Drizzle's `migrate()` against the target database. The existence check must happen before that pool is created.
- NodeNext/ESM with `tsx`; TypeScript strict mode.
- Keep the CLI (`npx tsx src/db/create-db.ts` / new `npm run db:create`) working.

## Approaches considered

1. **Refactor `create-db.ts` into `ensureDatabase()` and call it from `migrate.ts` (chosen)** — one source of truth, also lets us add the `db:create` npm script mentioned in AGENTS.md. Cost: touches `create-db.ts`, `migrate.ts` and `server/package.json`.
2. Inline the check in `migrate.ts` only — smaller diff, but duplicates creation logic that already exists.
3. Attempt the connection and create only on the `3D000` error — fewer happy-path queries, but error-driven control flow can mask real connection failures.

## Decisions

- Export `ensureDatabase(connectionString: string): Promise<boolean>` from `create-db.ts`: `true` when created, `false` when it already existed.
- Derive the target name from the URL pathname (not a hardcoded string) and connect to the `postgres` maintenance database via `adminConnectionString()`. Quote the database identifier to handle unusual names; treat Postgres `42P04` (duplicate_database) as "already exists" for a race between two migrations.
- `create-db.ts` keeps a CLI entry point guarded by a direct-execution check; it uses `process.exitCode = 1` on failure instead of `process.exit(0)`.
- `migrate.ts` calls `ensureDatabase(connectionString)` before opening its own pool, so migrations still run exactly once and only after the database exists.
- Add `db:create` to `server/package.json` and document it in the README setup step (migrations remain self-sufficient).

## Verification

- `cd server && npm run build` passes.
- Source-level RED→GREEN check: `migrate.ts` calls `ensureDatabase` before its target pool is created; `create-db.ts` exports `ensureDatabase` and no longer auto-runs on import.
- Unit check of the pure helpers (`adminConnectionString`, identifier quoting) for a standard URL and one with special characters.
- If local Postgres is reachable, integration check: point `DATABASE_URL` at a uniquely named scratch database, run `db:migrate`, confirm it creates and migrates it, then drop the scratch database. Never touch the real `studyspot` database during verification.
- Existing database path: run `db:migrate` again and confirm it reports no creation and succeeds.
