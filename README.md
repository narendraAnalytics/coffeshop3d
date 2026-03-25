# Sunrise Brew House

A premium artisanal coffee shop website built with React 19, Three.js, and GSAP — featuring scroll-driven frame animations, procedural Web Audio, 3D scenes, a full ordering system, a portfolio showcase, and an AI-powered chat concierge.

---

## Tech Stack

### Core
| Library | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| TypeScript | ~5.9.3 | Type safety |
| Vite | 8.0.0 | Dev server + build |

### Animation & 3D
| Library | Version | Purpose |
|---|---|---|
| GSAP | 3.14.2 | Timeline animations, ScrollTrigger, quickTo |
| @gsap/react | 2.1.2 | `useGSAP` hook for scoped animations |
| Three.js | 0.183.2 | 3D graphics rendering |
| @react-three/fiber | 9.5.0 | React renderer for Three.js |
| @react-three/drei | 10.7.7 | `Float`, helpers for 3D scenes |
| @react-three/postprocessing | 3.0.4 | Post-processing effects |

### Auth & Database
| Library | Version | Purpose |
|---|---|---|
| @clerk/react | 6.1.2 | Authentication and user management |
| drizzle-orm | 0.45.1 | Type-safe SQL query builder |
| @neondatabase/serverless | 1.0.2 | Neon PostgreSQL HTTP driver (browser-side) |

### Styling
| Library | Version | Purpose |
|---|---|---|
| Tailwind CSS | 4.2.1 | Utility-first CSS (v4 `@theme` config) |

### AI & Utilities
| Library | Version | Purpose |
|---|---|---|
| @google/genai | 1.46.0 | Google Gemini AI client |
| dotenv | 17.3.1 | Environment variable loading |
| leva | 0.10.1 | Debug GUI for 3D scene tweaking |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx / .css         # Header with scroll-triggered logo flip
│   ├── Hero.tsx / .css           # Scroll-driven frame animation + Web Audio
│   ├── Menu.tsx / .css           # 3D coffee scene + carousel + ordering
│   ├── About.tsx                 # Brand story section
│   ├── Contact.tsx               # CTA + footer
│   ├── ProfilePage.tsx / .css    # Portfolio overlay with 3D background
│   ├── ChatBot.tsx / .css        # Gemini AI floating chat widget
│   ├── IntroScreen.tsx / .css    # Welcome video overlay
│   ├── OrderModal.tsx / .css     # Cart + checkout modal
│   └── OrderHistoryModal.tsx / .css  # Past orders modal
├── db.ts                         # Drizzle + Neon connection
├── schema.ts                     # Orders table schema
├── App.tsx                       # Root: section layout + overlay state
└── index.css                     # Tailwind @theme tokens + global styles

public/
├── frames/          # 75 JPEG frames for flat coffee animation
├── frames1/         # 208 JPEG frames for espresso animation
├── images/          # Runtime images (sidebanner, cup icon)
└── videos/          # 8 menu item MP4 previews + intro video

profile/
├── infographics/    # Portfolio project PNG images
└── videos/          # Portfolio demo MP4s

