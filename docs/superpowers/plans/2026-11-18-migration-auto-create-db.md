# Auto-Create Database During Migrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `npm run db:migrate` create the target PostgreSQL database when it is absent, without touching an existing one.

**Architecture:** `create-db.ts` becomes an import-safe module exporting a reusable `ensureDatabase(connectionString)` plus three small pure helpers. It connects to the `postgres` maintenance database, checks `pg_database`, and issues a quoted `CREATE DATABASE` only when missing. `migrate.ts` calls `ensureDatabase()` before opening its own pool, then migrates exactly as before. A `db:create` npm script is added and the README setup step is updated.

**Tech Stack:** Node 20 + TypeScript (NodeNext, CommonJS output), `tsx`, `pg`, Drizzle ORM migrator, npm scripts.

**Spec:** `docs/superpowers/specs/2026-11-18-migration-auto-create-db-design.md`

## Global Constraints

- Server compiles to **CommonJS** (`module: NodeNext`, `server/package.json` has no `type: module`). `import.meta` is rejected by `tsc` (TS1470) — verified. Use `require.main === module` for the CLI guard; it works under both `npx tsx` and compiled `node dist/...`.
- Relative imports in `server/src` use an explicit `.js` extension (e.g. `../db/index.js`). Follow that convention.
- `dotenv.config()` must remain at the top of `create-db.ts` so its standalone CLI loads `server/.env`.
- Never drop, recreate or seed a database that already exists. No schema, migration-file, seed-data or runtime API changes.
- The Postgres role may lack `CREATEDB`; that must surface as a clear failure, not be swallowed.
- Do not run `npm run db:seed` against the real `studyspot` database during verification.

## Review Focus

- **Fresh install, target DB absent** — `db:migrate` must create it before Drizzle connects; a reasonable person expects no manual `CREATE DATABASE`. Test: Task 2 source check asserts `ensureDatabase` precedes target-pool creation; Task 2 integration check against a scratch DB.
- **Target DB already exists** — a reasonable person expects their data to survive; `ensureDatabase` must only check and return `false`. Test: Task 1 unit check (existence query + no `DROP`) and Task 2 re-run integration check.
- **Database name with quotes or punctuation** — a reasonable person expects any name from `DATABASE_URL` to work; the identifier must be doubled-quoted and the lookup parameter-bound. Test: Task 1 helper unit check with `odd"db-1`.
- **Two migrations race on a fresh server** — a reasonable person expects both to finish; Postgres `42P04` (duplicate_database) must be treated as "already exists". Test: Task 1 source check asserts the `42P04` branch returns `false`.
- **`create-db.ts` is imported by `migrate.ts`** — a reasonable person expects importing a helper module to have no CLI side effects; the top-level `main()` call must be guarded. Test: Task 1 source check for the `require.main === module` guard and absence of an unguarded `main()` call.

---

### Task 1: Refactor `create-db.ts` into an import-safe helper module

**Files:**
- Modify: `server/src/db/create-db.ts`

**Interfaces:**
- Produces (consumed by Task 2 and verification):
  - `databaseNameFrom(connectionString: string): string` — decoded path segment after the leading `/`; throws if empty.
  - `adminConnectionString(connectionString: string): string` — same URL with `pathname` replaced by `/postgres`.
  - `quoteIdentifier(name: string): string` — wraps in `"` and doubles internal `"` characters.
  - `ensureDatabase(connectionString: string): Promise<boolean>` — `true` if created, `false` if already present; throws on any other failure.

- [ ] **Step 1: Write the failing source-level verification script**

Create `.superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs` that reads `server/src/db/create-db.ts` and asserts:
  - it exports all four names above (`export function ...` / `export async function ...`);
  - it contains `require.main === module` and does **not** contain an unguarded top-level `main()` invocation (the only call must be inside the guard block);
  - it contains `pg_database` and a `$1`-parameterised `datname` lookup;
  - it contains `CREATE DATABASE` using the quoted identifier (not a hardcoded `studyspot`);
  - it contains a `42P04` branch that returns `false`;
  - it no longer hardcodes `"/studyspot"` or `CREATE DATABASE studyspot`.

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: FAIL — the exports and guard do not exist yet.

- [ ] **Step 2: Implement the refactor in `server/src/db/create-db.ts`**

Keep `import dotenv from "dotenv"; dotenv.config();` and `import { Pool } from "pg";` at the top. Add:
  - `databaseNameFrom` using `new URL(connectionString)` and `decodeURIComponent(url.pathname.slice(1))`; throw `new Error("DATABASE_URL must include a database name")` when empty.
  - `adminConnectionString` using a cloned `URL` with `pathname = "/postgres"` and `.toString()`.
  - `quoteIdentifier` returning `` `"${name.replace(/"/g, '""')}"` ``.
  - `ensureDatabase` that opens one pool from `adminConnectionString(connectionString)`, runs `SELECT 1 FROM pg_database WHERE datname = $1` with the plain name, returns `false` on a row, otherwise runs `CREATE DATABASE ${quoteIdentifier(name)}`, catches error code `42P04` and returns `false`, returns `true` on success, and always `await pool.end()` in `finally`. Do not swallow any other error.
  - A CLI block `if (require.main === module) { ... }` that reads `process.env.DATABASE_URL`, throws the same missing-var error if unset, calls `ensureDatabase`, logs `Database '<name>' created` or `Database '<name>' already exists`, and on failure sets `process.exitCode = 1` and logs `Failed to create database:`.

- [ ] **Step 3: Run the verification script and the build**

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: PASS.

