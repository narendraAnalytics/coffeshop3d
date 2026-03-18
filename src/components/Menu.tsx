import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CoffeeScene from './CoffeeScene'
import coffeeIconSrc from '../../images/coffeeicon.png'
import menuCard1 from '../../images/menuimages/menucard1.png'

const MENU_ITEMS = [
  { name: 'Espresso' },
  { name: 'Flat White' },
  { name: 'Pour Over' },
  { name: 'Cold Brew' },
  { name: 'Cortado' },
  { name: 'Oat Latte' },
]

export default function Menu() {
  const sectionRef   = useRef<HTMLElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const cupRef       = useRef<HTMLImageElement>(null)
  const cardInnerRef = useRef<HTMLDivElement>(null)
  const sheenRef     = useRef<HTMLDivElement>(null)
  const rotXQ        = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rotYQ        = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  const [activeIdx, setActiveIdx] = useState(0)
  const prev = () => setActiveIdx(i => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length)
  const next = () => setActiveIdx(i => (i + 1) % MENU_ITEMS.length)

  const item = MENU_ITEMS[activeIdx]

  useGSAP(
    () => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  // Cup animation — driven by getBoundingClientRect(), bypasses ScrollTrigger entirely
  useEffect(() => {
    const cup     = cupRef.current
    const section = sectionRef.current
    if (!cup || !section) return

    // Start hidden, off-screen left
    gsap.set(cup, { x: -300, y: 20, rotation: -15, opacity: 0, scale: 0.85 })

    // quickTo gives smooth follow (scrub-like feel) without ScrollTrigger
    const moveX     = gsap.quickTo(cup, 'x',        { duration: 0.5, ease: 'power2.out' })
    const moveY     = gsap.quickTo(cup, 'y',        { duration: 0.5, ease: 'power2.out' })
    const moveRot   = gsap.quickTo(cup, 'rotation', { duration: 0.5, ease: 'power2.out' })
    const moveOpac  = gsap.quickTo(cup, 'opacity',  { duration: 0.3 })
    const moveScale = gsap.quickTo(cup, 'scale',    { duration: 0.5, ease: 'power2.out' })

    const update = () => {
      const rect = section.getBoundingClientRect()
      const sH   = section.offsetHeight
      const vH   = window.innerHeight
      const maxX = window.innerWidth - 320
      const maxY = Math.max(sH - 320, 100)

      // Far below viewport — pre-position above center, keep hidden
      if (rect.top >= vH) {
        gsap.set(cup, { x: window.innerWidth / 2 - 140, y: -220, scale: 0.5, rotation: -25 })
        moveOpac(0)
        return
      }

      // Entrance zone: section scrolling into view — cup drops from top-center
      if (rect.top > 0) {
        const entranceP = (vH - rect.top) / vH                          // 0 → 1
        const eased = entranceP * entranceP * (3 - 2 * entranceP)       // smoothstep
        moveX(window.innerWidth / 2 - 140)
        moveY(-220 + eased * 280)
        moveOpac(entranceP * 0.9)
        moveScale(0.5 + eased * 0.5)
        moveRot(-25 + eased * 30)
        return
      }

      // progress 0 = section top at viewport top
      // progress 1 = section bottom at viewport center
      const p = Math.max(0, Math.min(1, -rect.top / (sH - vH / 2)))

      // Cubic ease-in-out on progress for organic movement
      const ep = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p

      moveX(-300 + ep * (maxX + 300))
      moveY(20   + ep * (maxY - 20))
      moveRot(-15 + ep * 27)
      moveOpac(Math.min(p * 6, 0.85))
      moveScale(0.85 + ep * 0.25)
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // run once on mount to set correct initial state

    return () => window.removeEventListener('scroll', update)
  }, [])

  // 3D tilt quickTo — initialized once, works across all cards
  useEffect(() => {
    const el = cardInnerRef.current
    if (!el) return
    rotXQ.current = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power2.out' })
    rotYQ.current = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power2.out' })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el    = cardInnerRef.current
    const sheen = sheenRef.current
    if (!el || !rotXQ.current || !rotYQ.current) return
    const rect   = el.getBoundingClientRect()
    const x      = (e.clientX - rect.left)  / rect.width   // 0 → 1
    const y      = (e.clientY - rect.top)   / rect.height  // 0 → 1
    const maxDeg = 14
    rotXQ.current((y - 0.5) * -maxDeg * 2)
    rotYQ.current((x - 0.5) *  maxDeg * 2)
    if (sheen) {
      sheen.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28) 0%, transparent 58%)`
      sheen.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    if (rotXQ.current) rotXQ.current(0)
    if (rotYQ.current) rotYQ.current(0)
    const sheen = sheenRef.current
    if (sheen) sheen.style.opacity = '0'
  }

  return (
    <section
      ref={sectionRef}
      id="menu"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '8rem 2rem',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #5c3018 0%, #3d1e0a 50%, #4a2812 100%)',
      }}
    >
      {/* 3D floating beans background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <CoffeeScene />
      </div>

      {/* Flowing cup — z:5 floats above all content, pointer-events:none */}
      <img
        ref={cupRef}
        src={coffeeIconSrc}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '280px',
          pointerEvents: 'none',
          zIndex: 5,
          opacity: 0,
          willChange: 'transform',
          filter: 'drop-shadow(0 8px 24px rgba(196,154,60,0.35))',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p
            style={{
              color: '#c49a3c',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            What we brew
          </p>
          <h2
            ref={titleRef}
            style={{
              color: '#f5e6d3',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The Menu
          </h2>
        </div>

        {/* Carousel row: prev arrow + card + next arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
          }}
        >
          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c49a3c',
              fontSize: '3rem',
              cursor: 'pointer',
              padding: '0 1.5rem',
              opacity: 0.85,
              lineHeight: 1,
              flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
          >
            ‹
          </button>

          {/* Menu card — perspective wrapper */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              perspective: '1000px',
              perspectiveOrigin: 'center center',
              flexShrink: 0,
            }}
          >
            {/* Tilt target — GSAP rotationX/Y applied here */}
            <div
              ref={cardInnerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                cursor: 'default',
              }}
            >
              <img
                src={menuCard1}
                alt={item.name}
                style={{
                  width: '100%',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.6))',
                }}
              />
              {/* Glossy sheen overlay */}
              <div
                ref={sheenRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  opacity: 0,
                  transition: 'opacity 0.35s ease',
                  mixBlendMode: 'overlay',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c49a3c',
              fontSize: '3rem',
              cursor: 'pointer',
              padding: '0 1.5rem',
              opacity: 0.85,
              lineHeight: 1,
              flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
          >
            ›
          </button>
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '1.75rem',
          }}
        >
          {MENU_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to ${MENU_ITEMS[i].name}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: '1px solid #c49a3c',
                background: i === activeIdx ? '#c49a3c' : 'transparent',
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.25s',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
