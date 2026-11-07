# SpotWise 📍

> **Focus starts with the right place.**

SpotWise is a frontend-only study-space discovery application for students and university teams. Students can discover, compare, save, and review study locations, while University Admins and Super Admins can explore mock management dashboards.

The interface is built from the SpotWise Figma design and currently uses local mock data. It is intended for UI development, interaction testing, and product demonstrations—not production authentication or live campus availability.

## ✨ Product Highlights

### 🎓 Student experience

- Welcome screen with role selection
- University selection with searchable university cards
- Student onboarding form with selected-university state
- Discover page with:
  - 20 catalog-driven study spots
  - Search by name, category, area, and description
  - Amenity and status filter chips
  - Result counts and empty states
  - Spot-specific local images
  - Ratings, review counts, opening hours, amenities, and last-updated metadata
- Spot detail pages with:
  - Location information and image gallery
  - Current status for seats, Wi-Fi, and crowd level
  - Progressive status indicators
  - Seeded mock reviews
  - Add Review modal with required comments and ratings
  - Save, share, and report actions
- Saved places page synchronized with Discover and detail-page bookmarks
- Profile page with:
  - Editable name and location
  - Mock profile-photo upload and removal
  - Study-style, noise-level, and study-type preferences
  - Reversible amenity selection
  - Sign-out confirmation dialog

### 🏫 University Admin experience

- Mock sign-in flow with university-admin credentials
- Login page includes a back-to-welcome navigation option for returning to the first page
- Dashboard summary cards
- Location listing, detail, add, and edit screens
- Comment moderation actions
- Profile editing
- Option management screen for controlling student-facing filter and choice lists

### 🛡️ Super Admin experience

- Platform dashboard
- University management
- University-admin management
- Registration-request review flow
- Platform-wide locations and comments
- Profile and confirmation screens

## 🧭 Routes

### Public and onboarding routes

| Route | Purpose |
|---|---|
| `/` | Welcome and role selection |
| `/student/login` | Student mock login |
| `/student/verify` | OTP verification screen |
| `/student/select-university` | Search and select a university |
| `/student/info` | Complete student onboarding details |

### Student routes

| Route | Purpose |
|---|---|
| `/student/home` | Discover study spaces |
| `/student/results/[id]` | Spot details, status, reviews, and actions |
| `/student/saved` | Saved study places |
| `/student/profile` | Profile, preferences, amenities, and sign out |
| `/student/rate` | Report a spot’s current status |
| `/student/review` | Review a pending status report |
| `/student/result` | Status-report confirmation |

### University Admin routes

| Route | Purpose |
|---|---|
| `/university-admin/login` | Mock admin login |
| `/university-admin/dashboard` | University overview |
| `/university-admin/locations` | Manage university locations |
| `/university-admin/locations/new` | Add a location |
| `/university-admin/locations/[id]` | View location details |
| `/university-admin/locations/[id]/edit` | Edit a location |
| `/university-admin/comments` | Moderate comments |
| `/university-admin/profile` | Admin profile |

### Super Admin routes

| Route | Purpose |
|---|---|
| `/super-admin/dashboard` | Platform overview |
| `/super-admin/universities` | Manage universities |
| `/super-admin/admins` | Manage university admins |
| `/super-admin/requests` | Review registration requests |
| `/super-admin/requests/[id]` | View request details |
| `/super-admin/locations` | Platform-wide locations |
| `/super-admin/comments` | Platform-wide comment moderation |
| `/super-admin/profile` | Super Admin profile |
| `/super-admin/confirmation` | Confirmation state |

## 📊 Mock Status Model

Every study spot has a combination of the following status values:

- **Seats available:** `Yes`, `No`, `Unsure`
- **Wi-Fi strength:** `Strong`, `Medium`, `Weak`
- **Crowd level:** `Low`, `Medium`, `High`

The detail-page status bars are filled progressively from these values. Each catalog entry also includes a varied rating, review count, amenities, hours, description, images, source URL, and last-updated timestamp.

