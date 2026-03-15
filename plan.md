# Coffee Shop 3D Website — Implementation Plan

## Context
Building a cinematic, scroll-driven coffee shop website inspired by slamdunk-five.vercel.app.
The hero section uses 75 JPEG frames (an Apple-style canvas scroll animation) that scrub a coffee cup explosion as the user scrolls. Three.js/R3F provides a 3D floating coffee bean scene behind the menu section. GSAP ScrollTrigger drives all scroll animations.

---

## Assets
- 75 JPEG frames are in `public/frames/ezgif-frame-001.jpg` … `ezgif-frame-075.jpg`
- Served by Vite as static assets at `/frames/ezgif-frame-001.jpg`

---

## Color Palette (Warm & Earthy)
| Token | Value |
|-------|-------|
| Espresso dark | `#1a0f0a` |
| Cream text | `#f5e6d3` |
| Warm beige | `#e8d5b7` |
| Terracotta accent | `#c4622d` |
| Gold accent | `#c49a3c` |

---

## File Structure
```
src/
├── components/
│   ├── Navbar.tsx       – Fixed transparent nav, scroll-to-frosted-glass transition
│   ├── Hero.tsx         – Canvas frame animation + GSAP ScrollTrigger pin+scrub
│   ├── Menu.tsx         – Menu cards (GSAP stagger reveal) + CoffeeScene behind
│   ├── CoffeeScene.tsx  – R3F Canvas, procedural floating beans (no external models)
│   ├── About.tsx        – Parallax brand story paragraphs
│   └── Contact.tsx      – CTA footer section
├── App.tsx              – Assemble all sections
├── App.css              – Cleared
├── index.css            – Tailwind v4 @import, @theme, warm palette
└── main.tsx             – GSAP ScrollTrigger registration
index.html               – Title + Google Fonts (Playfair Display)
vite.config.ts           – @tailwindcss/vite plugin added
```

---

## Implementation Notes

### Hero Frame Animation (Apple-style canvas scrub)
- 75 frames: coffee cup at rest → explosion → aftermath
- GSAP `scrollTrigger: { pin:true, scrub:0.5, end:'+=300%' }`
- `drawImageCover()` helper for correct aspect ratio fill
- Overlay headline + CTA fades in mid-scroll (after explosion frames)

### 3D Scene (CoffeeScene.tsx)
- R3F Canvas, `gl={{ alpha: true }}`, transparent bg
- 25 procedural beans: `<sphereGeometry>` + `meshStandardMaterial`
- `<Float>` from drei for drift, `useFrame` for rotation
- Used as absolute background in Menu section

### Navbar
- `position: fixed`, transparent over hero
- ScrollTrigger toggles `.nav-scrolled` class → `backdrop-filter: blur(12px)`

### GSAP
- Registered in `main.tsx` before `createRoot()`
- `useGSAP` (from `@gsap/react`) used in all components except Hero

---

## Critical Pitfalls

| Issue | Fix |
|-------|-----|
| Canvas blurry | Set `canvas.width = canvas.offsetWidth` before drawing |
| StrictMode double-init | Kill all ScrollTriggers in Hero cleanup; use `useGSAP` elsewhere |
| R3F blocks clicks | `pointer-events: none` on wrapper div |
| `#root` width constraint | Remove `width: 1126px` from index.css |
| GSAP plugin not found | Register in `main.tsx` before `createRoot()` |
| Tailwind v4 syntax | `@import "tailwindcss"` + `@theme {}` — no `tailwind.config.js` |

---

## Verification
1. `npm run dev` — dark espresso background, no console errors
2. `http://localhost:5173/frames/ezgif-frame-001.jpg` — frame loads
3. Scroll: hero pins, frames advance through explosion
4. Menu: cards stagger-animate in, beans float behind
5. About: text reveals with parallax
6. Navbar: transparent → frosted glass on scroll
7. `npm run build` — TypeScript clean compile
