# SpotWise

> **Focus starts with the right place.**

SpotWise is a study-space discovery platform for Sri Lankan university campuses. Students discover, compare, save, review and report study locations. University admins manage their university's locations and moderate student feedback. Super admins run the whole platform: universities, admins, registration requests, platform-wide locations and reviews.

The system has **three role-based portals** sharing one Next.js frontend and one Express + PostgreSQL backend. There is no mock data — every screen reads live from the database.

## Portals at a glance

| Portal | Role | Purpose |
|---|---|---|
| `/student/*` | Student | Discover spots, save them, review them, report their live status |
| `/university-admin/*` | University admin | Manage own university's locations, moderate its reviews, configure its profile |
| `/super-admin/*` | Super admin | Platform oversight: universities, admins, registration approvals, platform-wide data |

### Student experience
- Welcome screen with role selection
- Email-OTP sign in (no password). In development the API returns a `devCode` which the app surfaces via a toast; no email provider yet.
- Onboarding: pick a university, fill in your name & details
- Discover: search + filter (price, amenities, noise) over the school's own spots — all data DB-backed, including ratings/review counts and last-updated hints
- Spot detail: gallery with a sliding carousel (auto-advance), live current-status (seats / Wi-Fi / crowd / noise) from the latest student report, amenities, reviews with pagination ("Show more reviews" button, infinite scroll, native `loading="lazy"` avatars), save/bookmark, report a status with a comment
- Saved places, profile (name/photo, study preferences, amenities), sign in/out

### University Admin experience
- Password sign in
- Dashboard with live stats: locations, average rating, reviews, quiet spaces, **most searched study spaces** (real `total_views` counter incremented on each student spot-detail open, ties broken by review count), top recent reviews with avatars
- Locations CRUD (photo gallery, hours, amenities, staff monitoring, deactivate/delete), scoped to the admin's own university
- Reviews moderation, scoped to the admin's own university, with lazy-loading
- Profile editing with photo and title
- Report options screen (**read-only** — student-facing option labels are owned by super admins)

### Super Admin experience
- Platform dashboard: totals, pending approvals, recent reviews
- Universities CRUD: create universities (name + enabled/disabled), activate/deactivate
- Admins: manage university-admin accounts
- Registration requests: review/approve/reject; approving provisions university + admin account and returns a one-time temporary password
- Locations & reviews platform-wide moderation
- Profile: photo, profile photo upload, super-admin specific overview

## Routes

### Public and onboarding

| Route | Purpose |
|---|---|
| `/` | Welcome and role selection |
| `/student/login` | Student OTP login |
| `/student/verify` | OTP verification |
| `/student/select-university` | Search and select a university |
| `/student/info` | Complete onboarding details (first-time login) |
| `/university-admin/register` | Public university-admin registration request |
| `/university-admin/login` | Admin sign-in |
| `/super-admin/login` | Super admin sign-in |

### Student routes

| Route | Purpose |
|---|---|
| `/student/home` | Discover study spaces |
| `/student/results/[id]` | Spot detail: gallery, status, reviews, actions |
| `/student/saved` | Saved spots |
| `/student/profile` | Profile, preferences, amenities, sign out |
| `/student/rate` | Report a spot's current status |
| `/student/review` | Review a pending status report |
| `/student/result` | Status-report confirmation |
| `/student/info` | Onboarding details |

### University Admin routes

| Route | Purpose |
|---|---|
| `/university-admin/dashboard` | University overview + top searches |
| `/university-admin/locations` | List own university's locations |
| `/university-admin/locations/new` | Add a location |
| `/university-admin/locations/[id]` | View location (hero, status, reviews) |
| `/university-admin/locations/[id]/edit` | Edit a location |
| `/university-admin/locations/preview` | Registration flow preview (used by `new`) |
| `/university-admin/reviews` | Moderate reviews (own university only) |
| `/university-admin/settings/options` | Student report form options (read-only) |
| `/university-admin/profile` | Profile + photo + theme toggle |

### Super Admin routes

