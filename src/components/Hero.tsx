import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_COUNT = 75

function framePath(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`
}

// Draw image filling the canvas while maintaining aspect (like CSS object-fit: cover)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  if (!img.complete || img.naturalWidth === 0) return
  const iAspect = img.naturalWidth / img.naturalHeight
  const cAspect = cw / ch
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

  if (cAspect > iAspect) {
    sh = img.naturalWidth / cAspect
    sy = (img.naturalHeight - sh) / 2
  } else {
    sw = img.naturalHeight * cAspect
    sx = (img.naturalWidth - sw) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imagesRef  = useRef<HTMLImageElement[]>([])
  const frameObj   = useRef({ frame: 0 })

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = framePath(i)
      img.onload = () => {
        // Render first frame as soon as it loads
        if (i === 1) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (canvas && ctx) {
            canvas.width  = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            drawImageCover(ctx, img, canvas.width, canvas.height)
          }
        }
      }
      images[i - 1] = img
    }

    imagesRef.current = images
  }, [])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const ctx    = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const img = imagesRef.current[Math.round(frameObj.current.frame)]
      if (img?.complete) drawImageCover(ctx, img, canvas.width, canvas.height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    const ctx     = canvas?.getContext('2d')
    if (!canvas || !section || !ctx) return

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const render = () => {
      const idx = Math.round(frameObj.current.frame)
      const img = imagesRef.current[idx]
      if (img?.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawImageCover(ctx, img, canvas.width, canvas.height)
      }
    }

    // Frame scrub animation — pinned for 300vh of scroll
    const frameTween = gsap.to(frameObj.current, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=300%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    })

    // Overlay text fades in after the explosion (mid-scroll)
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top+=150% top',
          end: 'top+=220% top',
          scrub: true,
        },
      }
    )

    return () => {
      frameTween.scrollTrigger?.kill()
      frameTween.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1a0f0a',
      }}
    >
      {/* Full-bleed canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Overlay headline — fades in after explosion frames */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0,
          zIndex: 10,
          pointerEvents: 'none',
          width: '90%',
          maxWidth: '700px',
        }}
      >
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
          Sunrise Brew House
        </p>
        <h1
          style={{
            color: '#f5e6d3',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 1.5rem',
          }}
        >
          Crafted with<br />
          <span style={{ color: '#c4622d', fontStyle: 'italic' }}>Passion.</span>
        </h1>
        <a
          href="#menu"
          style={{
            display: 'inline-block',
            padding: '0.875rem 2.5rem',
            border: '1px solid #c49a3c',
            color: '#c49a3c',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = '#c49a3c'
            el.style.color = '#1a0f0a'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'transparent'
            el.style.color = '#c49a3c'
          }}
        >
          View Menu
        </a>
      </div>

      {/* Bottom gradient blend into next section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, #1a0f0a)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </section>
  )
}
