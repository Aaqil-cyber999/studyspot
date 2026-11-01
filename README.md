# SpotWise

**Focus starts with the right place.**

SpotWise is a frontend-only web application that helps students find, assess, and review study spaces on campus. It also provides dashboards for University Admins and Super Admins to manage locations, comments, and platform-wide data.

## Features

- **Student**
  - Welcome / role selection
  - Choose & select university
  - Home with recommended study spaces
  - Search & filter results
  - Rate & comment on locations
  - Review submission & result
  - Saved places
  - Profile with study preferences
- **University Admin**
  - Dashboard with stats
  - Login
  - Locations list, details, add/edit
  - Comments & ratings with moderation dialog
  - Profile
- **Super Admin**
  - Platform dashboard
  - Universities management
  - University admins management
  - Registration requests & details
  - Locations & comments (platform-wide)
  - Profile & confirmation states

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Lucide React icons
- Zustand (client state)
- TanStack Query (server state / mock data)
- Zod (validation)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (Webpack mode) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |

## Project Structure

```
src/
  app/              # Next.js App Router pages
    student/
    university-admin/
    super-admin/
  components/       # Shared UI, layout, navigation
  features/         # Role-specific feature modules
  mocks/data/       # Dummy data
  services/         # Service abstractions (mock)
  stores/           # Zustand stores
  types/            # Shared types
public/assets/      # Figma assets
```

## Scope

This is a **frontend-only** implementation using mock data. No backend, database, or real authentication is included. The Figma file is the design source of truth.

## Design Source

Figma: https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI

## License

Private project.