# Study Spot Content and Image Reliability

## Intent

Make every Discover tile and its detail page internally consistent: each place
has its own review count and varied information, while images render reliably
even when external image hosts are unavailable.

## Goals

- Show each catalog place's review count on its Discover tile.
- Seed realistic, varied review tiles for each place so detail-page content
  agrees with the catalog count.
- Provide varied detail-page data from the existing catalog: hours, status,
  amenities, descriptions, ratings, and review summaries.
- Use local image assets or a local fallback for reliable rendering.

## Non-goals

- No backend persistence or real user reviews.
- No live image fetching or remote-image dependency.
- No changes to the existing review submission flow.

## Approach

Use the existing typed `studySpotCatalog` as the source of truth. Add a small
local image set under `public/assets/study-spots/`, assign four local images
per place, and derive seeded review records from each place's metadata with
varied authors, ratings, locations, and text. Keep the existing Zustand store
for newly submitted reviews; seeded reviews remain mock data.

## Implementation calls

- Review counts are the number of seeded reviews plus any persisted submitted
  reviews when the detail page renders.
- Tile review counts use the catalog's `reviews` value.
- Local images are preferred; the existing detail components continue to
  consume ordinary string image URLs.
- Generated reviews use concise, place-specific text and maintain the current
  `SpotReview` shape.
