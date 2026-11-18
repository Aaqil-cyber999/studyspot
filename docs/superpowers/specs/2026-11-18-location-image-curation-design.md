# Curated location images in the seed

## Intent

Give every seeded location five visually distinct study-space photos, instead of four for most student spots and one for the platform-wide admin spots. The choice is driven by variety so the student tiles, photo counts and detail-page carousels show a fuller, less repetitive gallery.

## Goals / non-goals

- Goal: all 28 seeded locations (20 catalog + 8 admin) have exactly five `imageUrls` entries.
- Goal: the five URLs come from one curated pool, rotated so adjacent locations do not share the same hero image.
- Non-goal: adding, moving or editing any PNG in `public/assets/` — the files stay where they are.
- Non-goal: changing other seeded data, ratings, review counts, frontend code or API shapes.
- Non-goal: running `db:seed` as part of this task; the user runs it when ready (it is destructive).

## Constraints

- Only files already referenced by the seed may be used. The pool contains 14 URL entries but 11 unique PNGs; duplicates live in `saved/`, `results/` and other folders.
- This model cannot view image files, so "most distinct" was determined numerically: 24×24 RGB composition plus a normalized 4×4×4 HSV histogram, using farthest-point sampling. The sampled set had a nearest-neighbour distance of 0.79–0.90; at the user's request `/assets/home/64a28.png` replaced `/assets/home/296f7.png` in slot 3, reducing the set's minimum distance to ~0.67. The user accepted that trade-off.
- Frontend already handles any array length: `imageUrls[0]` is the hero, `imageUrls.length` is the photo count, and the detail pages render a carousel. No frontend change is required.
- Seed must remain deterministic and idempotent.

## Approaches considered

1. **Curated pool + rotation helper (chosen)** — replace `IMAGE_POOL` with five URLs, drop `IMAGE_OVERRIDES`, add one helper that returns the five URLs starting at `index % 5`; use it for both catalog and admin rows. One source of truth, uniform output. Cost: the two Figma-specific overrides disappear, but they only reordered files from the same pool.
2. Extend the existing pool and overrides and append missing images — smaller textual diff, but two sources of truth and a separate patch for admin locations.
3. Post-process all rows near the insert loop — smallest diff, but image assignment becomes detached from the location definitions.

## Decisions

- Curated pool, in this order: `/assets/home/838a8.png`, `/assets/select-university/50ace.png`, `/assets/home/64a28.png`, `/assets/review/96063.png`, `/assets/home/26beb.png`.
- Delete `IMAGE_OVERRIDES`; remove `imageCursor`/first-image-index bookkeeping in `catalogRows`.
- Add a single `imagesFor(index)` helper: `Array.from({ length: 5 }, (_, offset) => IMAGE_POOL[(index + offset) % IMAGE_POOL.length])`.
- `catalogRows` uses `imagesFor(index)`; `adminRows` gets the same field using its own array index, so all 28 rows end up with five.
- No file outside `server/src/db/seed.ts` and this design document is changed; no database is touched.

## Verification

- `cd server && npm run build` compiles cleanly.
- Static check of the helper output: five entries per location, all five distinct, rotation offset advances by one per location.
- Confirm no other seed data or URL literals were altered (diff review).
- The user runs `npm run db:seed` separately when ready; spot-check a student and an admin location afterwards if desired.