| Route | Purpose |
|---|---|
| `/super-admin/dashboard` | Platform overview |
| `/super-admin/universities` | Universities CRUD (create/activate/deactivate + create flow) |
| `/super-admin/admins` | University-admin accounts |
| `/super-admin/admins/[id]` | Admin detail |
| `/super-admin/requests` | Registration requests (approve/reject) |
| `/super-admin/requests/[id]` | Request detail |
| `/super-admin/locations` | Platform-wide locations |
| `/super-admin/locations/[id]` | Location detail (hero carousel, status, reviews moderation) |
| `/super-admin/reviews` | Platform-wide moderation |
| `/super-admin/profile` | Profile + theme toggle |
| `/super-admin/confirmation` | Approval/rejection confirmation page |

## Architecture

```
.
├── src/                         # Next.js App Router
│   ├── app/                     # Routes
│   ├── components/
│   │   ├── navigation/          # Role navigation
│   │   ├── shared/              # Cross-role components
│   │   └── ui/                  # shadcn/ui primitives
│   ├── features/                # Feature-scoped components/schemas/types
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # Utilities (e.g. timeAgo)
│   ├── services/                # Typed API clients (per role)
│   ├── stores/                  # Zustand stores
│   └── types/                   # Shared TypeScript types
├── public/assets/               # Static assets (Figma exports)
└── server/                      # Express + Drizzle + PostgreSQL API
```

**Request lifecycle**
1. UI calls a typed client in `src/services/*` with TanStack Query
2. Express route (zod-validated) with optional-auth/required-auth middleware runs
3. Drizzle ORM queries PostgreSQL; successful responses are shaped by role
4. TanStack Query cache keeps the UI consistent; invalidations on writes refresh dependent views

**Security boundary**
- `src/proxy.ts` (Next 16 proxy) routes unauthenticated users to the correct portal's login.
- Every `/api/*` route enforces its own auth + role middleware. The proxy is UX only — the backend is the security boundary.
- University-admins are scoped to their own university on every read/write (locations, reviews, dashboard stats, report visibility). Cross-university writes are forbidden (403).
- Super admins bypass university scoping (platform-wide).
- Report-options writes (student survey labels) are super-admin only.
- `PUT /users/me` refuses role changes to `universityId` for admins (scope comes from that column).
- Unique-form handling: duplicate creates return 409 (`A record with this value already exists`).
- OTP verification refuses existing non-student accounts; approval of requests whose email collides with an existing account returns 409.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui + Base UI |
| Client state | Zustand |
| Server state | TanStack Query |
| Validation | Zod |
| Toasts | react-hot-toast |
| Backend | Node.js + Express 4 |
| ORM | Drizzle ORM |
| DB | PostgreSQL |
| Auth | JWT httpOnly cookie (sameSite=lax), 7-day expiry |
| Fonts | Geologica (UI), Inter (form body where required) |

## Prerequisites

| Tool | Minimum |
|---|---|
| Node.js | 20.x or later (project uses Node 24) |
| npm | 10.x or later |
| PostgreSQL | 14 or later (local instance or Docker) |
| OS | Windows / macOS / Linux |

## Setup guide

### 1. Clone and install

```bash
git clone <repo-url>
cd studyspot

# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
```

### 2. PostgreSQL

Start a PostgreSQL instance and make sure you can connect with a superuser (local dev default is `postgres`).

If you use Docker:

```bash
docker run --name studyspot-pg -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres:16
```

