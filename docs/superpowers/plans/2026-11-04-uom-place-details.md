# University of Moratuwa Place Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Discover tile open a detail page populated with that tile's own catalog data.

**Architecture:** Keep `uom-library` on its existing rich `SpotDetail` record. Add a catalog-to-`SpotDetail` adapter for every other slug, using the shared 20-place catalog for names, images, ratings, hours, and amenities, with clearly mock presentation metrics and an empty review list. Update `getSpotDetail` to select by slug and fall back explicitly to the catalog adapter.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Zustand, local mock data, existing SpotDetail components.

**Spec:** `docs/superpowers/specs/2026-11-04-uom-discover-catalog-design.md`

## Global Constraints

- Frontend-only mock data; no backend, real availability, or live persistence.
- Preserve existing route slugs and bookmark behavior.
- Keep department laboratories and postgraduate spaces described as supervised or authorised where applicable.
- Use local project image assets for stable rendering.

## Review Focus

- Existing `uom-library` must retain its detailed timeline, metrics, and reviews.
- Unknown or stale slugs must not silently show another place's identity.
- Every catalog slug must resolve to matching name, hero image, rating, and amenities.
- Detail pages must remain compatible with the existing review store keyed by slug.
- Four image references must produce a valid photo count even though the current detail hero displays one image.

---

### Task 1: Add a catalog-to-detail adapter

**Files:**
- Modify: `src/mocks/data/spot-detail.ts`
- Modify: `src/features/student/types/spot-detail.ts` only if a type needs a small adapter-compatible adjustment
- Test: no dedicated test runner exists; verify through typecheck and route QA

**Interfaces:**
- Consumes: `studySpotCatalog: StudySpot[]`
- Produces: `getCatalogSpotDetail(slug: string): SpotDetail | undefined`

- [ ] **Step 1: Implement `getCatalogSpotDetail(slug: string)` in `src/mocks/data/spot-detail.ts`**

Map `StudySpot` fields to the existing `SpotDetail` shape:

- `name`, `rating`, `reviews`, and `imageUrls[0]` become the identity/hero fields.
- `hero.photoCount` is `imageUrls.length`.
- Build a compact hours timeline from the catalog hours string without claiming live availability.
- Convert the first six catalog amenities into `SpotAmenity` objects using existing detail icon assets.
- Use the catalog description in the verdict detail and return no seeded reviews for generated places.

- [ ] **Step 2: Verify generated detail data**

Run `npx tsc --noEmit`.

Expected: PASS with no TypeScript errors.

### Task 2: Resolve detail routes by slug

**Files:**
- Modify: `src/services/student/index.ts`

**Interfaces:**
- Consumes: existing `spotDetail`, `getCatalogSpotDetail`, and `getStudyLocations`.
- Produces: `getSpotDetail(id: string): Promise<SpotDetail>`.

- [ ] **Step 1: Update `getSpotDetail`**

Return the existing detailed `spotDetail` for `uom-library`. For all catalog slugs,
return the adapter result with the requested slug. If the slug is not recognized,
throw an explicit `Error` so an invalid route cannot display misleading data.

- [ ] **Step 2: Verify route data**

Run `npx tsc --noEmit` and `npm run build`.

Expected: both commands pass.

### Task 3: Browser-verify tile-specific navigation

**Files:**
- No source changes expected.

- [ ] **Step 1: Start the app**

Run `npm run dev`.

- [ ] **Step 2: Verify at least three tile routes**

Open `/student/home`, click the library, Civil Engineering study room, and RS & GIS Laboratory tiles, and verify each page's heading, hero alt text/photo count, rating, and amenities match the clicked place.

- [ ] **Step 3: Verify shared behavior**

On one generated detail page, toggle the bookmark and submit a review. Confirm the saved state and review remain keyed to that slug and do not appear on the library page.

