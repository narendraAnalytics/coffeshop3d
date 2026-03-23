# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # preview production build locally

# Database (Drizzle ORM)
npx drizzle-kit generate   # generate SQL migration from schema changes
npx drizzle-kit push       # push schema directly to Neon (no migration file)
npx drizzle-kit studio     # open Drizzle Studio GUI for the database
```

No test suite is configured.

## Environment Variables

Two `.env` files are required (never committed):
- `DATABASE_URL` — Neon PostgreSQL connection string (used by drizzle-kit CLI)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key

`vite.config.ts` re-exposes `DATABASE_URL` as `import.meta.env.VITE_DATABASE_URL` so the frontend can call Neon directly.

## Architecture

Single-page React 19 + TypeScript app bundled with Vite. `App.tsx` renders five sections vertically: `Navbar → Hero → Menu → About → Contact`. All animation is GSAP-based; Three.js (via React Three Fiber) is used only in the Menu background.

### Authentication — Clerk
`main.tsx` wraps the app in `<ClerkProvider>`. Menu uses `useUser()` and `useClerk()` to gate ordering behind sign-in. The signed-in user's `user.id` (Clerk user ID) is stored in every order row as `clerk_user_id`.

### Database — Neon + Drizzle ORM (`src/db.ts`, `src/schema.ts`)
- **Direct client-side connection**: `getDb()` in `src/db.ts` creates a Drizzle instance over the Neon HTTP serverless driver. There is no API server — components call `getDb()` directly.
- **Schema**: single `orders` table defined in `src/schema.ts`. The `items` column is a JSON string of `[{coffee_name, cost, cups}]`.
- **Types**: `Order` and `NewOrder` are inferred from the schema via `$inferSelect` / `$inferInsert`.
- Migration files live in `drizzle/`. Schema changes → `drizzle-kit generate` → commit the SQL → `drizzle-kit push` to apply.

### Order Flow (`Menu.tsx` → `OrderModal.tsx` / `OrderHistoryModal.tsx`)
- Clicking "Add to Order" opens `OrderModal` (cart + contact fields + Drizzle insert).
- After `onClose`, `Menu.tsx` calls `refreshOrderCheck()` which queries for `LIMIT 1` to set `hasPastOrders`.
- When `hasPastOrders` is true, a second button "View My Orders" appears next to "Add to Order" and opens `OrderHistoryModal`.
- `OrderHistoryModal` fetches all orders for the current user ordered by `desc(createdAt)` and renders them.
- Both modals share the same dark coffee theme: CSS prefix `om-` (OrderModal) and `ohm-` (OrderHistoryModal).

### Hero (`Hero.tsx` + `Hero.css`)
The most complex component. Key design decisions:

- **Frame sequence**: 75 JPEG frames at `public/frames/ezgif-frame-001.jpg … 075.jpg` are preloaded into `imagesRef` and painted to a full-bleed `<canvas>` via `drawImageCover` (object-fit: cover logic).
- **Scroll driver**: A single GSAP `to()` tween on `frameObj.current.frame` (0→74) is pinned for `300vh` with `scrub: 0.5`. Its `onUpdate: render` callback is the single source of truth for scroll progress (0→1).
- **Secondary animations inside the pinned section**: The sidebanner (`sideBannerRef`) is driven entirely inside `render()` via `gsap.quickSetter` and the same `progress` value — not via a separate ScrollTrigger.
- **Audio**: Web Audio API procedural sounds (brown noise roll, Cmaj7 pad, one-shot blast/beans). Audio is lazy-initialised on first scroll (browser autoplay policy). All audio parameters are modulated from `progress` inside `updateAudio()`.
- **GSAP / CSS transform conflict**: Never set CSS `transform` and GSAP `x/y` on the same element — GSAP replaces the entire `transform` property. Use `top: calc(50% - Xvh)` for vertical centering on GSAP-animated elements instead of `translateY(-50%)`.

### Navbar (`Navbar.tsx` + `Navbar.css`)
GSAP ScrollTrigger at `start: 'top -80'` flips the text logo out (Y-axis rotation) and fades in the image logo, which then spins continuously via `requestAnimationFrame`. Links fade to 35% opacity on scroll.

### Menu (`Menu.tsx` + `Menu.css`)
Uses `useGSAP` hook with `{ scope: sectionRef }` (not plain `useEffect`) for scoped ScrollTrigger animations. Background is a Three.js scene (`CoffeeScene`) rendered into an absolutely-positioned Canvas with 25 floating coffee beans using a seeded PRNG for deterministic layout. The card uses GSAP `quickTo` on `rotationX/Y` for 3D mouse-tilt; never add CSS `transform` to `cardInnerRef`. Both order buttons live in `.menu-btn-row` (flex row, `nowrap`).

### Styling conventions
- **Tailwind CSS v4** — configured via `@theme` block in `src/index.css` (no `tailwind.config.js`). Custom tokens: `espresso`, `cream`, `beige`, `terracotta`, `gold`, `dark-warm`.
- **Component CSS files** — every component that has GSAP-animated elements has a companion `.css` file (`Navbar.css`, `Hero.css`, `Menu.css`, `OrderModal.css`, `OrderHistoryModal.css`). Classes follow flat BEM-style naming.
- **Inline styles** — still used in About and Contact only.

### Static assets
- `public/frames/` — 75 JPEG animation frames (served at `/frames/ezgif-frame-NNN.jpg`)
- `images/` (project root) — logo and icon images, imported directly via ES module imports in Navbar
- `public/images/` — runtime images referenced by path string (e.g. sidebanner)
- `public/videos/` — per-coffee MP4 clips used in the Menu carousel
