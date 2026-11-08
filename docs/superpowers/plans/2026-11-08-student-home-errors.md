# Student Home Errors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `/student/home` runtime errors while preserving search and filter behavior.

**Architecture:** Keep `useAdminOptionsStore` unchanged. Select its stable `options` array in the client page, derive active amenity labels with `useMemo`, and normalize the local search query before the existing `visibleSpots` memo.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, ESLint.

**Spec:** [2026-11-08-student-home-errors-design.md](../specs/2026-11-08-student-home-errors-design.md)

## Global Constraints

- Frontend-only mock data; no backend or auth changes.
- Preserve existing search, filter, route, and UI behavior.
- Do not add dependencies or change shared store behavior.

## Review Focus

- Empty and whitespace-only queries must show all spots.
- Query matching must remain case-insensitive and punctuation-insensitive through the existing `normalize` helper.
- Active amenity ordering must remain based on each option’s `order`.
- Admin option updates must still refresh the chip list because the page selects the store’s `options` array.
- Initial rendering must not trigger the Zustand `getSnapshot` warning or an infinite render loop.

---

### Task 1: Stabilize student home derived state

**Files:**
- Modify: `src/app/student/home/page.tsx:121-140`

**Interfaces:**
- Consumes: `useAdminOptionsStore((state) => state.options)`.
- Produces: stable `configuredAmenities`, defined `normalizedQuery`, and the existing `visibleSpots` behavior.

- [ ] **Step 1: Select the stable options array**

Replace the selector that filters, sorts, and maps inside the selector with a selector returning only `state.options`; derive the active amenity labels in a `useMemo` keyed by that array. Copy the array before sorting so store state is not mutated.

- [ ] **Step 2: Define the normalized query**

Add `const normalizedQuery = normalize(query);` alongside the existing local query/filter state so the existing search predicate and dependency list use a defined value.

- [ ] **Step 3: Run targeted static validation**

Run: `npm run lint -- src/app/student/home/page.tsx`

Expected: no errors for the modified page.

- [ ] **Step 4: Run type checking**

Run: `npm run typecheck`

Expected: TypeScript exits successfully.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: Next.js compiles successfully with no application-code errors.

- [ ] **Step 6: Verify the development-only CodeFrame message**

Run the existing dev command and request `/student/home`, then inspect the server output. Expected: the route responds successfully without the `invalid type: boolean true, expected enum CodeFrameColorMode` rejection. If the message remains with no app source/config reference, record it as a Next.js 16.4.3 tooling issue rather than changing application behavior.
