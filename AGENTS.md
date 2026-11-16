# SpotWise Frontend — Agent Instructions (Updated)

## Stack
Next.js 16 (App Router) + TypeScript, Tailwind CSS 4, shadcn/ui, Lucide React, Zustand, TanStack Query, Zod.

## Commands
- dev: `npm run dev`
- lint: `npm run lint`
- typecheck: `npx tsc --noEmit`
- build: `npm run build`
- backend dev: `cd server && npm run dev` (Express on :4000)
- backend db: `cd server && npm run db:create|db:migrate|db:seed|db:studio`

## Backend (server/)
Express + Drizzle + PostgreSQL. All routes live under `/api/*`. Database `studyspot` on local Postgres (credentials in `server/.env`). Seeded accounts (password `admin123` for admins, OTP sign-in for the student): `superadmin@spotwise.lk` (super-admin), `amal.perera@uom.lk` et al. (university-admins, `Dr.`/`Prof.` titles split into a `title` column), `mohamed.25@uom.lk` (student, mirrors the frontend profile mock) and 9 mock author students. Students carry full profiles (SVG initials `profile_img` data URLs, `address`, `study_preferences` JSON `{ studyStyle, noiseLevel, studyType }`, `amenities`); university_admins carry (title, `address`, `profile_img`); super_admins are leanest (email/passwordHash, status, name, `address`, `profile_img` — **no university link**).
- Seed contents: 6 universities; 28 locations (20 student-catalog spots + 8 platform-wide admin locations; `slug` dropped); ~2,990 deterministic reviews (one curated Hidden) whose average/counts match the Figma mock exactly; the student's two saved places; 13 normalized `report_options` (wifi Strong/Medium/Weak · noise Quiet/Moderate/Loud · crowd Low/Medium/High · seats Yes/Limited/No/Unsure) backing the student report form; 196 `location_hours` rows; 58 active `amenities` rows (master list — labels validated at write time); 4 `otp_codes` rows (all expired/consumed — no usable code). `locations` holds only the latest report inline (`noise/crowd/seats/wifi`) + `last_reported_by`/`last_reported_at`; the old `reports` table is gone.
- Schema (`server/src/db/schema.ts`): `students`/`university_admins`/`super_admins` replace `users`; `reviews` replaces `comments`; `review_votes(review_id PK, voter_ids uuid[])` replaces `comment_votes`; `report_options` replaces `admin_options` (amenities removed — moved to the `amenities` master table); `notifications` is gone entirely. IDs are Postgres `uuid`, emails/university names case-insensitively unique, FKs indexed.
- Migrations live in `server/drizzle/` (regenerate with `npx drizzle-kit generate` after schema changes; this project resets the local DB with `db:create` + `db:migrate` + `db:seed` — never against production).
- Notifications are fully removed: no table, no `/api/notifications`, no fan-out, no frontend notification calls. The UA options screen is now `/university-admin/settings/options` (backed by `GET/POST/PUT/DELETE /api/report-options`, `…/move`) and reads/writes the live DB.
- Hardening: `asyncHandler` + central error middleware (`src/middleware/error.ts`), 404 handler, zod validation on all inputs, 10 MB JSON body limit, in-memory rate limiting on auth and registration submission, `HttpError`, consistent `{error, details?}` error shape, `publicUser()` serializer (never leaks `passwordHash`).
- Auth stays JWT httpOnly cookie (`token`, 7d, sameSite=lax). Login rejects Inactive accounts. `/api/auth/me` returns the current account incl. `universityId`/`universityName` where applicable.
- Approval side effects: `PUT /api/registration-requests/:id/status` with `Approved` creates the university (or reactivates it) and a university-admin account (with `title` from the request) + a one-time `temporaryPassword` in the response. Re-deciding a decided request → 409.
- Locations carry computed `rating`/`reviews` (avg/count of Visible reviews) and only the **latest** student report inline (`noise/crowd/seats/wifi` + `last_reported_by`/`last_reported_at`). University-admins are scoped to their own university (create/update/delete and list `GET /api/locations?universityId=`); super-admins are unrestricted.
- New routes: `GET/POST/DELETE /api/saved/:locationId`, `PUT /api/users/me`, `PUT /api/users/me/profile-image`, `GET /api/users?role=`, `PUT /api/users/:id/status` (body `{role,status}`), `GET /api/locations/:id`, `GET/PUT /api/locations/:id/hours`, `GET /api/reviews`, `GET /api/reviews/location/:locationId`, `PUT /api/reviews/:id/status`, `POST /api/reviews/:id/vote` (toggle Helpful; `voter_ids[]` array column), `GET /api/amenities`, `POST /api/amenities/validate`, `GET/POST/PUT/DELETE /api/report-options`, `POST /api/report-options/:id/move`, `POST /api/reports` (upserts live status onto the location), `GET /api/dashboard/overview`. Review list endpoints (`/api/reviews`, `/api/reviews/location/:id`) return `helpfulVotes` and, when a session cookie is present, `votedByMe` (via `optionalAuth`). `GET /api/dashboard/stats` is SQL-aggregated.

### Route protection (all three portals)
- **`src/proxy.ts`** (Next 16 "proxy" middleware, renamed from `middleware.ts`): guards `/student/*`, `/university-admin/*`, `/super-admin/*`. It decodes the JWT payload **without verifying the signature** to route users (API remains the security boundary; layouts re-verify via `/api/auth/me`). Unauthenticated → portal login; wrong role → own portal home (no loops); signed-in users hitting a login page → portal home. Public exceptions: `/student/login`, `/student/verify`, `/university-admin/login`, `/university-admin/register`, `/super-admin/login`.
- **Layout guards** (`src/app/<portal>/layout.tsx`): block rendering until the persisted role hydrates, then hard-gate to that portal's role client-side (wrong role → `<router.replace>` to login; defense-in-depth behind the proxy). The student layout now mirrors the admin ones (it was unguarded before).
- **Student sign-in is real**: `/student/login` posts to `/api/auth/otp/request` (rate-limited in production; 100/10min in dev), `/student/verify` exchanges the 6-digit code via `/api/auth/otp/verify` for the JWT cookie and `setSession("student", name)`. Existing accounts land on `/student/home`; brand-new accounts (auto-provisioned on first sign-in) go to `/student/info` for onboarding — the verify response carries `isNewAccount` to drive this. OTP verification **refuses existing non-student accounts** with 403 (admins keep password sign-in). In dev, `devCode` is returned by the API and surfaced in a toast ("demo code: …"); no email provider yet. The hardcoded `654321` is gone.
- **API security boundary**: all `/api/*` routes require auth except `GET /api/locations`, `GET /api/locations/:id(/hours)`, `GET /api/universities*`, `GET /api/report-options`, `GET /api/amenities` (actives), `/api/auth/*` (login/logout/register/OTP), `POST /api/registration-requests`, `/api/health`. Everything else is `requireAuth` + `requireRole` or scoped to the caller's university.
- Seeded demo sign-ins: student `mohamed.25@uom.lk` (OTP — dev returns `devCode` in the request response, shown as a toast), UA `amal.perera@uom.lk / admin123`, SA `superadmin@spotwise.lk / admin123`.

