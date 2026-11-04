# SpotWise Frontend — Agent Instructions (Updated)

## Scope
Frontend only, mock data. No backend, Supabase, Drizzle, or real auth.

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
- Mock data: `src/mocks/data/`. Services: `src/services/`. State: `src/stores/`.

## Rules
- Server Components by default; `"use client"` only when needed.
- No `any`. Zod for forms. TanStack Query for async mock data; Zustand only shared client state.
- Accessible semantic HTML, keyboard support, focus indicators.
- Responsive (mobile/tablet/desktop). No horizontal overflow.
- Reuse shared components across roles; don't duplicate.
- Never expose secrets or add placeholder creds.

## Visual fidelity
Match Figma dimensions, spacing, typography (Geologica), colors (primary #f97316). Use Figma assets. No invented effects. Compare rendered UI to Figma.

## QA checklist
Lint, typecheck, build, test all routes/interactions, responsive, accessibility, visual QA.

## Recently Implemented Features

### Favorite/Save Button Icon Toggle
- **`src/features/student/components/spot-detail/spot-detail-top-bar.tsx`**: the favorite button uses the Saved tab's bookmark icons but the same button shell as the neighbouring top-bar icons:
  - **Container**: the shared `iconButton` — 40×40, `#ddd`, fully rounded, `hover:bg-[#d0d0d0]`, orange focus-visible ring — identical to back/share/ask in both states (no special saved background).
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
- Student coverage: Discover tile bookmark (`"<name> added/removed from saved places"`), info-page bookmark (`"Added/Removed from saved places"`), share copy (`"Link copied to clipboard"` / `"Unable to copy the link"`), Saved card removal (`"<name> removed from saved places"`), Add Review submit (`"Review submitted for <spot>"`), review Helpful toggle, Profile save (`"Profile updated"`), photo validation/read errors, preference menus (`"<label> set to <value>"`), amenity add/remove (`"<amenity> added/removed"`), sign out (`"Signed out"`), login (`"OTP sent to <email>"`, `"Google sign-in selected"`, `"Enter a valid email address"`), OTP verify/resend, university picker (`"<university> selected"`), details (`"Details saved"`), current-status report (`"Status report submitted"`), report confirmation (`"Report submitted"`).
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
- **`src/features/student/components/profile/edit-info-dialog.tsx`**: 340×314 dialog (white, `#e2e8f0` border, 16px radius, 20px padding, 16px gap) with orange pencil header, 26×26 close button, Name/Location inputs (12px radius, 16×14 inner padding, black value text) and Cancel (`#ddd`) / Edit (`#f97316`, `0 6px 16px rgba(249,115,22,.25)`) actions.
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
- **`src/features/student/components/profile/preference-menu.tsx`**: reusable preference row + dropdown. Popup is 220×132 (`bg-[#ddd]`, `#e2e8f0` border, 12px radius, 6px padding, 2px gap, `0 8px 24px rgba(0,0,0,.14)` shadow); options are 206×38, selected `#f5f5f7`, 16px orange Lucide check.
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
- **`src/features/student/components/profile/sign-out-dialog.tsx`**: the bottom action is a 364×39 "Sign out" trigger — `#ddd` background, `#e5e5e5` border, 10px radius, `px-10 py-6`, 6px gap, 16px `a7c4a.svg` log-out icon, 14px/20px Medium black label.
- Clicking it opens a confirmation dialog that matches the Edit info modal: 340px wide, `#e2e8f0` border, 16px radius, 20px padding, orange `LogOut` header, 26×26 close button, 13px `#64748b` copy, and Cancel (`#ddd`) / Sign out (`#f97316`, orange shadow) actions. Escape or Cancel dismisses and returns focus to the trigger.
- Confirming routes to `/student/login` (mock sign-out; no real auth state).

### Student Bottom Nav (Figma node `341:328`)
- **`src/components/navigation/student-bottom-nav.tsx`**: fixed floating pill — 280×63, centered horizontally, 19px above the viewport bottom (`z-40`), `#f97316`, 50px radius, and the Figma drop shadow. The layout keeps `pb-[90px]` so content can scroll clear of it.
- The selected tab is an 84×49 `rgba(255,255,255,0.22)` pill at `left` 8 / 98 / 188 for Discover / Saved / Profile, matching the Figma variants for each screen.
- Each item stacks its icon and label with a **4px gap**; the label is **Geologica Medium 11px/14px** with `0.33px` tracking in white, so it keeps its 14px line box instead of collapsing onto the icon.
- **Profile & Saved no-scroll exception**: `src/app/student/layout.tsx` omits the layout's `pb-[90px]` for `/student/profile` and `/student/saved`; those pages supply their own `pb-[90px]` inside `min-h-screen`, so at the Figma 412×917 viewport they are exactly one viewport tall (`scrollHeight === clientHeight`) instead of always scrolling 90px. Shorter viewports can still scroll the last 90px to clear the fixed nav. Other routes keep the layout padding.

### Saved Page (Figma node `7:804`)
- **`src/app/student/saved/page.tsx`** matches the Figma absolute layout: 24px side padding, title at `y=64` (20px Geologica Bold, `-0.3px` tracking), **19px** below the title to the first card, and **19px** between cards.
- The card list is driven by `useSavedStore.savedSlugs` through **`src/mocks/data/saved-spots.ts`** (`savedSpotCatalog`): the Figma order is **Faculty of IT Computer Labs** then **Faculty of Engineering Halls**, and places saved from Discover or the info page are appended at the end.
- Card 1 (Faculty of IT Computer Labs): 364×302 at `y=108`, `#ddd` body with a 160px photo, rounded top corners, a 32px white bookmark at `left:320/top:12`, and the Figma amenities **Computers / Wi-Fi / Power outlets** in a single row.
- Card 2 (Faculty of Engineering Halls): 364×340 at `y=429`, white 1px `#e2e8f0` border with a `#ddd` content body, and amenities **Wi-Fi / Spacious seating / Power outlets** wrapping onto two rows.
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

### Pointer Cursors
- **`src/app/globals.css`**: a base-layer rule gives `button:not(:disabled)`, `[role="button"]`, and menu/option roles (`menuitem`, `menuitemradio`, `menuitemcheckbox`, `option`) `cursor: pointer` while leaving disabled controls on the default cursor. Links already inherit the pointer from the browser.

### All Gates Pass
- `npm run build` — compiles successfully ✅
- `npm run lint` — 0 errors ✅ (67 pre-existing warnings only)
- `npx tsc --noEmit` — typecheck passes ✅

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
- **Background**: `#fbfbfc` (light)
- **Borders**: `#e2e8f0`, `#e5e5e5`
- **Text**: `#0f172a`, `#334155`, `#64748b`, `#515f74`
- **Font**: Geologica
- **Chips**: `#f97316` (active), `#ddd` (inactive)
- **Card**: `bg-white`, border `#e2e8f0`
- **Rating stars**: `#f59e0b` (filled), `#ddd` (outline)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