images/              # Logo + icon assets (ES module imports)
drizzle/             # SQL migration files
```

---

## Pages & Features

### Intro Screen
- Full-screen video overlay (`/videos/openingmedia.mp4`) on first visit
- GSAP fade-in for welcome text and button (0.8s delay, power2.out)
- Click to dismiss with fade-out animation
- `sessionStorage` flag (`intro_seen`) skips it on subsequent visits

### Navbar
- Text logo flips out (GSAP `rotationY: 90°`) on scroll past 80px
- Image logo fades in and spins continuously via `requestAnimationFrame`
- Nav links fade to 35% opacity on scroll
- Portfolio button opens the full-screen ProfilePage overlay
- Signed-in user name displayed via Clerk `useUser()`

### Hero Section
The most complex component — a scroll-driven frame animation with procedural audio.

**Frame Animation**
- 75 JPEG frames preloaded into an array and painted to a full-bleed `<canvas>`
- `drawImageCover()` replicates CSS `object-fit: cover` centering
- GSAP tween on `frameObj.frame` (0→74) pinned for **300vh** of scroll (`scrub: 0.5`)
- Side banner driven inside the render loop via `gsap.quickSetter` — no separate ScrollTrigger
- Two modes: Flat Coffee (75 frames) and Espresso (208 frames from `/frames1/`)

**Web Audio (procedural, lazy-initialized on first scroll)**
| Sound | Trigger | Implementation |
|---|---|---|
| Brown noise roll | Scroll begins | First-order filtered noise, bandpass 120Hz |
| Cmaj7 pad | 40% scroll | 4 triangle oscillators (C4, E4, G4, B4) with ±4¢ detune |
| Explosion blast | 47% scroll | Sine pitch-drop 90→28Hz + white noise burst |
| Beans falling | 52% scroll | 5 staggered white noise bursts, filtered 900–1400Hz |

### Menu Section
**3D Background**
- `CoffeeScene`: 25 floating coffee beans (seeded PRNG seed=42 for determinism)
- Each bean: ellipsoid mesh, brown material, `Float` component bobbing, `useFrame` rotation
- Point lights with gold and terracotta tones

**Coffee Carousel**
- 8 signature drinks with name, description, tags, price (₹), and MP4 preview
- GSAP `quickTo` for smooth card transitions
- 3D tilt effect: mouse position → `rotationX/Y` via `quickTo` (max ±14°)
- Glossy sheen overlay: radial gradient follows mouse cursor

**Smoke Particles**
- Canvas-based particle system (max 35 particles)
- Each particle: sinusoidal wobble drift, radial gradient fade, alpha envelope
- Spawns at cup position, floats upward

**Ordering System**
- Clerk auth gates order placement (`useUser()` + `useClerk()`)
- `OrderModal`: cart, contact fields, Drizzle insert to Neon
- `OrderHistoryModal`: fetches all past orders (DESC by `createdAt`)
- "View My Orders" button appears automatically once a past order exists

**Menu Items**
| Item | Price |
|---|---|
| Espresso | ₹180 |
| Americano | ₹200 |
| Cappuccino | ₹300 |
| Cafe Latte | ₹320 |
| Flat White | ₹320 |
| Mocha | ₹350 |
| Cold Brew | ₹350 |
| Frappuccino | ₹400 |

### About Section
- Three story pillars: The Origin, The Craft, The Promise
- Single-origin beans from Ethiopia, Colombia, and Guatemala
- GSAP ScrollTrigger: rule line draws in (`scaleX: 0→1`), paragraphs stagger up
- Serif font (Playfair Display, italic) for narrative text

### Contact / Footer
- Tagline: *"Come for the coffee. Stay for the feeling."*
- Location: Amaravathi, Andhra Pradesh
- Hours: Mon–Fri 7am–6pm, Sat–Sun 8am–5pm
- Buttons: Get in Touch (mailto), View Menu (anchor), LinkedIn
- GSAP fade-in on scroll with reverse on scroll-out

### Portfolio (ProfilePage)
Full-screen fixed overlay triggered by the Navbar Portfolio button.

**Opening Animation**
- Clip-path wipe from right: `inset(0 100%→0% 0 0)` — slam + rebound + settle (3-step GSAP tween)
- Header letters stagger up, subtitle fades, gold underline draws, card slides in

**3D Background**
- `ProfileScene`: 35 floating shapes (24 Torus + 11 Octahedron), seeded PRNG seed=137
- Gold metallic material (`MeshStandardMaterial`, roughness 0.25, metalness 0.85)
- 3 gold-toned point lights

**Project Carousel**
- 10 portfolio projects, single-card view
- Navigate with arrows or dot indicators
- Card exit: GSAP `x: ±320, opacity: 0` → state update → card enter
- `isAnimatingRef` prevents double-click during transitions

**Cards show:**
- Infographic image (full view lightbox on click)
- Tech stack badges
- Optional video demo (VideoLightbox)
- Optional live demo link

**Resume Button**
- Inline with "MY WORK" heading (flex row, `gap: 5.5rem`)
- Gold shimmer sweep animation (`::after` pseudo, 2.6s loop)
- Opens `/profile/saasresume.pdf` in new tab

### AI Chat Concierge
- Floating gold button fixed at bottom-right
- Powered by Google Gemini (`gemini-3-flash-preview`)
- GSAP panel open (`scale 0.92→1`) and close animations
- Animated loading dots while AI responds
- Knows the full menu, location, hours, and brand story
- Responds in plain prose — no markdown formatting

---

## Database

**Table: `orders`** (Neon PostgreSQL via Drizzle ORM)

| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| clerk_user_id | text | Clerk user ID |
| items | text | JSON string `[{coffee_name, cost, cups}]` |
| created_at | timestamp | Auto-set on insert |
| + contact fields | text | Name, email, phone from OrderModal |

**Connection model:** Direct browser-to-database via Neon HTTP serverless driver. No API server. `getDb()` in `src/db.ts` creates the Drizzle instance lazily.

---

## Environment Variables

Create a `.env` file in the project root (never committed):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...       # Clerk publishable key
CLERK_SECRET_KEY=sk_...                 # Clerk secret (drizzle-kit CLI only)
DATABASE_URL=postgresql://...           # Neon connection string (drizzle-kit CLI)
GEMINI_API_KEY=AIza...                  # Google Gemini API key
```

