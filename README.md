<h1 align="center">
  <img src="./public/assets/welcome/logo.png" alt="SpotWise" width="180" />
  <br />
  SpotWise
</h1>
<p align="center"><strong>Focus starts with the right place.</strong></p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/nextdotjs/ffffff" />
    <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" width="42" height="42" />
  </picture>
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/react" alt="React" width="42" height="42" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/typescript" alt="TypeScript" width="42" height="42" />
  &nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/express/ffffff" />
    <img src="https://cdn.simpleicons.org/express" alt="Express" width="42" height="42" />
  </picture>
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/drizzle" alt="Drizzle ORM" width="42" height="42" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/postgresql" alt="PostgreSQL" width="42" height="42" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/tailwindcss" alt="Tailwind CSS" width="42" height="42" />
  &nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/shadcnui/ffffff" />
    <img src="https://cdn.simpleicons.org/shadcnui" alt="shadcn/ui" width="42" height="42" />
  </picture>
</p>

<p align="center">
  SpotWise is a study-space discovery platform for Sri Lankan university campuses.
  Three role-based portals, one Next.js frontend, one Express + PostgreSQL backend, no mock data.
</p>

---

## 🧭 Contents

- [🧭 Portals](#-portals)
- [✨ What's new](#-whats-new)
- [🗺️ Routes](#️-routes)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech stack](#️-tech-stack)
- [🚀 Setup guide](#-setup-guide)
- [✅ Validation commands](#-validation-commands)
- [🎨 Design system](#-design-system)
- [📱 Responsive behaviour](#-responsive-behaviour)
- [🔐 Security model](#-security-model)
- [⚠️ Known limitations](#️-known-limitations)

---

## 🧭 Portals

| Portal | Role | Purpose |
|------|---|---|
| 🎓 `/student/*` | Student | Discover spots, save them, review them, report their live status |
| 🏫 `/university-admin/*` | University admin | Manage own university's locations, moderate its reviews, edit profile |
| 🛡️ `/super-admin/*` | Super admin | Universities/admins/registration approvals, platform-wide data |

---

## ✨ What's new

### 🌙 Dark mode — single source of truth
- One Zustand theme store persisted to `localStorage` (`spotwise-theme`), shared across student, university-admin and super-admin shells.
- Backdrop, body margin background, cards and inputs all flip between light and dark palettes via `[data-admin-theme="dark"]` in `globals.css`.

### 📲 PWA — installable, offline-ready
- Installable on Android and iOS; maskable icons from the logo; adaptive `theme-color` for `#E2E8F0` (light) and `#0b1120` (dark).
- Service worker precaches the app shell and shows `/offline` with app styling when the network is gone.

### 🎞️ Android-style route transitions
- `RouteTransition` wraps each screen (not the navbars — those use their own spring-based sliding-pill indicator).
- Page enters from the right and exits to the left, mimicking native Android behaviour. `prefers-reduced-motion` is respected.

### 📊 Real "Most searched study spaces"
- `total_views` on `locations` counts **student** detail-page opens only (anonymous/admin traffic ignored) and ties-break on review count. University-admin and super-admin dashboards rank live from this counter.

### 🖼️ Smooth carousel
- Shared `ImageCarousel` powers every photo gallery with a real 700 ms sliding track transition (`cubic-bezier(0.32,0.72,0.24,1)`) and a 5-second auto-advance (paused on hover/focus).

### 🖼️ Curated location photos in the seed
- All 28 seeded locations (20 student catalog spots + 8 platform-wide admin spots) get **five distinct photos each**, rotated by location so neighbouring spots have different hero images.
- The curated pool lives in `server/src/db/seed.ts` and uses these files from `public/assets/`:
  `assets/home/838a8.png`, `assets/select-university/50ace.png`, `assets/home/64a28.png`, `assets/review/96063.png`, `assets/home/26beb.png`.
- The database stores only the URL strings; the PNGs are served statically by Next.js, not by the API. Re-seeding resets any location photo changes back to these defaults.

### ⭐ Integer ratings everywhere
- Removed all half-star / fractional displays. Stars and counts show whole numbers everywhere.

### 🔒 Super admin controls report labels
- The Wifi/noise/crowd/seats option lists that populate the student report form are now read-only for university-admins; writes (POST/PUT/DELETE/move) are super-admin-only.

### 🧹 Strict university isolation
- Every university-admin view (locations, reviews, dashboard stats, hidden-review visibility) is scoped to the admin's own university at the server boundary. UA cannot re-link their account. SA does platform-wide.

---

## 🗺️ Routes

### Public and onboarding

| Route | Purpose |
|---|---|
| `/` | 🏠 Welcome and role selection |
| `/student/login` | ✉️ Student OTP login |
| `/student/verify` | 🔢 OTP verification |
| `/student/select-university` | 🎓 Search and select a university |
| `/student/info` | 🧑‍🎓 Complete onboarding details |
| `/university-admin/register` | 📨 Public university-admin registration request |
| `/university-admin/login` | 🏫 Admin sign in |
| `/super-admin/login` | 🛡️ Super admin sign in |

### Student routes

| Route | Purpose |
|---|---|
| `/student/home` | 🔎 Discover study spaces |
| `/student/results/[id]` | 📍 Spot detail: gallery, status, reviews, actions |
| `/student/saved` | ⭐ Saved spots |
| `/student/profile` | 👤 Profile, preferences, amenities, sign out |
| `/student/rate` | 📝 Report a spot's current status |
| `/student/review` | 📋 Review a pending status report |
| `/student/result` | ✅ Status-report confirmation |

### University Admin routes

| Route | Purpose |
|---|---|
| `/university-admin/dashboard` | 📊 University overview + top searches |
| `/university-admin/locations` | 📍 List own university's locations |
| `/university-admin/locations/new` | ➕ Add a location |
| `/university-admin/locations/[id]` | 👁️ View location (hero carousel, status, reviews) |
| `/university-admin/locations/[id]/edit` | ✏️ Edit a location |
| `/university-admin/locations/preview` | 👀 Registration flow preview (used by `new`) |
| `/university-admin/reviews` | 💬 Moderate reviews (own university only) |
| `/university-admin/settings/options` | 📋 Student report form options (read-only) |
| `/university-admin/profile` | 👤 Admin profile |

### Super Admin routes

| Route | Purpose |
|---|---|
| `/super-admin/dashboard` | 📊 Platform overview |
| `/super-admin/universities` | 🏫 Universities CRUD (create/activate/deactivate) |
| `/super-admin/admins` | 👥 University-admin accounts |
| `/super-admin/admins/[id]` | 👤 Admin detail |
| `/super-admin/requests` | 📥 Registration requests (approve/reject) |
| `/super-admin/requests/[id]` | 📄 Request detail |
| `/super-admin/locations` | 📍 Platform-wide locations |
| `/super-admin/locations/[id]` | 📍 Location detail (carousel, status, reviews) |
| `/super-admin/reviews` | 💬 Platform-wide review moderation |
| `/super-admin/profile` | 👤 Super admin profile |
| `/super-admin/confirmation` | ✅ Confirmation screen |

---

## 🏗️ Architecture

```
.
├── src/                         # Next.js App Router
│   ├── app/                     # Routes, layouts, globals.css, manifest.ts, offline/
│   ├── components/
│   │   ├── navigation/          # StudentBottomNav, AdminStudentNav, SuperAdminNav
│   │   ├── shared/              # ImageCarousel, RouteTransition, ShowMoreReviewsButton, …
│   │   └── ui/                  # shadcn/ui primitives
│   ├── features/                # Feature-scoped components, schemas, types
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # Utilities (time-ago, cn, …)
│   ├── services/                # Typed API clients per role
│   ├── stores/                  # Zustand stores (theme, auth, onboarding)
│   └── types/                   # Shared TypeScript types
├── public/                      # Logo, icons, assets from Figma
└── server/                      # Express + Drizzle + PostgreSQL API
    ├── drizzle/                 # Migrations
    └── src/
        ├── db/                  # Index, schema, seed
        ├── routes/              # Route handlers per resource
        └── middleware/          # Auth, validation, error handling
```

**Request lifecycle**

1. UI calls a typed client in `src/services/*` with TanStack Query.
2. Express route runs: zod-validates input → middleware checks auth/role → Drizzle queries PostgreSQL.
3. Response data is role-scoped or public as appropriate; client gets shaped data; invalidations cascade through TanStack Query caches.

**Security boundary**

- `src/proxy.ts` (Next 16 proxy) redirects unauthenticated users to the correct portal's login — a UX convenience, not the real boundary.
- The real boundary is every `/api/*` route: it uses role/scope middleware and zod validation.
- University-admins cannot read other universities; unit-scope is `req`/`this universityId`.
- Super-admin-only writes; student-only writes; anonymous reads limited to the public catalog (locations list, universities minimal, report options, amenities).
- Sign-out wipes the JWT cookie and all client-side local/sessionStorage plus Cache Storage (service-worker caches).

---

## 🛠️ Tech stack

<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/nextdotjs/ffffff" />
    <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" height="48" />
  </picture>
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/react" alt="React" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/typescript" alt="TypeScript" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/tailwindcss" alt="Tailwind CSS" height="48" />
  &nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/express/ffffff" />
    <img src="https://cdn.simpleicons.org/express" alt="Express" height="48" />
  </picture>
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/postgresql" alt="PostgreSQL" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/drizzle" alt="Drizzle" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/zod" alt="Zod" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/framer" alt="Framer Motion" height="48" />
</p>

| Layer | Technology |
|---|---|
| Framework | Next.js 16.4.6 (App Router), React 19.3, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui + Base UI |
| Client state | Zustand (theme, auth, onboarding) |
| Server state | TanStack Query |
| Animations | Framer Motion (layout/shared-element for tabs) + React ViewTransition + hand-authored CSS |
| Toasts | react-hot-toast |
| Validation | Zod |
| Backend | Node.js + Express 4 |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Auth | JWT httpOnly cookie (sameSite=lax, secure over HTTPS) |
| Fonts | Geologica (UI) + Inter (long-form where needed) |

---

## 🚀 Setup guide

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20.x (or newer; project currently on Node 24) |
| npm | 10.x or newer |
| PostgreSQL | 14 or newer (or Docker `postgres:16`) |

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

Start a local PostgreSQL instance or use Docker:

```bash
docker run --name studyspot-pg -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres:16
```

### 3. Backend environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`. Backend variables:

| Variable | Required | Default / example | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:1234@localhost:5432/studyspot` | PostgreSQL connection string |
| `PORT` | No | `4000` | Express port |
| `JWT_SECRET` | Yes | long random string | Shared HMAC secret used to sign and verify **HS256** tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT lifetime |
| `COOKIE_SECURE` | No | `false` | Set `true` in production (HTTPS-only cookie) |
| `COOKIE_DOMAIN` | No | unset | Cookie domain, e.g. `.example.com` for subdomains |
| `FRONTEND_URL` | No | `http://localhost:3001` | CORS allow-list / redirect origin |
| `SEED_SUPER_ADMIN_PASSWORD` | No | `admin123` | Dev seed password for the super admin |
| `SEED_ADMIN_PASSWORD` | No | `admin123` | Dev seed password for university admins |
| `SEED_STUDENT_PASSWORD` | No | `password123` | Dev seed password fallback (students normally sign in with OTP) |

`NODE_ENV` is set by the npm scripts, not normally placed in `.env`. In non-production it also makes the OTP endpoint return `devCode` so you can sign in without email.

Never commit `server/.env` — `server/.env.example` is the tracked template. For production use a real `JWT_SECRET`, `COOKIE_SECURE=true` and a real `FRONTEND_URL`.

### 4. Create, migrate, seed

```bash
cd server
npm run db:migrate   # applies migrations from server/drizzle/
npm run db:seed      # drops + recreates: 6 universities, 28 locations, ~2,990 reviews, OTP rows, amenities, report options
```

`npm run db:seed` regenerates university and admin IDs every run; use real re-auth after any reset.

### 5. Frontend environment

```bash
# at repository root
cp .env.example .env.local
```

If the file does not exist yet, just create `.env.local` with:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `/api` (same-origin proxy) | Base URL for the typed API client |
| `NODE_ENV` | set by Next.js | `production` enables the service worker; not set in `.env.local` |

### 6. Run dev servers

Two terminals:

```bash
# Terminal 1 — API
cd server
npm run dev
```

```bash
# Terminal 2 — frontend (Next dev, bound to 0.0.0.0 for LAN access)
npm run dev -- -H 0.0.0.0
```

Open http://localhost:3001 (or http://<your-lan-ip>:3001 from another device on the same Wi-Fi).

### 7. Seeded accounts

| Role | Email | Credential |
|---|---|---|
| Super admin | `superadmin@spotwise.lk` | `admin123` |
| University admin (Moratuwa) | `amal.perera@uom.lk` | `admin123` |
| University admin (Colombo) | `kavindi.silva@cmb.ac.lk` | `admin123` |
| University admin (Peradeniya) | `ruwan.fernando@pdn.ac.lk` | `admin123` |
| University admin (Jayewardenepura, *Inactive*) | `dilani.jayasuriya@sjp.ac.lk` | `admin123` |
| Student | `mohamed.25@uom.lk` | OTP — in dev the API returns `devCode` in the request response, surfaced as a toast |

In-app handy tip: request the student OTP endpoint to get a fresh dev code anytime.

```bash
curl -s -X POST http://localhost:4000/api/auth/otp/request \
  -H 'Content-Type: application/json' \
  -d '{"email":"mohamed.25@uom.lk"}'
```

### 8. PWA install test

Build, then start the production server:

```bash
npm run build
npm run start
```

Open in Chrome → DevTools → Application → Manifest / Service Workers and verify installability and the "You're offline" fallback. The same app uses the same `/manifest.webmanifest` for all roles; only the shell chrome (nav) differs.

### 9. Mobile preview (LAN)

1. Note your laptop's LAN IP (`ipconfig`, **Wi-Fi** interface).
2. Run frontend with `-H 0.0.0.0` (see step 6).
3. On the phone open `http://<laptop-ip>:3001` on the same Wi-Fi.

The frontend is configured to proxy `/api/*` to the API over the LAN, so no CORS/cookies gymnastics are needed.

---

## ✅ Validation commands

| Command | What it checks |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (frontend) |
| `npm run build` | Production build |
| `cd server && npx tsc --noEmit` | Backend typecheck |

---

## 🎨 Design system

- Primary orange `#f97316`
- Content background `#E2E8F0` (light) / `#0b1120` (dark)
- Card surface `#FFFFFF` (light) / `#111827` (dark)
- Border `#E2E8F0` / `#334155` (dark)
- Text `#0F172A` · Secondary `#334155` / `#64748B` · Muted `#94A3B8`
- Fonts: Geologica (UI), Inter (long-form where used)
- shadcn/ui + Base UI components throughout

---

## 📱 Responsive behaviour

- `/student/*` and `/university-admin/*` content areas are full-width on mobile, capped at **412px** (centred) on `md+` viewports.
- `/super-admin/*` content is capped at **1280px** (centred) at all breakpoints.
- Bottom navigation (student + UA) is fixed and uses an animated sliding pill indicator; super-admin desktop uses a sidebar, mobile uses a hamburger-driven drawer with the same sliding pill.
- `/` (welcome) fits any viewport; background clipped content has `overflow-y: auto` where fixed heights would otherwise hide controls, and all login/location CTAs remain reachable on small screens.

---

## 🔐 Security model

- JWTs are **HS256** (HMAC-SHA256, symmetric): `jsonwebtoken` signs with `JWT_SECRET` from `server/.env` and the same secret verifies them. There is no RSA key pair. `JWT_EXPIRES_IN` controls the lifetime (default `7d`).
- JWT httpOnly cookie, `sameSite=lax`, 7-day expiry; `Secure` in production.
- Middleware order: `requireAuth` → `requireRole` → handler (zod validation).
- University-admin scope is derived server-side from the admin's `universityId` — no client-reported identity is trusted for visibility.
- Sign-out deletes the cookie (server), wipes `spotwise-auth` (localStorage), `sessionStorage` and Cache Storage; user must re-authenticate on next visit.
- CORS allow-list: `FRONTEND_URL` + localhost + private LAN ranges in dev.
- Admin role changes on `universityId` forbidden for admins — the column is not writable from `PUT /users/me` by `university-admin`/`super-admin` roles (students only).
- Duplicate university names return 409 (`A record with this value already exists`).

---

## ⚠️ Known limitations

- OTP in development returns code in API response; there is no email provider yet.
- Approval flows return a temporary password to the approver — no email delivery.
- Location "current status" is the single most recent student report cached inline.
- `total_views` counts opens per student identity client; repeat opens within 60 seconds are de-duplicated by React Query's default `staleTime`.
- No cross-role chat/messaging; admin talks happen out-of-band.
- Browser support for route transitions depends on the View Transitions API; older browsers silently skip the animation.
