import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CoffeeScene from './CoffeeScene'
import coffeeIconSrc from '../../images/coffeeicon.png'

const MENU_ITEMS = [
  {
    name: 'Espresso',
    description: 'A concentrated shot of pure coffee, delivering intense flavour and velvety crema in every sip.',
    tags: ['Hot', 'Single Origin', 'Strong'],
    videoSrc: '/videos/menuespressovideo.mp4',
  },
  {
    name: 'Flat White',
    description: 'Smooth double ristretto balanced with silky microfoam milk — the perfect harmony of espresso and cream.',
    tags: ['Hot', 'Milk-Based', 'Smooth'],
    videoSrc: '/videos/menuflatwhitevideo.mp4',
  },
  {
    name: 'Pour Over',
    description: 'Slow, deliberate brewing that coaxes out delicate floral and fruit notes from single-origin beans.',
    tags: ['Hot', 'Filter', 'Bright'],
    videoSrc: '/videos/menupourovervideo.mp4',
  },
  {
    name: 'Cold Brew',
    description: 'Steeped for 18 hours in cold water, yielding a smooth, low-acid concentrate served over ice.',
    tags: ['Cold', 'Slow-Steeped', 'Bold'],
    videoSrc: '/videos/menucoldbrewvideo.mp4',
  },
  {
    name: 'Cortado',
    description: 'Equal parts espresso and warm milk — bold enough to taste, gentle enough to savour slowly.',
    tags: ['Hot', 'Balanced', 'Small'],
    videoSrc: '/videos/menucortadovideo.mp4',
  },
  {
    name: 'Oat Latte',
    description: 'Creamy oat milk steamed to perfection, paired with our house espresso blend. Dairy-free, full flavour.',
    tags: ['Hot', 'Plant-Based', 'Creamy'],
    videoSrc: '/videos/menuoatlattevideo.mp4',
  },
]

export default function Menu() {
  const sectionRef    = useRef<HTMLElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const cupRef        = useRef<HTMLImageElement>(null)
  const cardInnerRef  = useRef<HTMLDivElement>(null)
  const sheenRef      = useRef<HTMLDivElement>(null)
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef      = useRef<HTMLVideoElement>(null)
  const rotXQ         = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rotYQ         = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

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

    gsap.set(cup, { x: -300, y: 20, rotation: -15, opacity: 0, scale: 0.85 })

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

      if (rect.top >= vH) {
        gsap.set(cup, { x: window.innerWidth / 2 - 140, y: -220, scale: 0.5, rotation: -25 })
        moveOpac(0)
        return
      }

      if (rect.top > 0) {
        const entranceP = (vH - rect.top) / vH
        const eased = entranceP * entranceP * (3 - 2 * entranceP)
        moveX(window.innerWidth / 2 - 140)
        moveY(-220 + eased * 280)
        moveOpac(entranceP * 0.9)
        moveScale(0.5 + eased * 0.5)
        moveRot(-25 + eased * 30)
        return
      }

      const p = Math.max(0, Math.min(1, -rect.top / (sH - vH / 2)))
      const ep = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p

      moveX(-300 + ep * (maxX + 300))
      moveY(20   + ep * (maxY - 20))
      moveRot(-15 + ep * 27)
      moveOpac(Math.min(p * 6, 0.85))
      moveScale(0.85 + ep * 0.25)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()

    return () => window.removeEventListener('scroll', update)
  }, [])

  // 3D tilt quickTo — initialized once, works across all cards
  useEffect(() => {
    const el = cardInnerRef.current
    if (!el) return
    rotXQ.current = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power2.out' })
    rotYQ.current = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power2.out' })
  }, [])

  // GSAP fade-in on card switch
  useEffect(() => {
    const el = cardInnerRef.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
  }, [activeIdx])

  // Reload video when card changes
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => {})
  }, [activeIdx])

  // Smoke / steam particle system
  useEffect(() => {
    const canvas = smokeCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; life: number; maxLife: number
      wobble: number; wobbleSpeed: number
    }

    const particles: Particle[] = []
    let frameId: number
    let tick = 0

    const spawn = () => {
      const cx = canvas.width * (0.25 + Math.random() * 0.5)
      particles.push({
        x: cx,
        y: canvas.height * 0.85,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.6 + Math.random() * 1.0),
        size: 18 + Math.random() * 28,
        life: 0,
        maxLife: 220 + Math.random() * 160,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.008 + Math.random() * 0.015,
      })
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (tick % 18 === 0 && particles.length < 35) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.wobble += p.wobbleSpeed
        p.size   += 0.25
        p.x      += p.vx + Math.sin(p.wobble) * 0.5
        p.y      += p.vy

        if (p.life >= p.maxLife) { particles.splice(i, 1); continue }

        const prog  = p.life / p.maxLife
        const alpha = prog < 0.2
          ? (prog / 0.2) * 0.18
          : prog > 0.7
            ? ((1 - prog) / 0.3) * 0.18
            : 0.18

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        g.addColorStop(0, `rgba(245, 225, 195, ${alpha})`)
        g.addColorStop(1, `rgba(245, 225, 195, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
    }

    animate()
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el    = cardInnerRef.current
    const sheen = sheenRef.current
    if (!el || !rotXQ.current || !rotYQ.current) return
    const rect   = el.getBoundingClientRect()
    const x      = (e.clientX - rect.left)  / rect.width
    const y      = (e.clientY - rect.top)   / rect.height
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

      {/* Smoke / steam particles */}
      <canvas
        ref={smokeCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Flowing cup */}
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

          {/* Card perspective wrapper */}
          <div
            style={{
              width: '100%',
              maxWidth: '960px',
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
                display: 'flex',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(25,10,3,0.88)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
                minHeight: '420px',
              }}
            >
              {/* LEFT: Video */}
              <div
                style={{
                  width: '60%',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <video
                  ref={videoRef}
                  src={item.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Right-side fade blending video into the dark panel */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, transparent 55%, rgba(25,10,3,0.88) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* RIGHT: Text */}
              <div
                style={{
                  flex: 1,
                  padding: '2.5rem 2rem 2.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '1.25rem',
                }}
              >
                {/* Gold eyebrow label */}
                <p
                  style={{
                    color: '#c49a3c',
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Signature Brew
                </p>

                {/* Drink name */}
                <h3
                  style={{
                    color: '#f5e6d3',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {item.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#c4a882',
                    fontSize: '0.92rem',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>

                {/* Tag badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        border: '1px solid rgba(196,154,60,0.5)',
                        color: '#c49a3c',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Add to Order button */}
                <button
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '0.5rem',
                    background: '#c49a3c',
                    color: '#1a0a00',
                    border: 'none',
                    padding: '0.7rem 1.75rem',
                    borderRadius: '100px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d4aa4c' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#c49a3c' }}
                >
                  Add to Order
                </button>
              </div>

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
                  borderRadius: '20px',
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
