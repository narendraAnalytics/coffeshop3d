# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # preview production build locally
```

No test suite is configured.

## Architecture

Single-page React 19 + TypeScript app bundled with Vite. `App.tsx` renders five sections vertically: `Navbar → Hero → Menu → About → Contact`. All animation is GSAP-based; Three.js (via React Three Fiber) is used only in the Menu background.

### Hero (`Hero.tsx` + `Hero.css`)
The most complex component. Key design decisions:

- **Frame sequence**: 75 JPEG frames at `public/frames/ezgif-frame-001.jpg … 075.jpg` are preloaded into `imagesRef` and painted to a full-bleed `<canvas>` via `drawImageCover` (object-fit: cover logic).
- **Scroll driver**: A single GSAP `to()` tween on `frameObj.current.frame` (0→74) is pinned for `300vh` with `scrub: 0.5`. Its `onUpdate: render` callback is the single source of truth for scroll progress (0→1).
- **Secondary animations inside the pinned section**: A separate `ScrollTrigger` on a pinned section fires at wrong document positions. The sidebanner (`sideBannerRef`) is therefore driven entirely inside `render()` via `gsap.quickSetter` and the same `progress` value — not via a separate ScrollTrigger.
- **Audio**: Web Audio API procedural sounds (brown noise roll, Cmaj7 pad, one-shot blast/beans). Audio is lazy-initialised on first scroll (browser autoplay policy). All audio parameters are modulated from `progress` inside `updateAudio()`.
- **GSAP / CSS transform conflict**: Never set CSS `transform` and GSAP `x/y` on the same element — GSAP replaces the entire `transform` property. Use `top: calc(50% - Xvh)` for vertical centering on GSAP-animated elements instead of `translateY(-50%)`.

### Navbar (`Navbar.tsx` + `Navbar.css`)
GSAP ScrollTrigger at `start: 'top -80'` flips the text logo out (Y-axis rotation) and fades in the image logo, which then spins continuously via `requestAnimationFrame`. Links fade to 35% opacity on scroll.

### Menu (`Menu.tsx`)
Uses `useGSAP` hook with `{ scope: sectionRef }` (not plain `useEffect`) for scoped ScrollTrigger animations. Background is a Three.js scene (`CoffeeScene`) rendered into an absolutely-positioned Canvas with 25 floating coffee beans using a seeded PRNG for deterministic layout.

### Styling conventions
- **Tailwind CSS v4** — configured via `@theme` block in `src/index.css` (no `tailwind.config.js`). Custom tokens: `espresso`, `cream`, `beige`, `terracotta`, `gold`, `dark-warm`.
- **Component CSS files** (`Navbar.css`, `Hero.css`) — created for any component where GSAP controls element transforms. Classes follow flat BEM-style naming (`hero-overlay`, `hero-menu-btn`, etc.).
- **Inline styles** — still used in Menu, About, Contact. When converting a component to CSS classes, create a companion `.css` file and import it in the component.

### Static assets
- `public/frames/` — 75 JPEG animation frames (served at `/frames/ezgif-frame-NNN.jpg`)
- `images/` (project root) — logo and icon images, imported directly via ES module imports in Navbar
- `public/images/` — runtime images referenced by path string (e.g. sidebanner)
