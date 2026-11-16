# SpotWise

> **Focus starts with the right place.**

SpotWise is a study-space discovery application for students and university teams. Students can discover, compare, save, and review study locations, while University Admins and Super Admins manage locations, reviews and registration requests.

The frontend is a Next.js app backed by an Express + PostgreSQL backend. All screens derive their data from the database — there is no mock data in the frontend (see `AGENTS.md` for per-feature details).

## Product Highlights

### Student experience

- Welcome screen with role selection
- University selection with searchable, DB-backed university cards (active universities only, with live location counts)
- Student onboarding form with selected-university state
- Discover page with:
  - All seeded DB locations, searched client-side
  - Search by name, building, faculty, amenity, and description
  - Amenity and status filter chips
  - Result counts and empty states
  - Ratings, review counts, opening hours, amenities, and last-updated metadata
- Spot detail pages with:
  - Location information and image gallery
  - Current status for seats, Wi-Fi, crowd level, and noise
  - Progressive status indicators
  - Reviews and ratings backed by the API
  - Add Review modal with required comments and ratings
  - Save, share, and report actions
- Saved places page synchronized with Discover and detail-page bookmarks via `/api/saved`
- Profile page with:
  - Editable name and location, persisted via `/api/users/me`
  - Profile-photo upload and removal, persisted via `/api/users/me/profile-image`
  - Study-style, noise-level, and study-type preferences persisted to the DB
  - Reversible amenity selection persisted to the DB
  - Sign-out confirmation dialog

### University Admin experience

- Sign-in against the Express API with university-admin credentials
- Dashboard with live stats (locations, average rating, reviews, quiet spaces)
- Location listing, detail, add, edit, and deactivate screens (scoped to your university)
- Review moderation (hide/show)
- Profile editing with photo upload
- Option management screen for controlling student-facing report choice lists

### Super Admin experience

- Platform dashboard (universities, admins, pending requests, locations, reviews)
- University management
- University-admin management
- Registration-request review flow (approve issues a one-time temporary password)
- Platform-wide locations and reviews
- Profile and confirmation screens

## Routes

### Public and onboarding routes

| Route | Purpose |
|---|---|
| `/` | Welcome and role selection |
| `/student/login` | Student OTP login |
| `/student/verify` | OTP verification screen |
| `/student/select-university` | Search and select a university |
| `/student/info` | Complete student onboarding details |
| `/university-admin/register` | Public university-admin registration request |

### Student routes

| Route | Purpose |
|---|---|
| `/student/home` | Discover study spaces |
| `/student/results/[id]` | Spot details, status, reviews, and actions |
| `/student/saved` | Saved study places |
| `/student/profile` | Profile, preferences, amenities, and sign out |
| `/student/rate` | Report a spot's current status |
| `/student/review` | Review a pending status report |
| `/student/result` | Status-report confirmation |

### University Admin routes

| Route | Purpose |
|---|---|
| `/university-admin/login` | Admin login |
| `/university-admin/dashboard` | University overview |
| `/university-admin/locations` | Manage university locations |
| `/university-admin/locations/new` | Add a location |
| `/university-admin/locations/[id]` | View location details |
| `/university-admin/locations/[id]/edit` | Edit a location |
| `/university-admin/reviews` | Moderate reviews |
| `/university-admin/settings/options` | Manage student-facing report choice lists |
| `/university-admin/profile` | Admin profile |

### Super Admin routes

| Route | Purpose |
|---|---|
| `/super-admin/dashboard` | Platform overview |
| `/super-admin/universities` | Manage universities |
| `/super-admin/admins` | Manage university admins |
| `/super-admin/admins/[id]` | University-admin detail |
| `/super-admin/requests` | Review registration requests |
| `/super-admin/requests/[id]` | View request details |
| `/super-admin/locations` | Platform-wide locations |
| `/super-admin/locations/[id]` | Location detail and review moderation |
| `/super-admin/reviews` | Platform-wide review moderation |
| `/super-admin/profile` | Super Admin profile |
| `/super-admin/confirmation` | Approval/rejection confirmation state |

