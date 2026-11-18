# Curated Location Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed all 28 locations with five rotated images from one curated pool of five visually distinct PNGs.

**Architecture:** Replace `IMAGE_POOL` in `server/src/db/seed.ts` with the five chosen URLs, delete the two Figma overrides, and add a single `imagesFor(index)` helper used by both catalog and admin rows. No frontend, API, asset or database changes.

**Tech Stack:** TypeScript, Drizzle seed script (`tsx src/db/seed.ts`), existing static PNGs in `public/assets/`.

**Spec:** `docs/superpowers/specs/2026-11-18-location-image-curation-design.md`

## Global Constraints

- Edit only `server/src/db/seed.ts` (plus this plan and the spec). Do not modify any PNG, frontend file, schema or migration.
- Curated pool in exact order: `/assets/home/838a8.png`, `/assets/select-university/50ace.png`, `/assets/home/64a28.png`, `/assets/review/96063.png`, `/assets/home/26beb.png`.
- Every location gets exactly five entries; rotation offset is `index % 5`.
- Do **not** run `npm run db:seed` — it is destructive and the user runs it separately.

## Review Focus

- Admin rows previously had one image — verify `adminRows` now sets `imageUrls` with its own index, or eight locations stay at one photo.
- Old overrides could survive as dead constants — verify `IMAGE_OVERRIDES` and `imageCursor` are gone.
- A rotation bug could repeat a URL inside one location — verify five distinct entries per location.
- Chosen URLs could point to files that don't exist — verify all five resolve under `public/assets/`.
- Unrelated seed data could be disturbed — verify the diff touches only image assignment lines.

---

### Task 1: Curate the pool and apply it to all locations

**Files:**
- Modify: `server/src/db/seed.ts` (`IMAGE_POOL` at ~210-225, `IMAGE_OVERRIDES` at ~227-240, `catalogRows` image assignment at ~537-562, `adminRows` at ~573-589)

**Interfaces:**
- Consumes: existing `SeedLocation.spec.imageUrls: string[]`, `CATALOG`, `ADMIN_LOCATIONS`, `allLocationRows`.
- Produces: `imagesFor(index: number): string[]` returning five URLs; every row in `allLocationRows` has five image URLs.

- [x] **Step 1: Replace the pool constant**

Replace the 14-entry `IMAGE_POOL` array with exactly the five curated URLs in the order given in Global Constraints. Delete the `IMAGE_OVERRIDES` map entirely; leave the `noiseFor` helper below it unchanged.

- [x] **Step 2: Add the rotation helper**

Define `function imagesFor(index: number): string[]` immediately after `IMAGE_POOL`:
`Array.from({ length: 5 }, (_, offset) => IMAGE_POOL[(index + offset) % IMAGE_POOL.length])`.

- [x] **Step 3: Wire catalog rows**

In `catalogRows`, remove `imageCursor`, `firstImageIndex` and the `imageUrls:` expression using `IMAGE_OVERRIDES`; set `imageUrls: imagesFor(index)` using the existing `map((spot, index) => ...)` parameter.

- [x] **Step 4: Wire admin rows**

In `adminRows`, add `imageUrls: imagesFor(index)` to `spec` using its existing `map((loc, index) => ...)` parameter, so all eight admin locations also receive five images.

- [x] **Step 5: Verify compile and static behavior**

Run `cd server && npm run build`. Expected: clean TypeScript compile. Then check that all five URLs exist on disk under `public/assets/`, that no `IMAGE_OVERRIDES`/`imageCursor` reference remains, and that a quick evaluation of `imagesFor(0..27)` yields five distinct URLs per row with the starting URL advancing by one each row.

- [x] **Step 6: Review the diff**

Run `git diff -- server/src/db/seed.ts`. Expected: changes confined to the pool, deleted overrides, the new helper, and the two `imageUrls` assignments — no changes to ratings, review counts, universities, hours, amenities or report options. Do not commit unless the user asks.
