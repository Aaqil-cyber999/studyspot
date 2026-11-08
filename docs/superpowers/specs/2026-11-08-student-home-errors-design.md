# Student home error fix

## Intent

Fix the `/student/home` runtime errors without changing the existing search,
filter, or admin-option behavior.

## Scope

- Define the normalized search query before filtering study spots.
- Select the stable `options` array from Zustand, then derive active amenity
  labels with `useMemo` so the selector does not return a new array on every
  snapshot.
- Leave the shared admin-options store and other routes unchanged.
- Verify with lint, typecheck, and build; separately confirm whether the
  `CodeFrameColorMode` message is app-owned or Next.js development tooling.

## Approaches

The selected approach is a surgical page fix. A broader store selector helper
was considered, but it would expand the change surface for a warning isolated
to the home page.

## Constraints

The app remains frontend-only with mock data. Existing UI behavior, filtering
semantics, and route structure must be preserved.