### 3. Backend environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```dotenv
DATABASE_URL=postgresql://postgres:1234@localhost:5432/studyspot
PORT=4000
JWT_SECRET=<generate-a-long-random-string>
JWT_EXPIRES_IN=7d
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
FRONTEND_URL=http://localhost:3001
```

- For production, use a real `JWT_SECRET`, set `COOKIE_SECURE=true`, and restrict `FRONTEND_URL` to your deployed origin.
- The seed script requires that the database exists and is empty (see step 4).

### 4. Create, migrate, and seed the database

```bash
cd server
npm run db:migrate   # applies migrations from server/drizzle/
npm run db:seed      # seeds universities, admins, locations, ~2,990 reviews, OTP rows, etc.
```

`npm run db:seed` is destructive — it drops and recreates data in the configured database. **Never run it against production.**

### 5. Frontend environment

Create `.env.local` at the repository root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 6. Run the app

Terminal 1 (API):
```bash
cd server
npm run dev
```

Terminal 2 (frontend):
```bash
npm run dev
```

Open http://localhost:3001. The backend must be up for authenticated routes.

### Seeded accounts

| Role | Email | Password / OTP |
|---|---|---|
| Super admin | `superadmin@spotwise.lk` | `admin123` |
| University admin – Moratuwa | `amal.perera@uom.lk` | `admin123` |
| University admin – Colombo | `kavindi.silva@cmb.ac.lk` | `admin123` |
| University admin – Peradeniya | `ruwan.fernando@pdn.ac.lk` | `admin123` |
| University admin – Ruhuna | `saman.rathnayake@ruh.ac.lk` | `admin123` |
| University admin – Jayewardenepura (Inactive) | `dilani.jayasuriya@sjp.ac.lk` | `admin123` |
| Student | `mohamed.25@uom.lk` | OTP — in dev the API returns a `devCode` in the request response, surfaced as a toast |

Registration requests live in the super-admin queue:
- `dulani.fernando@rjt.ac.lk` — Pending (Rajarata)
- `thilina.wek@kel.ac.lk` — Pending (Kelaniya)
- `s.peris@sra.ac.lk` — Rejected
- `j.kaduwela@rjt.ac.lk` — Approved (Sabaragamuwa)

To get a fresh dev code for the student account, trigger the OTP request endpoint:

```bash
curl -X POST http://localhost:4000/api/auth/otp/request \
  -H 'Content-Type: application/json' \
  -d '{"email":"mohamed.25@uom.lk"}'
```

The response JSON contains `devCode`. The student login screen will show it as a toast automatically.

## Validation commands

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run build` | Production build |
| `cd server && npx tsc --noEmit` | Backend typecheck |

## Common tasks

### Add or change a report-options value
Edit `server/drizzle/seed.ts` (required for fresh databases) or use the API:
- `GET /api/report-options` (public)
- Mutations are super-admin only (`POST`/`PUT`/`DELETE`, and `POST /:id/move` to reorder).

### Re-seed a local database
```bash
cd server
npm run db:migrate
npm run db:seed
```

### Add a new migration
After changing `server/src/db/schema.ts`:
```bash
cd server
npx drizzle-kit generate   # writes a new file into server/drizzle/
npm run db:migrate
```

## Design system

- Primary orange `#f97316`
- Content background `#E2E8F0` (light) / `#0b1120` (dark)
- Card border `#e2e8f0` / `#334155` (dark)
- Text: `#0f172a` (primary), `#334155` / `#64748b` (secondary), `#94a3b8` (muted)
- Fonts: Geologica (product UI), Inter (form body where required)
- Ratings are shown as integers (\*\*no 3.8-style fractional stars — round to nearest int\*\*)
- Dark theme: toggled per user, persisted in `localStorage` (`spotwise-theme`) and applied via `data-admin-theme="dark"` on `<body>` + shell elements; all overrides live in `src/app/globals.css`

Figma source: [SpotWise UI](https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI)

## Known limitations

- OTP delivery is in-memory and dev-only — no production email provider yet
- Registration approvals return a temporary password to the approver (no email delivery yet)
- Location "current status" is cached inline on the row and reflects the latest student report only
- Reviews and profile photos are stored as inline rows/data URLs (no object storage)
- `total_views` counts spot detail opens (no deduplication, not per-day — adequate for phase-1 popularity ordering)
- The student onboarding preserves selection for subsequent sign-ins on the same device (localStorage), not yet for cross-device sign-ins

## Scope, licensing and privacy

SpotWise is a private project. Do not share or redistribute without permission. Photos and avatars are seed/example assets; real user uploads are not intended for public redistribution.