Run: `npm run build` in `server/`
Expected: PASS with no TS errors (confirms the `require.main === module` guard is CJS-compatible).

- [ ] **Step 4: Check the pure helpers behave correctly**

Create `.superpowers/sdd/2026-11-18-migration-auto-create-db/helpers.test.ts` importing the four exports from `../../server/src/db/create-db.js` (tsx resolves the `.js` specifier to the `.ts` source). Use `node:assert/strict` to assert:
  - `databaseNameFrom("postgresql://u:p@localhost:5432/studyspot")` === `"studyspot"`;
  - `databaseNameFrom("postgresql://u:p@localhost:5432/odd%22db-1")` === `'odd"db-1'`;
  - `quoteIdentifier('odd"db-1')` === `'"odd""db-1"'`;
  - `adminConnectionString("postgresql://u:p@localhost:5432/studyspot")` ends with `/postgres`.

Run: `npx tsx .superpowers/sdd/2026-11-18-migration-auto-create-db/helpers.test.ts` from the repo root
Expected: PASS with exit 0. Do not print any real credential from `server/.env`.

- [ ] **Step 5: Commit**

```bash
git add server/src/db/create-db.ts
git commit -m "refactor(db): make database creation reusable and import-safe"
```

---

### Task 2: Call `ensureDatabase` from `migrate.ts` before opening the target pool

**Files:**
- Modify: `server/src/db/migrate.ts`

**Interfaces:**
- Consumes: `ensureDatabase(connectionString: string): Promise<boolean>` from `./create-db.js` (Task 1).
- Produces: unchanged CLI behaviour — `db:migrate` exits 0 on success, 1 on failure with `Migration failed:`.

- [ ] **Step 1: Extend the verification script with the migration-ordering assertion**

Add to `.superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs` assertions that `server/src/db/migrate.ts`:
  - imports `ensureDatabase` from `./create-db.js`;
  - calls `await ensureDatabase(connectionString)`;
  - contains that call at a lower character index than `new Pool(` (creation happens before the target pool is opened).

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: FAIL on the new assertions.

- [ ] **Step 2: Wire it up in `server/src/db/migrate.ts`**

Add `import { ensureDatabase } from "./create-db.js";`. Move `const pool = new Pool({ connectionString });` from module scope into `main()`, immediately after `await ensureDatabase(connectionString);`. Wrap the Drizzle setup, `migrate(db, { migrationsFolder: "./drizzle" })` and success log in `try`, and `await pool.end()` in `finally`. Leave the `DATABASE_URL` presence check and the trailing `main().catch(...)` (logging `Migration failed:` and `process.exit(1)`) unchanged.

- [ ] **Step 3: Run verification and build**

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: PASS (all Task 1 and Task 2 assertions).

Run: `npm run build` in `server/`
Expected: PASS.

- [ ] **Step 4: Integration check on a scratch database (only if local Postgres is reachable)**

Check reachability of `localhost:5432`. If unreachable, record that fact in the verification notes and skip — do not start or reconfigure Postgres. If reachable:
  - in PowerShell, save `$original = $env:DATABASE_URL` (do not print it), then set `$env:DATABASE_URL` to the same connection string with the final database name replaced by a unique scratch name (e.g. `spotwise_migrate_probe_<timestamp>`);
  - run `npx tsx src/db/migrate.ts` from `server/` and confirm it creates the database, applies migrations and logs `Migrations completed`;
  - run the same command a second time and confirm it logs no creation and still succeeds (existing-database path);
  - restore `$env:DATABASE_URL = $original`, then drop the scratch database via a short `npx tsx` script using a `postgres`-database connection and `quoteIdentifier`;
  - never touch the real `studyspot` database and never print the connection string.

Expected: both runs exit 0; scratch database dropped afterwards.

- [ ] **Step 5: Commit**

```bash
git add server/src/db/migrate.ts
git commit -m "feat(db): auto-create target database before running migrations"
```

---

### Task 3: Add the `db:create` npm script and update the README

**Files:**
- Modify: `server/package.json`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run db:create` from `server/` behaves like `npx tsx src/db/create-db.ts`.

- [ ] **Step 1: Extend the verification script with packaging/docs assertions**

Add assertions that `server/package.json` has `scripts["db:create"] === "tsx src/db/create-db.ts"`, and that `README.md` mentions `npm run db:create` and states that `db:migrate` creates the database when missing.

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: FAIL on the new assertions.

- [ ] **Step 2: Add the script**

Insert `"db:create": "tsx src/db/create-db.ts"` immediately before `"db:migrate"` in `server/package.json`. Do not change any other script.

- [ ] **Step 3: Update the README setup step**

In section `### 4. Create, migrate, seed`, update the command block so it shows `npm run db:create` as optional, keeps `npm run db:migrate` and `npm run db:seed`, and add one sentence: migrations now create the database automatically when it is absent, so `db:create` is only needed when you want to create it without migrating. Keep the existing seed warning.

- [ ] **Step 4: Run final verification**

Run: `node .superpowers/sdd/2026-11-18-migration-auto-create-db/check.test.mjs`
Expected: PASS (all assertions).

Run: `npm run build` in `server/`
Expected: PASS.

Run: `git diff --check` from the repo root
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add server/package.json README.md
git commit -m "docs(db): document db:create and automatic database creation"
```

After final review, delete only `.superpowers/sdd/2026-11-18-migration-auto-create-db/` — it contains throwaway verification scripts, not deliverables. Keep the spec and plan docs.