### Frontend ↔ API wiring (complete — all data comes from the DB)
- `NEXT_PUBLIC_API_URL=http://localhost:4000/api` in `.env.local`. `src/services/api.ts` is a typed client (`ApiError` with `.status`, cookies via `credentials: "include"`); `src/services/auth.ts` has `login/logout/me/updateProfile/updateProfileImage`.
- **All portals are DB-backed end-to-end.** `src/mocks/` and `src/stores/super-admin-store.ts` are deleted; nothing imports them. Data flows only through `src/services/{student,university-admin,super-admin}/*` + TanStack Query. Student sign-in is real OTP (`/api/auth/otp/request` + `/verify`; in dev the API returns `devCode`, surfaced as a toast/demo code).
- **Student**: Discover (`/student/home`, `["student","locations"]` via `GET /api/locations?status=Active`), spot detail (`/student/results/[id]`, client query on `["location", id]` → `GET /api/locations/:id` + `GET /api/reviews/location/:id`), saved places (`src/hooks/use-saved-places.ts` — optimistic save/remove + `["saved","places"]` against `GET/POST/DELETE /api/saved`; used by Discover tiles, spot detail bookmark, and `/student/saved`), profile (hydrated from `/api/auth/me` into `useProfileStore`, persisted via `PUT /api/users/me`; the OTP verify page re-hydrates it post-sign-in so the greeting works), reviews creation (`POST /api/reviews` from the Add Review dialog), report form reads live `report_options` from `GET /api/report-options`.
- **University admin**: locations CRUD end-to-end, review moderation, dashboard (`GET /api/dashboard/overview` + `GET /api/reviews`), profile saves via `PUT /api/users/me` + `PUT /api/users/me/profile-image`.
- **Super admin**: dashboard (`GET /api/dashboard/overview`), universities list (search/filter/status toggle, `GET /api/universities` which returns `{ locationCount, adminName, adminTitle }` stats), admins list + `[id]` detail (`GET /api/users?role=university-admin`, title split into display), requests list + detail (`GET /api/registration-requests`, approve/reject via `PUT /api/registration-requests/:id/status` — approve returns `temporaryPassword`), locations list + detail (`GET /api/locations`, toggle status, hide/show reviews via `GET /api/reviews/location/:id?includeHidden=true` — now clamped to admin roles server-side), reviews (`GET /api/reviews?status=`), profile via `/api/auth/me` + `PUT /api/users/me`.
- **Registration flow is live end-to-end**: `/university-admin/register` posts to `POST /api/registration-requests` (public; 10/hour submit limiter). The password field was removed — approval issues a one-time `temporaryPassword` shown in the approval response; the SA request page shows only the applicant data and note. Approving reuses/creates the university and admin account (temp password returned). Approving a request whose email already belongs to a **student or super-admin** now returns 409 (emails must be globally unique for sign-in to resolve). Re-deciding a decided request → 409.
- **University-admin multi-tenant scoping** (`server/src/lib/scope.ts`, `universityScopeFor`): university-admins are confined to their own university — reviews list (`GET /api/reviews`), review moderation (`PUT /api/reviews/:id/status` → 403 for foreign locations), hidden-review visibility (`includeHidden=true` silently falls back to the public view for foreign locations), locations CRUD, dashboard overview/stats (`/api/dashboard/overview` returns only own-university counts, `pendingApprovals: []`; `/api/dashboard/stats` likewise scoped; super-admins get platform-wide numbers). University-admins with no linked university see zeros/nothing (403 or empty payloads, never platform data). `GET /api/universities` is public but no longer exposes managing-admin names/titles to anonymous callers (super-admins see them; everyone else gets minimal fields).
- Onboarding university picker (`/student/select-university`) fetches active universities from `GET /api/universities` and shows `locationCount`.
- Query keys: `["student","locations"]`, `["student","reviews",id]`, `["location",id]`, `["saved","places"]`, `["ua","locations"]` / `["ua","location",id]` / `["ua","location-reviews",id]` / `["ua","reviews"]` / `["ua","dashboard"]` / `["ua","profile"]`, `["sa","overview"]` / `["sa","universities"]` / `["sa","admins"]` / `["sa","requests"]` / `["sa","locations"]` / `["sa","reviews"]` / `["sa","profile"]`.
- `AuthStoreHydrator` verifies the persisted role against `/api/auth/me` on mount (clears stale roles on 401, tolerates network failures) and hydrates the profile store for students.
- The backend must be running for all authenticated routes; without it the login shows "Unable to reach the SpotWise server…".
- Seed note: the pending Rajarata request uses `dulani.fernando@rjt.ac.lk` (not the student author's email) so approving it cannot shadow a student sign-in.

## Figma
Source of truth: https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI?node-id=7-47
Inspect via Figma MCP before implementing screens. Use exact Figma dummy data.

## Architecture
- Routes: `/student`, `/super-admin`, `/university-admin` (role prefixes).
- Feature folders: `src/features/<role>/` (components, hooks, schemas, types).
- Shared: `src/components/ui`, `src/components/shared`, `src/components/layout`, `src/components/navigation`.

## Rules
- **Always use shadcn/ui components.** Only build a custom component when that particular component does not exist in the shadcn library.
- Server Components by default; `"use client"` only when needed.
- Accessible semantic HTML, keyboard support, focus indicators.
- Responsive (mobile/tablet/desktop). No horizontal overflow.
- Reuse shared components across roles; don't duplicate.
- Never expose secrets or add placeholder creds.

## Visual fidelity
Match Figma dimensions, spacing, typography (Geologica), colors (primary #f97316). Use Figma assets. No invented effects. Compare rendered UI to Figma.

## QA checklist
Lint, typecheck, build, test all routes/interactions, responsive, accessibility, visual QA.

## Recently Implemented Features

> **Note**: entries below are historical. Anything describing mock data files, `useSavedStore`, `useReviewStore`, `useSuperAdminStore`, or in-memory persistence predates the 2026-11 DB migration — all those stores/files are deleted and every screen reads from the API. See "Frontend ↔ API wiring (complete)" above for the current state.

### Super-Admin Mock-Driven Overhaul (all pages interactive)

> **Superseded**: every super-admin page described below was since rewired to the live API (see "Frontend ↔ API wiring (complete)" above). `src/mocks/` and `useSuperAdminStore` are deleted; mentions of mock files, the store, or `saLocationDetails` in the entries below are historical and no longer reflect the code.
- **All super-admin data flows through mocks** — pages read the **`useSuperAdminStore`** (`src/stores/super-admin-store.ts`, Zustand) directly, mirroring the university-admin pattern. The store is **persisted to localStorage** under `spotwise-sa` (version 1, data arrays only), so a registration submitted from `/university-admin/register` still shows up in the super-admin queue after a full page load or tab switch; the action functions stay in code.
- **Expanded mocks** (`src/mocks/data/super-admin.ts`): 6 universities (Moratuwa, Colombo, Peradeniya, Sri Jayewardenepura, Ruhuna active; Jaffna inactive), 5 university admins, 4 registration requests (2 Pending Kelaniya/Rajarata, 1 Approved Sabaragamuwa, 1 Rejected Vocational Technology), 8 locations, 7 comments (varied 1.4–4.9 ratings, one seeded Hidden). `SaLocation` gains `reviews`/`status`; `SaComment` = `Comment & { status: "Visible" | "Hidden" }`. `saDashboard` was removed — dashboard stats are computed from the store.
- **`University.status`** is now `"Active" | "Pending" | "Inactive"` (`src/types/index.ts`) so universities can be deactivated.
- **Approve a request** (`approveRequest`): marks it Approved and spins up a new university **and** admin from the applicant (skips creating a duplicate university if it already exists) — dashboard counts update immediately. **Reject** just marks it Rejected. The detail page (`requests/[id]`) enables Approve/Reject only while Pending, and already-decided requests show a status notice.
- **Every list page**: white `rounded-2xl` search field + orange filter chips (university-admin pattern: selected `bg-orange-500 text-white`, unselected white/border):
  - Universities — search (name/admin) + All/Active/Inactive; activate/deactivate per card via a redesigned **`ShieldCheck`/`ShieldOff` icon** pill (red tint for Deactivate, green for Activate) placed in the last (Admin) row of each card, opening the shared **`AdminConfirmDialog`** (title/description copy for the direction, destructive variant for Deactivate) — used by the other admin roles too.
  - Admins — search (name/email/university) + All/Active/Inactive; activate/deactivate per card via the same **`ShieldCheck`/`ShieldOff` icon** pill in the last (university) row, opening the shared **`AdminConfirmDialog`** (destructive variant for Deactivate). The card's identity row links to **`/super-admin/admins/[id]`** — a detail page mirroring the requests detail layout (back link, identity card with avatar, name and email, "Details" section with University / Email address / Account status rows, and a full-width Activate/Deactivate action with the same confirmation modal).
  - Requests — search + All/Pending/Approved/Rejected (defaults to **Pending**). The list reads the same registration form at `/university-admin/register` as its data source: cards show initials avatar, applicant (`{title} {name}`), email, university, note preview and status pill; search covers title/name/university/email. The detail page renders the full application (identity card + University / Email address / Submitted / Note rows with the applicant's note as a quote block) with soft-tonal Approve (`bg-[#bbf7d0]`, `#14532d` text, `#4ade80` border) and Reject (`bg-[#fecaca]`, `#7f1d1d` text, `#f87171` border) buttons — matching the tonal pill system used for Active/Inactive actions — and a helper line; already-decided requests show a notice. Both actions open the shared **`AdminConfirmDialog`** first ("Approve/Reject registration" copy naming the applicant, university and email/consequences; Reject is the destructive variant), only then performing the store action and redirecting to the confirmation page.
  - Locations — search (name/university/building) + All/Active/Inactive status chips; activate/deactivate per card and on the detail page. Tiles carry the full picture: 80px/96px photo (`saLocationDetails`), name + university · building (MapPin row, links to detail), rating, reviews, an open/closed dot (from `saLocationDetails` hours) and a "Staffed" badge when `staffMonitored`, with the status pill + Activate/Deactivate on the right. **`/super-admin/locations/[id]` is a full desktop detail page** mirroring the student spot screen: header (back link, kicker, name, status pill), then a two-column grid (`xl:grid-cols-[minmax(0,1fr)_450px]`). Main column: hero card (photo + photo-count badge, name, university/building, staff-monitored pill, description), then the shared student components `OperatingHoursCard`, `CurrentStatusSection` (`showReportButton={false}`) and `AmenitiesSection`, plus a "Recent reviews" card rendering this location's `saComments` with Hide/Show moderation (`moderateComment`); Hide opens the shared `AdminConfirmDialog` first ("Hide review", destructive, names the author; Show applies immediately). Sidebar: "Overview" card (44px rating, stars, review count, University/Building/Location ID/Last updated/Staff monitored rows) and "Admin actions" card (tonal red/green full-width Deactivate/Activate button wired to `AdminConfirmDialog`, helper line, and a "View university" link). Detail enrichment lives in **`src/mocks/data/sa-location-details.ts`** (`saLocationDetails` keyed by `sa-loc-*` id — hero image, building, description, hours, metrics, amenities); the persisted store stays minimal. The page reads status from the store, so Deactivate updates header/pill/actions live.
  - Reviews — route renamed to **`/super-admin/reviews`**; nav/sidebar label "Reviews". Search + **All/Visible/Hidden status chips**; Hide/Show moderation via `moderateComment` (hidden reviews render dimmed with a Show button); empty state is vertically centered in the content area (flex-1 root).
  - Dashboard "Recent comments" section is now **"Recent reviews"** and links to `/super-admin/reviews`.
- **Dashboard** is live: 4 stat tiles (Universities, Admins, Pending requests, Locations — computed from the store), a "Pending approvals" section (top pending requests with Review links), and "Recent reviews" (latest visible, with ratings). Both sections link to their full pages and show empty states.
- **Content area bg is `#E2E8F0`** on every super-admin route (`/super-admin/*` — pages, `layout.tsx` outer shells, login, confirmation, profile loader). Dark mode maps it to `#0b1120` via the existing `[data-admin-theme="dark"] .bg-[#E2E8F0]` rule.
- **Full-remaining-width layout**: the layout `<main>` carries only the sidebar offset (`lg:pl-[260px]`) and `pb-4`; **every page owns its inner padding** (`px-4 sm:px-6` — 16px mobile, 24px ≥640px). No double padding between shell and pages; content spans the full width next to the 260px sidebar on desktop.
- **Registration loop wired end-to-end**: `/university-admin/register` is publicly reachable (the university-admin auth guard previously returned `null` for signed-out users, blanking even `/university-admin/login`; login and register are now public, everything else still requires the `university-admin` role). Submitting the form calls `submitRequest(...)` on the super-admin store with `{ title, name, university, email, note }` — the password is never stored — and the request appears as a **Pending** card in `/super-admin/requests` ("Just now") and in the dashboard's pending count. The SA store is persisted to localStorage (`spotwise-sa`) so the queue survives reloads/tab switches.
- Judgment call: universities use **Active/Inactive** (deactivate toggle), not Active/Pending — approvals create Active universities; Pending lives on the Requests page.

### Student Content Area `#E2E8F0` + White Tiles
- Every `/student` route now renders its content area on **`#E2E8F0`**: the `student-shell` in `src/app/student/layout.tsx` (plus the `.student-shell` background in `src/app/globals.css`, which overrides Tailwind's class), every page-level container (`#fbfbfc` / `#f8f9ff` / `bg-white` mains), `student/loading.tsx`, the home rounded content container, and the spot-detail sticky top-bar wash (`rgba(226,232,240,0.9)`).
- All former `#ddd` gray surfaces are now **white**: home search bar, inactive filter chips and spot tiles, Saved cards (flat + outlined variants), review/summary cards, spot-detail amenity tiles, review cards, all top-bar/back icon buttons, the report form back button and status chips, select-university back button and search bar, preference/amenity/dialog cancel buttons, the sign-out trigger, and the shared `MenuContent` popup (`src/components/ui/menu.tsx`).
- Dark mode: `.student-shell` uses `#0b1120`; white tiles flip via the existing `[data-admin-theme="dark"].student-shell .bg-white` → `#111827` rule; `.student-shell.bg-[#E2E8F0]` → `#0b1120`.
- Verified on `:3001` — shell/content compute to `rgb(226,232,240)`, tiles/chips/buttons to white, no console errors. Hover states (`#d0d0d0` / `#d4d4d4`) unchanged.

### Favorite/Save Button Icon Toggle
- **`src/features/student/components/spot-detail/spot-detail-top-bar.tsx`**: the favorite button uses the Saved tab's bookmark icons but the same button shell as the neighbouring top-bar icons:
  - **Container**: the shared `iconButton` — 40×40, `bg-white`, fully rounded, `hover:bg-[#d0d0d0]`, orange focus-visible ring — identical to back/share/ask in both states (no special saved background).
  - **Icon** (`favoriteIcon`, 16×16 in both states): `/assets/saved/bookmark-outline.svg` (dark `#0f172a` outline) when unsaved, `/assets/saved/5cc8f.svg` (filled `#f97316` bookmark) when saved. Both assets share the same 12.83×16 silhouette inside a 16×16 viewBox, so the hollow icon is not visually smaller than the filled one.
  - `aria-label` toggles between "Save this spot" / "Remove from saved spots", `aria-pressed` reflects state, and the `role="status"` region announces "Added to saved places" / "Removed from saved places".
  - State comes from the shared `useSavedStore` keyed by the route slug (`spot.slug`), so saving here adds the spot to `/student/saved` and keeps the same spot's Discover tile filled.

### Discover Tile Bookmark (add/remove saved)
- **`src/features/student/components/discover/spot-bookmark.tsx`**: 32px white circular button at `left:320/top:12` on every "Recommended study spaces" tile, using `/assets/saved/bookmark-outline.svg` when unsaved and `/assets/saved/5cc8f.svg` when saved.
- Clicking it toggles the tile's slug in `useSavedStore` — the place appears at the end of `/student/saved` and the same spot's info-page bookmark reflects the state. `aria-label` is `Save … to saved places` / `Remove … from saved places` and `aria-pressed` exposes the state.
- **`src/app/student/home/page.tsx`**: each tile is now a `relative` wrapper with the `Link` card plus a sibling `SpotBookmark` overlay, so the button is not nested inside the link and does not navigate.
- The two default saved places (Faculty of IT Computer Labs, Faculty of Engineering Halls) render filled on first load, matching the Saved tab.
- **`src/components/shared/spot-card.tsx`** (shared tile, currently unused): keeps the same outline/filled icon assets driven by `location.saved`.

### Share Button (copy link + toast)
- **`src/features/student/components/spot-detail/spot-detail-top-bar.tsx`**: clicking the share icon copies `window.location.href` with `navigator.clipboard.writeText` — no native share sheet — then fires `toast.success("Link copied to clipboard")`; a rejected write fires `toast.error("Unable to copy the link")`. The component no longer takes a `name` prop.
- **`src/app/layout.tsx`**: a single `<Toaster />` from `react-hot-toast` is mounted at `top-center` for every route: dark `#0f172a` background, white 14px text, 12px radius, orange success icon, 2.5s duration, `z-index 9999`.
- `react-hot-toast` is a dependency (`^2.6.1`). Its toasts carry `role="status"` + `aria-live="polite"`, so every result is announced once; the local `aria-live` status regions in the save toggle, saved-card removal and add-review submit were removed to avoid double announcements.

### Toast Notifications
- `<Toaster />` lives once in **`src/app/layout.tsx`**, so toasts survive client-side route changes and appear on every role's screens.
- Policy: `toast.success` for completed, state-changing actions; `toast.error` for validation or read failures, using the same wording as the inline `role="alert"`/error text.
- Student coverage: Discover tile bookmark (`"<name> added/removed from saved places"`), info-page bookmark (`"Added/Removed from saved places"`), share copy (`"Link copied to clipboard"` / `"Unable to copy the link"`), Saved card removal (`"<name> removed from saved places"`), Add Review submit (`"Review submitted for <spot>"`), review Helpful toggle, Profile save (`"Profile updated"`), photo validation/read errors, preference menus (`"<label> set to <value>"`), amenity add/remove (`"<amenity> added/removed"`), sign out (`"Signed out"`), login (`"OTP sent to <email>"`, `"Google sign-in selected"`, `"Enter a valid email address"`), OTP verify/resend, university picker (`"<university> selected"`), details (`"Details saved"`), report confirmation (`"Report submitted"`). The status form itself is a navigation step, so it does not toast.
- Admin coverage: UA comment keep/remove, UA add/edit location (`"Location added"` / `"Location updated"` plus field errors), UA login (`"Signed in"` plus field errors), SA request approve/reject, and UA/SA profile save (`"Profile changes saved"`).

### Onboarding University Selection
- **`src/stores/onboarding-store.ts`**: in-memory `useOnboardingStore` holds the chosen university so the picker and the details step share it.
- **`src/app/student/select-university/page.tsx`**: choosing a university toasts `"<university> selected"`; "Select university" saves the choice and returns to `/student/info`.
- **`src/app/student/info/page.tsx`**: reads `university` from the store (shown in the picker row) and "Start exploring" toasts `"Details saved"` then goes to `/student/home`.

### Review Button ("Add a review") in the Top Bar
- **`src/features/student/components/spot-detail/spot-detail-top-bar.tsx`**: the icon button next to Share (book/pen icon, `aria-label="Add a review"`) is a `<button>` that calls the `onAddReview` prop — it no longer links to `/student/review`.
- **`src/features/student/components/spot-detail/spot-detail-view.tsx`**: owns `reviewOpen` and renders one controlled `<AddReviewDialog spotName={spot.name} open={reviewOpen} onOpenChange={setReviewOpen} showTrigger={false} />`; both the top-bar button and the reviews-section "Add Review" pill open the same modal, so the URL stays on `/student/results/[id]`.
- Closing via Cancel, the close icon, Escape or Submit returns focus to the top-bar button (Base UI restores the previously focused element).

### Add Review Modal
- **`src/features/student/components/spot-detail/reviews-section.tsx`**: `<AddReviewDialog spotName={spotName} />` provides the "Add Review" pill trigger for the modal.
- **`src/features/student/components/spot-detail/spot-detail-view.tsx`**: renders the controlled dialog used by the top-bar review button with `showTrigger={false}`.
- **`src/features/student/components/spot-detail/add-review-dialog.tsx`**: modal form with rating radios, comment textarea, Cancel/Submit buttons; `showTrigger` (default `true`) hides the built-in pill when the dialog is opened from elsewhere.
- **`src/components/ui/dialog.tsx`**: Reusable Base UI dialog primitives (backdrop, popup, title, description, close).

### Profile "Edit info" Modal (Figma node `169:449`)
- **`src/features/student/components/profile/edit-info-dialog.tsx`**: 340×314 dialog (white, `#e2e8f0` border, 16px radius, 20px padding, 16px gap) with orange pencil header, 26×26 close button, Name/Location inputs (12px radius, 16×14 inner padding, black value text) and Cancel (`bg-white`) / Edit (`#f97316`, `0 6px 16px rgba(249,115,22,.25)`) actions.
- **`src/app/student/profile/page.tsx`**: The header card's Edit button is the dialog trigger; saved values update the profile card locally (mock data, no persistence).
- **`src/features/student/schemas/index.ts`**: `editStudentInfoSchema` (Zod) validates name/location before saving.
- Behaviour: focus moves into the dialog, Cancel/Escape discard drafts, Edit saves and closes, invalid input shows an inline `role="alert"` message linked via `aria-describedby`.
- Input values use `text-black`; the profile card's location is a single line with CSS `truncate` (`min-w-0` row/column), so long addresses end in `…` instead of wrapping.
- The profile avatar initials are derived from the displayed name — first + last initial (`Mohamed Ali` → `MA`), first two letters for a single-word name (`Mohamed` → `MO`) — and update when the name is saved. They are marked `aria-hidden` because the full name is shown beside them.

### Profile Photo (mock upload)
- **`src/features/student/components/profile/profile-avatar.tsx`**: shared circular avatar (56px on the profile card) that shows the uploaded photo when present and otherwise falls back to the member's initials on the `#f97316` circle — first + last initial (`Mohamed Ali` → `MA`), first two letters for a single-word name (`Mohamed` → `MO`).
- **`src/features/student/components/profile/edit-info-dialog.tsx`**: below the dialog description there is a photo row — 48px preview avatar, an `#ffdbca` "Upload photo" / "Change photo" button (`ImagePlus`), a `Remove` action that only appears once a draft photo exists, and a `PNG, JPG or WebP, up to 5 MB.` hint linked with `aria-describedby`. A hidden `<input type="file" accept="image/*">` is triggered by the button; the file is read with `FileReader` as a data URL into `draftImage`.
- **`src/features/student/schemas/index.ts`**: `profileImageSchema` validates the file type (`image/*`) and size (≤ `MAX_PROFILE_IMAGE_BYTES` = 5 MB); failures surface in the dialog's `role="alert"` message.
- Draft semantics match the text fields: Cancel/Escape discards a newly picked or removed photo, Edit saves it. Saving passes `{ name, location, image }` to the page, which swaps the initials avatar for the photo; saving with Remove brings the initials back.
- **`src/app/student/profile/page.tsx`**: reads name, location, photo, preferences and amenities straight from `useProfileStore`, so leaving the tab and returning keeps the edits; the image is a base64 data URL held in memory only.
- **`src/stores/profile-store.ts`**: `useProfileStore` holds all editable profile state — name, location, photo, study style, noise level, study type and amenities — so edits survive switching between the Discover / Saved / Profile tabs. It also feeds the Discover header (`src/app/student/home/page.tsx`): when a photo is set it fills the 40px white-bordered avatar (36px content), and with no photo the same 40px ring shows the `ProfileAvatar` monogram — a white 36px disc with the member's initials in `#f97316` at 13px, derived from the profile name (so renaming updates it, e.g. `Sahan Perera` → `SP`). The header link carries `aria-label="Open your profile"`. State is in memory only: a reload returns to the mock profile.
- **`src/stores/saved-store.ts`**: `useSavedStore` holds the ordered `savedSlugs` list (seeded with `faculty-it`, `faculty-engineering` from `DEFAULT_SAVED_SLUGS`) plus `saveLocation`, `removeLocation`, `toggleSaved` and `resetSaved`. It is shared by the Discover tiles, the spot info page and the Saved tab, so a bookmark toggle on one screen updates the other two; a reload restores the two mock saved places.
- The dialog stays within the viewport (382px tall at the default state, max-height + scroll from `DialogContent`) and the page has no horizontal overflow.

### Preference Menus (Figma nodes `174:448`, `174:461`, `174:474`)
- **`src/components/ui/menu.tsx`**: Base UI menu primitives — `Menu`, `MenuTrigger`, `MenuContent` (portal + positioner + popup), `MenuRadioGroup`, `MenuRadioItem`, `MenuRadioItemIndicator`.
- **`src/features/student/components/profile/preference-menu.tsx`**: reusable preference row + dropdown. Popup is 220×132 (`bg-white`, `#e2e8f0` border, 12px radius, 6px padding, 2px gap, `0 8px 24px rgba(0,0,0,.14)` shadow); options are 206×38, selected `#f5f5f7`, 16px orange Lucide check.
- **`src/app/student/profile/page.tsx`**: Study style (`Quiet`/`Focused`/`Social`), Noise level (`Low`/`Medium`/`High`), and Study type (`Individual`/`Group`/`Hybrid`) rows all use the menu; selection updates local state (mock only). Menus open bottom-aligned to their row, 8px offset, and support pointer, keyboard, Escape, and outside-click dismissal.

### Required Amenities Card (Figma node `161:484`)
- **`src/features/student/components/profile/amenities-card.tsx`**: 364×62 white card (`#e2e8f0` border, 16px radius, `0 4 16 rgba(0,0,0,.08)` shadow) whose chips row is `px-16 py-14` with an 8px gap and wraps when more amenities are added.
- Chips: `#f97316`, 18px radius, `pl-14 pr-10 py-8`, 6px gap, 14px Figma icon, 13px/16px Geologica Medium white label.
- Add button: full-width ×32px row below the chips (`#fed7aa` background, 16px radius, 8px padding) with the 11px Figma plus icon centered.
- **`src/mocks/data/student.ts`**: profile amenities are `["Wi-Fi", "Power outlet"]` to match the Figma dummy data.
- **`public/assets/profile/`**: chip icons `b2610.svg` / `ba296.svg` and white `amenity-*-white.svg` variants for added amenities, plus `d4973.svg`, and dark `amenity-*.svg` icons for the white menu (including `amenity-wifi.svg` / `amenity-power-outlet.svg` for re-added chips).

### More Amenities Menu (Figma node `176:453`)
- **`src/components/ui/menu.tsx`**: added a shared `MenuItem` (38px tall, `px-10 py-9`, 8px gap, 8px radius, 14px/20px `#334155`, `#f5f5f7` when highlighted).
- The add button opens a white menu (`#e2e8f0` border, 12px radius, 6px padding, 2px gap, `0 8 24 rgba(0,0,0,.14)` shadow) centered horizontally on the card, listing every amenity that is not currently selected, each with a 16px Figma icon. When every amenity is selected the `+` button is hidden.
- Every chip (including the initial `Wi-Fi` / `Power outlet`) gets a 16px white circular remove button with a `#f97316` Lucide `X`; removing a chip puts that amenity back into the menu, so additions and removals are reversible.
- With no chips selected, the card shows a horizontally centered `role="status"` empty message — "No amenities added yet. Use + to add one." — above the full-width `+` button; removing the last chip moves focus to that `+` button.
- **`src/app/student/profile/page.tsx`**: tracks the selected `amenities` list (initialised from the profile mock); adding appends once, closing the menu and returning focus to the `+` button.

### Sign Out Button (Figma node `148:485`)
- **`src/features/student/components/profile/sign-out-dialog.tsx`**: the bottom action is a 364×39 "Sign out" trigger — white background, `#e5e5e5` border, 10px radius, `px-10 py-6`, 6px gap, 16px `a7c4a.svg` log-out icon, 14px/20px Medium black label.
- Clicking it opens a confirmation dialog that matches the Edit info modal: 340px wide, `#e2e8f0` border, 16px radius, 20px padding, orange `LogOut` header, 26×26 close button, 13px `#64748b` copy, and Cancel (`bg-white`) / Sign out (`#f97316`, orange shadow) actions. Escape or Cancel dismisses and returns focus to the trigger.
- Confirming routes to `/student/login` (mock sign-out; no real auth state).

### Student Bottom Nav (Figma node `341:328`)
- **`src/components/navigation/student-bottom-nav.tsx`**: fixed floating pill — 280×63, centered horizontally, 19px above the viewport bottom (`z-40`), `#f97316`, 50px radius, and the Figma drop shadow. The layout keeps `pb-[90px]` so content can scroll clear of it.
- The selected tab is an 84×49 `rgba(255,255,255,0.22)` pill at `left` 8 / 98 / 188 for Discover / Saved / Profile, matching the Figma variants for each screen.
- Each item stacks its icon and label with a **4px gap**; the label is **Geologica Medium 11px/14px** with `0.33px` tracking in white, so it keeps its 14px line box instead of collapsing onto the icon.
- **Profile & Saved no-scroll exception**: `src/app/student/layout.tsx` omits the layout's `pb-[90px]` for `/student/profile` and `/student/saved`; those pages supply their own `pb-[90px]` inside `min-h-screen`, so at the Figma 412×917 viewport they are exactly one viewport tall (`scrollHeight === clientHeight`) instead of always scrolling 90px. Shorter viewports can still scroll the last 90px to clear the fixed nav. Other routes keep the layout padding.

### Saved Page (Figma node `7:804`)
- **`src/app/student/saved/page.tsx`** matches the Figma absolute layout: 24px side padding, title at `y=64` (20px Geologica Bold, `-0.3px` tracking), **19px** below the title to the first card, and **19px** between cards.
- The card list is driven by `useSavedStore.savedSlugs` through **`src/mocks/data/saved-spots.ts`** (`savedSpotCatalog`): the Figma order is **Faculty of IT Computer Labs** then **Faculty of Engineering Halls**, and places saved from Discover or the info page are appended at the end.
- Card 1 (Faculty of IT Computer Labs): 364×302 at `y=108`, white body with a 160px photo, rounded top corners, a 32px white bookmark at `left:320/top:12`, and the Figma amenities **Computers / Wi-Fi / Power outlets** in a single row.
- Card 2 (Faculty of Engineering Halls): 364×340 at `y=429`, white 1px `#e2e8f0` border with a white content body, and amenities **Wi-Fi / Spacious seating / Power outlets** wrapping onto two rows.
- **`src/features/student/components/saved/saved-place-card.tsx`** renders both Figma variants (`variant: "flat" | "outlined"`) and the same treatment for every new save (160px photo, content `pt-14/pb-16/px-16`, 8px gaps, 14px star, 13px/18px metadata, 28px chips with `px-10 py-6`, 6px icon/text gap, 14px icons, 12px/16px labels).
- The "Auth prompt…" text exists at `y=568` in Figma but is fully covered by card 2, so it is intentionally not rendered on the visible page.

### Saved Card Bookmark Button
- **`src/features/student/components/saved/saved-place-card.tsx`**: renders the 32px white circular bookmark button on each card's photo at `left:320/top:12`, showing the filled orange Figma asset (`5cc8f.svg`).
- **A single click removes that card from the saved list** (`removeLocation(slug)` in `useSavedStore`) — the bookmark is a one-action "remove from saved" button here, not a toggle. The page toasts "… removed from saved places" and moves focus to the next card's bookmark — or to the "Saved places" title (`tabIndex={-1}`) when the list is empty.
- Removing a card also empties the matching Discover tile and info-page bookmark, since they read the same store.
- With every card removed the empty state is centered in the content column (root becomes a flex column so the block fills the space between the title and the nav clearance): a 64px `#ffdbca` circle holding a 28px filled `#f97316` Lucide `Bookmark`, 16px above "No saved places yet." (14px/20px Medium `#334155`).
- The button carries `aria-label="Remove … from saved places"`, an orange focus-visible ring, and the global cursor rule makes it a pointer.
- State is in memory only: a reload restores the two default saved cards.

### Discover Filter Chips (`/student/home`)
- **`src/app/student/home/page.tsx`**: the chip row is a single horizontally scrollable strip (`aria-label="Filters"`, `tabIndex={0}` so keyboard users can scroll it with arrow keys). It spans the full 412px column via `-mx-[24px] px-[24px]`, hides its scrollbar (`[scrollbar-width:none]` + `[&::-webkit-scrollbar]:hidden`), and shows an orange `:focus-visible` outline.
- Chips are rendered from `FILTER_CHIPS`: **Quiet** (active orange), **Seats available**, then every profile amenity — **Wi-Fi, Power outlet, Cafeteria, Printer, Parking, Elevator, Accessible seating**.
- **`src/mocks/data/student.ts`**: canonical `amenityOptions` list (shared by the Discover chips and the profile amenities card/menu), so adding an amenity updates both places.
- Chips are non-interactive mock filters (plain divs); the row scrolls from `scrollLeft 0` to `scrollWidth - clientWidth` (514px at 412 wide) with no page-level horizontal overflow.
- The header greeting is derived from the profile name — `Hey, {first name}!` (the mock default is `Mohamed`, so it reads `Hey, Mohamed!`) — so it updates when the name is edited. It is a single-line `truncate` inside a `min-w-0 flex-1` column with a 12px gap to the 40px avatar, so a long first name ends in `…` instead of wrapping or pushing the avatar.

### Report Current Status (Figma node `25:1187`)
- **`src/app/student/rate/page.tsx`** is a thin server page that renders **`src/features/student/components/report-status/report-status-form.tsx`** with the Figma dummy spot name `Central Library Study Zone`.
- Layout: 412px max-width column, 24px side padding, 32px top offset, 20px gaps, `#E2E8F0` background. Top bar is 46px tall with a 36px white back button (`18c00.svg`), 18px/24px semibold title and 13px/18px `#64748b` spot name.
- Status card: 364px wide, `#e2e8f0` border, 16px radius, `p-[16px] pb-0` (the last row's `py-[14px]` provides the bottom spacing), `0 4 8 rgba(0,0,0,.08)` shadow, `overflow-clip`. Header is "Current status" (15px/20px semibold) with a `border-t` divider below it, and the four rows (`Noise level`, `Crowd level`, `Seats available`, `Wi-Fi`) are wrapped in a `divide-y divide-[#e2e8f0]` container — no per-row borders — using the shared **`status-choice-row.tsx`**.
- Chips are real `<button>`s in a `role="group"` labelled by the row, with `aria-pressed`: 36px tall, 18px radius, `px-14 py-8`, 13px/20px Medium. Active is `#f97316` + white, inactive `bg-white` + `#334155`; defaults match Figma (Quiet / Low / Yes / Strong). Rows wrap the chips below the label on narrow widths.
- Comment card: `#e2e8f0` border, 16px radius, `p-[16px]`. Plain "Comment" header (15px/20px semibold) with an "(optional)" hint (13px `#64748b`), then a 153px textarea (`10px` radius, 12/10 padding, Inter body font, placeholder `Share what others should know…`).
- Actions at the bottom of the column: 48px orange "Review report" button (`df482.svg` arrow, navigates to `/student/review`), 32px white "Cancel" button (`d3eff.svg` X, `router.back()`), and a centered 12px/18px helper line. All controls have orange focus-visible rings.
- **`src/stores/report-store.ts`**: in-memory `useReportStore` holds the draft (`noise`, `crowd`, `seats`, `wifi`, `comment`) seeded from the Figma defaults; the status form writes it on submit and `src/app/student/review/page.tsx` renders those values in its summary rows, so "Review report" reflects the actual choices. Confirming resets the draft.
- **`src/app/student/layout.tsx`**: `/student/rate`, `/student/review` and `/student/result` join the routes that hide the floating student nav, since the report flow is full-screen like Figma.

### Pointer Cursors
- **`src/app/globals.css`**: a base-layer rule gives `button:not(:disabled)`, `[role="button"]`, and menu/option roles (`menuitem`, `menuitemradio`, `menuitemcheckbox`, `option`) `cursor: pointer` while leaving disabled controls on the default cursor. Links already inherit the pointer from the browser.

### Page Loading Indicator
- **`src/components/shared/page-loader.tsx`**: centered, iconed loader — a 64px ring (`#fed7aa` track, `#f97316` arc, `motion-safe:animate-spin`) with a 28px orange Lucide `GraduationCap` in the middle and a 14px `#64748b` "Loading…" label 14px below. The block is always horizontally centered, uses `role="status"` + `aria-live="polite"`, and the spinner/icon are `aria-hidden` so only the label is announced.
- **`src/app/loading.tsx`**: root route fallback, full viewport (`min-h-dvh`, `#fbfbfc` background).
- **`src/app/student/loading.tsx`**: student route fallback rendered inside the 412px frame (`min-h-[calc(100dvh-90px)]`, white background) so the bottom nav stays visible while a page loads.
- The inline `Loading...` blocks on the student profile and the super-admin / university-admin dashboard and profile pages now render `PageLoader` instead, filling the page height so the indicator stays vertically centered.

### University-Admin Locations Tab (`/university-admin/locations`)
- **`src/app/university-admin/locations/page.tsx`**: search field (white `rounded-2xl` row) with **Active / Inactive** filter chips underneath — selected chip is `bg-orange-500 text-white`, the other is `border-slate-200 bg-white text-slate-600` (same visual language as the Reviews tab chips). `aria-pressed` reflects state and the list filters on `location.status`.
- Tiles (80px photo, `rounded-[20px]`, `#e2e8f0` border) show name, building, and a 12px stat row: filled amber `Star` + rating (`tabular-nums`, semibold) and `MessageSquare` + `N reviews`, separated by `gap-4`, each with an `aria-label`.
- Empty state is borderless and background-free, vertically/horizontally centered in the space below the chips (`min-h-[calc(100dvh-280px)]`), with a 64px `#ffdbca` circle holding an orange `MapPin`, "No active/inactive locations", and a helper line.

### All Gates Pass
- `npm run build` — compiles successfully ✅
- `npm run lint` — 0 errors ✅ (67 pre-existing warnings only)
- `npx tsc --noEmit` — typecheck passes ✅

## University-Admin Dark Mode (reuse this pattern)

**Switch + wiring**
- **`src/stores/university-admin-theme-store.ts`** holds `isDark` / `toggleTheme`; the toggle lives on `/university-admin/profile` (Sun/Moon).
- **`src/app/university-admin/layout.tsx`** renders the shell with `className="admin-shell"` and `data-admin-theme={isDark ? "dark" : "light"}`. All theme CSS is in **`src/app/globals.css`** under `[data-admin-theme="dark"]`.

**Two selector shapes (important)**
- In-shell elements use a descendant: `[data-admin-theme="dark"] .bg-white { … }`.
- Portaled surfaces (dialogs/menus render outside the shell) carry the attribute on themselves, so overrides must be self-targeting with **no space**: `[data-admin-theme="dark"].border-[#e2e8f0]`, `[data-admin-theme="dark"].border-orange-200`, `[data-admin-theme="dark"].border-[#fed7aa]`.
- **`src/components/ui/dialog.tsx`** reads `useUniversityAdminThemeStore`, sets `data-admin-theme` plus dark classes directly on `DialogContent` / `DialogTitle` / `DialogDescription`, and darkens the backdrop.

**Palette to reuse for new admin surfaces**

| Light token | Dark value |
|---|---|
| page `bg-[#E2E8F0]` | `#0b1120` |
| `bg-white` cards | `#111827` (`.admin-shell` scope) / `#0f172a` otherwise |
| `#ddd`, `#fafafa`, `#f1f5f9`, `slate-100` | `#1e293b` |
| `slate-200`, `#d4d4d4` | `#334155` |
| borders `#e2e8f0`, `#eef1f5`, `slate-200/100/300` | `#334155` |
| text `#0f172a`, `slate-800/900/950`, `black` | `#f8fafc` |
| text `#334155`, `#475569`, `#64748b`, `slate-500/600` | `#cbd5e1` |
| `#94a3b8`, `slate-400` | unchanged |
| orange text `#f97316`, `orange-600` | `#fb923c`; `#c2410c`/`orange-700` → `#fdba74` |
| soft orange `#fff7ed`, `#fed7aa`, `#ffedd5`, `#ffdbca`, `orange-50` | `#3a2416` (hover `#4a2a17`) |
| orange borders (`#fed7aa`, `orange-100/200`) | `#7c3f1d` |
| cover gradient (`bg-gradient-to-br`) | `linear-gradient(to bottom right, #7c3f1d, #3a2416, #1e293b)` |
| inputs/textarea/select (base) | bg `#172235`, border `#475569`, text `#f8fafc`, placeholder `#94a3b8` |
| `shadow-[0_4px_16px_rgba(0,0,0,…)]` | `0 6px 20px rgb(0 0 0 / 0.28)` |

**Rules when adding UI**
- Never hardcode a light background in an inline `style` for admin pages — inline styles don't theme; use Tailwind classes so a `[data-admin-theme="dark"]` override can reach them.
- Any new hardcoded hex class (`bg-[#…]`, `text-[#…]`, `border-[#…]`) must ship with its `[data-admin-theme="dark"]` counterpart in `globals.css`.
- Dividers/dots inside cards use `bg-[#f1f5f9]` so they flip to `#1e293b` automatically; avoid `bg-[#eef1f5]` dividers.
- Preference rows use `border-t border-slate-100 first:border-t-0` (not `divide-y`) so the first row has no stray line in dark mode.

## Project Routes
| Route | Page |
|---|---|
| `/student/results/[id]` | Spot detail page ✅ |
| `/student/review` | Review submission page |
| `/student/rate` | Rate a location |
| `/student/home` | Home/dashboard |
| `/student/profile` | User profile |
| `/student/saved` | Saved spots |
| `/student/info` | Info page |
| `/student/login` | Login |
| `/student/select-university` | University selection |
| `/student/verify` | Verify account |

## Visual Design Tokens (from Figma)
- **Primary color**: `#f97316` (orange)
- **Background**: `#E2E8F0` (light student content area)
- **Borders**: `#e2e8f0`, `#e5e5e5`
- **Text**: `#0f172a`, `#334155`, `#64748b`, `#515f74`
- **Font**: Geologica
- **Chips**: `#f97316` (active), `bg-white` (inactive)
- **Card**: `bg-white`, border `#e2e8f0`
- **Rating stars**: `#f59e0b` (filled), `#ddd` (outline)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