## 🔍 Discover Filtering

Discover filtering is client-side and combines search with one selected filter chip:

- Search matches the spot name, category, area, or description.
- **Quiet** matches quiet or silent study spaces.
- **Seats available** matches spots whose seat status is `Yes`.
- Amenity filters match normalized amenity names.
- Clicking the active chip clears the filter.
- No chip is selected by default.
- The filter row is keyboard accessible and horizontally scrollable on narrow screens.

## 💬 Reviews and Notifications

- Spot reviews are seeded from mock catalog data.
- Submitted reviews are stored in memory by spot slug.
- Review comments are mandatory and whitespace-only comments are rejected.
- Ratings begin unselected and must be chosen before submission.
- Successful actions close the Add Review modal when appropriate.
- Toast notifications provide feedback for saves, reviews, profile changes, reports, and validation results.
- Only one toast is visible at a time; a newer notification replaces older ones.

## 🧠 State and Data

The app uses lightweight client-side state:

- `useSavedStore` — saved spot slugs shared across Discover, Saved, and detail pages
- `useProfileStore` — profile fields, photo, preferences, and amenities
- `useReviewStore` — submitted reviews grouped by spot slug
- `useReportStore` — current-status report draft
- `useOnboardingStore` — selected university during onboarding
- `useAuthStore` — mock selected role/auth flow

The canonical study-space catalog lives in:

```text
src/mocks/data/study-spots.ts
```

Detail-page data is derived from that catalog so Discover cards, Saved cards, and spot detail pages stay consistent.

## 🛠️ Tech Stack

- **Next.js 16** — App Router and route-based page structure
- **React 19** — UI components and client interactions
- **TypeScript** — type-safe application code
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui and Base UI** — reusable accessible primitives
- **Lucide React** — interface icons
- **Zustand** — shared client state
- **TanStack Query** — mock service/query patterns
- **Zod** — form validation
- **react-hot-toast** — action feedback
- **Geologica and Inter** — interface typography

## 🚀 Getting Started

### Requirements

- Node.js compatible with the project’s Next.js 16 setup
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Run a production build locally

```bash
npm run build
npm run start
```

## ✅ Validation Commands

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run build` | Create a production build |

## 🗂️ Project Structure

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
│   └── student/                 # Student components, schemas, and types
├── mocks/data/                  # Catalogs and seeded mock data
├── services/                    # Mock service abstractions
├── stores/                      # Zustand stores
└── types/                       # Shared TypeScript types

public/assets/                   # Local Figma exports and image assets
docs/                            # Research, specifications, and plans
```

## 🎨 Design System

The primary visual language follows the SpotWise Figma file:

- Primary orange: `#f97316`
- Page background: `#fbfbfc`
- Card border: `#e2e8f0`
- Primary text: `#0f172a`
- Secondary text: `#334155`
- Muted text: `#64748b`
- Inactive chips: `#dddddd`
- Filled rating stars: `#f59e0b`
- Font: Geologica for product UI, Inter where required for form body text

Design source: [SpotWise UI in Figma](https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI)

## ⚠️ Scope and Limitations

This repository intentionally contains a frontend-only mock implementation:

- No backend API
- No database
- No Supabase, Drizzle, or server persistence
- No real authentication or authorization
- No live campus occupancy or Wi-Fi data
- Profile photos, saved spots, preferences, reviews, and reports reset when the page is reloaded
- External integrations and production secrets are not required

## 📌 Development Notes

- Server Components are preferred; client components are used only for interactive state.
- Keep shared UI in `src/components/` and role-specific UI in `src/features/`.
- Add new study spots to the central catalog rather than duplicating data in individual pages.
- Use local assets from `public/assets/` for predictable image rendering.
- Preserve accessible labels, keyboard interaction, focus indicators, and semantic controls when extending the UI.

## 🔒 Project Status

SpotWise is a private project and is currently focused on frontend prototyping and visual validation.

---

Made for better study spaces. 🧡
