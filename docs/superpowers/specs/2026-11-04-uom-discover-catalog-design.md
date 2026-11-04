# University of Moratuwa Discover Catalog

## Intent

Expand Discover from five hardcoded cards to twenty study-friendly University of
Moratuwa places, make the existing search field useful, and ensure every tile
opens an info page populated for that place. The frontend remains mock-data-only,
with stable slugs so saved bookmarks and detail routes continue to work.

## Goals

- Keep the five existing Discover places and add fifteen facilities grounded in
  official University of Moratuwa sources.
- Store rich, reusable metadata in one typed catalog: category, faculty/area,
  description, hours, rating, review count, amenities, four image references,
  and source URL.
- Render cards from the catalog and filter them case-insensitively across name,
  category, faculty, area, description, and amenities.
- Preserve existing bookmark behavior and route slugs.
- Keep the existing detailed library experience for `uom-library`; derive the
  other detail pages from the shared catalog rather than duplicating twenty
  complete records.

## Non-goals

- No backend, persistence, real availability, or live search API.
- No claim that department labs or postgraduate spaces are open to casual
  drop-in use.
- No invented live occupancy data; generated detail metrics are clearly mock
  presentation data.
- No redistribution of official University of Moratuwa photography. The current
  mock uses existing local project assets for stable rendering; source metadata
  makes future licensed asset replacement straightforward.

## Approach

The chosen approach is a centralized local catalog consumed by Discover and
Saved and, for all non-library routes, the detail page. A separate data source
would duplicate records and break bookmark consistency; remote image URLs would
make the mock page fragile and introduce licensing/runtime failures. Search is a
normalized token matcher rather than a substring check on only the place name,
so queries such as “GIS printer” and “civil computer” work without a dependency.

The detail service will map catalog metadata into the existing `SpotDetail`
shape. The existing library record remains the source for its richer timeline,
metrics, and reviews; other places receive catalog-specific hero, heading,
hours, and amenities with safe mock status/review presentation.

## Remaining implementation

Create the catalog, refactor the Discover cards to a reusable data-driven
renderer, map every slug to its own detail data, add search state/result
feedback, and validate typecheck, lint, build, and browser behavior.