## Tech Stack

- **Next.js 16** — App Router and route-based page structure
- **React 19** — UI components and client interactions
- **TypeScript** — type-safe application code
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui and Base UI** — reusable accessible primitives
- **Lucide React** — interface icons
- **Zustand** — shared client state (auth session, profile cache, report draft, onboarding)
- **TanStack Query** — server-state fetching and cache invalidation
- **Zod** — form validation
- **react-hot-toast** — action feedback
- **Express + Drizzle + PostgreSQL** — backend API (`server/`)
- **Geologica and Inter** — interface typography

## Getting Started

### Requirements

- Node.js compatible with the project's Next.js 16 setup
- npm
- PostgreSQL (for the backend)

### Install dependencies

```bash
npm install
cd server && npm install
```

### Backend (Express + PostgreSQL + Drizzle)

```bash
cd server
npm run db:create   # creates the `studyspot` database (once)
npm run db:migrate  # applies migrations from drizzle/
npm run db:seed     # seeds universities, admins, locations, reviews, requests, OTPs
npm run dev         # API on http://localhost:4000 (all routes under /api/*)
```

Seeded credentials: `superadmin@spotwise.lk` / `admin123`, `amal.perera@uom.lk` / `admin123`, student `mohamed.25@uom.lk` (sign in via the email OTP screen — in development the API returns `devCode` in the response, shown as a toast since no email provider is configured yet). The frontend expects the backend at `http://localhost:4000/api` (set `NEXT_PUBLIC_API_URL` in `.env.local` to override).

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in a browser. The backend must be running for authenticated routes.

### Run a production build locally

```bash
npm run build
npm run start
```

## Validation Commands

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run TypeScript without emitting files |
| `npm run build` | Create a production build |
| `cd server && npx tsc --noEmit` | Backend typecheck |

## Project Structure

```text
src/
├── app/                         # Next.js App Router routes
│   ├── student/                 # Student onboarding and product flows
│   ├── university-admin/        # University Admin screens
│   └── super-admin/             # Super Admin screens
├── components/
│   ├── navigation/              # Role navigation
│   ├── shared/                  # Shared application components
│   └── ui/                      # Reusable UI primitives
├── features/
│   ├── student/                 # Student components, schemas, and types
│   └── university-admin/        # University Admin components
├── hooks/                       # Shared hooks (e.g. use-saved-places)
├── lib/                         # Utilities and shared helpers
├── services/                    # Typed API clients (student, university-admin, super-admin)
├── stores/                      # Zustand stores
└── types/                       # Shared TypeScript types

public/assets/                   # Local Figma exports and image assets
docs/                            # Research, specifications, and plans
server/                          # Express + Drizzle + PostgreSQL backend
```

## Design System

The primary visual language follows the SpotWise Figma file:

- Primary orange: `#f97316`
- Content background: `#E2E8F0`
- Card border: `#e2e8f0`
- Primary text: `#0f172a`
- Secondary text: `#334155`
- Muted text: `#64748b`
- Filled rating stars: `#f59e0b`
- Font: Geologica for product UI, Inter where required for form body text

Design source: [SpotWise UI in Figma](https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI)

## Scope and Limitations

- No email provider yet — OTP delivery is simulated in development (`devCode` returned by the API and shown in the UI)
- Registration approval issues a one-time temporary password shown to the approver; no email delivery of credentials yet
- No live campus occupancy or Wi-Fi sensors — "current status" is the latest student report, cached inline on each location
- Photos are stored as data URLs in the database (no object storage)
- External integrations and production secrets are not required

## Project Status

SpotWise is a private project focused on the SpotWise product for Sri Lankan university campuses.

---

Made for better study spaces.
