# SpotWise Frontend — Agent Instructions

## Stack
Next.js 16 (App Router) + TypeScript, Tailwind CSS 4, shadcn/ui, Lucide React, Zustand, TanStack Query, Zod.

## Commands
- dev: `npm run dev`
- lint: `npm run lint`
- typecheck: `npx tsc --noEmit`
- build: `npm run build`

## Figma
Source of truth: https://www.figma.com/design/epLSve0mD6JRLEuoHnSFZ3/SpotWise-UI?node-id=7-47
Inspect via Figma MCP before implementing screens. Use exact Figma dummy data.

## Architecture
- Routes: `/student`, `/super-admin`, `/university-admin` (role prefixes).
- Feature folders: `src/features/<role>/` (components, hooks, schemas, types).
- Shared: `src/components/ui`, `src/components/shared`, `src/components/layout`, `src/components/navigation`.

## Rules
- Server Components by default; `"use client"` only when needed.
- Accessible semantic HTML, keyboard support, focus indicators.
- Responsive (mobile/tablet/desktop). No horizontal overflow.
- Reuse shared components across roles; don't duplicate.
- Never expose secrets or add placeholder creds.

## Visual fidelity
Match Figma dimensions, spacing, typography (Geologica), colors (primary #f97316). Use Figma assets. No invented effects. Compare rendered UI to Figma.

## QA checklist
Lint, typecheck, build, test all routes/interactions, responsive, accessibility, visual QA.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