`vite.config.ts` exposes `DATABASE_URL` as `import.meta.env.VITE_DATABASE_URL` and `GEMINI_API_KEY` as `import.meta.env.VITE_GEMINI_API_KEY` so the frontend can access them.

---

## Commands

```bash
# Development
npm run dev           # Start Vite dev server (HMR)
npm run build         # TypeScript check + production build
npm run lint          # ESLint
npm run preview       # Preview production build locally

# Database (Drizzle ORM)
npx drizzle-kit generate    # Generate SQL migration from schema changes
npx drizzle-kit push        # Push schema directly to Neon (no migration file)
npx drizzle-kit studio      # Open Drizzle Studio GUI
```

---

## Design System

### Color Tokens (`src/index.css` `@theme` block)
| Token | Hex | Usage |
|---|---|---|
| `espresso` | `#1a0f0a` | Dark backgrounds |
| `dark-warm` | `#2d1a10` | Card backgrounds |
| `gold` | `#c49a3c` | Primary accent, borders, buttons |
| `cream` | `#f5e6d3` | Body text, headings |
| `beige` | `#e8d5b7` | Secondary text |
| `terracotta` | `#c4622d` | Warm accent |

### Font Families
- `--font-display`: Playfair Display, Georgia, serif — headings, story text
- `--font-body`: system-ui, Segoe UI, sans-serif — UI labels, buttons

### CSS Conventions
- Every component with GSAP-animated elements has a companion `.css` file
- Flat BEM naming with component prefix: `menu-`, `pp-`, `om-`, `ohm-`, `chat-`
- **Rule:** Never set CSS `transform` on an element that GSAP also animates with `x/y/rotation` — GSAP replaces the entire `transform` property
- Use `top: calc(50% - Xvh)` instead of `translateY(-50%)` for GSAP-animated elements

---

## Key Implementation Notes

- **Scroll driver:** A single GSAP `to()` tween with `scrub` is the sole source of truth for scroll progress in Hero — secondary effects run inside its `onUpdate` callback
- **3D determinism:** Seeded PRNG ensures floating objects have consistent positions every render (Menu: seed 42, Profile: seed 137)
- **Audio autoplay:** Web Audio context is lazy-initialized on first scroll event to satisfy browser autoplay policy
- **Database:** No API server — Neon's HTTP driver allows direct browser queries; Drizzle ORM provides type-safe access
- **Overlay scroll lock:** `document.body.style.overflow = 'hidden'` in ProfilePage prevents Hero ScrollTrigger from advancing in the background

---

*© 2026 Sunrise Brew House. Come for the coffee. Stay for the feeling.*
