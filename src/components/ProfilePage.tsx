import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import './ProfilePage.css'

// ─── Project data ─────────────────────────────────────────────────────────────

interface Project {
  id: string
  title: string
  infographic: string
  video?: string
  demo?: string
}

const PROJECTS: Project[] = [
  {
    id: 'professional-photo-shoot',
    title: 'Professional Photo Shoot',
    infographic: '/profile/infographics/ProfessionalPhotoShoot.png',
    video: '/profile/videos/ProfessionalPhotoShoot.mp4',
    demo: 'https://professional-life-style-shoot.vercel.app/',
  },
  {
    id: 'thumbl',
    title: 'Thumbl',
    infographic: '/profile/infographics/thumblinfographic.png',
    video : 'profile/videos/thumblvideo.mp4',
    demo : 'https://thumbl-phi.vercel.app/',
  },
  {
    id: 'quickspot',
    title: 'Quickspot',
    infographic: '/profile/infographics/QuickBook.png',
    video : 'profile/videos/quickspotvideo.mp4',
    demo : 'https://quickspot-nine.vercel.app/',
  },
  {
    id: 'india-trade',
    title: 'India Trade Analysis',
    infographic: '/profile/infographics/IndiaTradeAnalysis.png',
    video :'/profile/videos/IndiaTradeAnalysisVideo.mp4',
    demo : 'https://tradeanalysis-azure.vercel.app/',
  },
  {
    id: 'stepwise',
    title: 'Stepwise',
    infographic: '/profile/infographics/stepwise.png',
    video : 'profile/videos/stepwisevideo.mp4',
    demo : 'https://stepwise-gules.vercel.app/',

  },
  {
    id: 'professional-ai-agent',
    title: 'Professional AI Agent',
    infographic: '/profile/infographics/ProfessionalAIAgent.png',
    video : 'profile/videos/aiagentvideo.mp4',
    demo : 'https://aiagent-ten-nu.vercel.app/',
  },
  
  {
    id: 'real-estate',
    title: 'Real Estate Investment',
    infographic: '/profile/infographics/Real Estate Investment.png',
    video : 'profile/videos/EstateVideo.mp4',
    demo : 'https://estate-ai-india.vercel.app/',
  },
  {
    id: 'snapcook',
    title: 'Snap Cook',
    infographic: '/profile/infographics/snapcook.png',
    video : 'profile/videos/snapcookvideo.mp4',
    demo : 'https://snapcook-psi.vercel.app/',
  },
  {
    id: 'content-ai',
    title: 'Content AI Generation',
    infographic: '/profile/infographics/contentaigeneration.png',
    demo : 'https://cotentaigeneration.vercel.app/',
  },
  
  {
    id: 'skinveda',
    title: 'Skinveda',
    infographic: '/profile/infographics/skinvedainfographic.png',
    video : 'profile/videos/skinveda.mp4',
  },
  
  
]

// ─── 3D Background ─────────────────────────────────────────────────────────────

interface ShapeProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  speed: number
  type: 'torus' | 'octahedron'
}

function FloatingShape({ position, rotation, scale, speed, type }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * speed * 0.22
    meshRef.current.rotation.y += delta * speed * 0.35
    meshRef.current.rotation.z += delta * speed * 0.12
  })

  return (
    <Float
      speed={speed}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.12, 0.12]}
    >
      <mesh ref={meshRef} position={position} rotation={rotation}>
        {type === 'torus' ? (
          <torusGeometry args={[0.28 * scale, 0.09 * scale, 12, 48]} />
        ) : (
          <octahedronGeometry args={[0.22 * scale]} />
        )}
        <meshStandardMaterial color="#c49a3c" roughness={0.25} metalness={0.85} />
      </mesh>
    </Float>
  )
}

function ProfileScene() {
  const shapes = useMemo(() => {
    let seed = 137
    const rand = () => {
      seed = (seed * 16807 + 0) % 2147483647
      return (seed - 1) / 2147483646
    }

    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      type: (i < 24 ? 'torus' : 'octahedron') as 'torus' | 'octahedron',
      position: [
        (rand() - 0.5) * 18,
        (rand() - 0.5) * 10,
        (rand() - 0.5) * 6 - 1,
      ] as [number, number, number],
      rotation: [
        rand() * Math.PI * 2,
        rand() * Math.PI * 2,
        rand() * Math.PI * 2,
      ] as [number, number, number],
      scale: 0.5 + rand() * 1.5,
      speed: 0.15 + rand() * 0.55,
    }))
  }, [])

  return (
    <>
      <ambientLight color="#4a2e0a" intensity={1.8} />
      <pointLight position={[6, 4, 3]} color="#c49a3c" intensity={10} />
      <pointLight position={[-6, -3, 2]} color="#8b6914" intensity={5} />
      <pointLight position={[0, -5, 5]} color="#d4aa4c" intensity={3} />
      {shapes.map(shape => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </>
  )
}

// ─── Video Lightbox ───────────────────────────────────────────────────────────

function VideoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    gsap.fromTo(
      innerRef.current,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.5)' }
    )
  }, [])

  const handleClose = () => {
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  return (
    <div ref={backdropRef} className="pp-lightbox" onClick={handleClose}>
      <div ref={innerRef} className="pp-lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="pp-lightbox-close" onClick={handleClose} aria-label="Close video">
          ×
        </button>
        <video
          src={src}
          autoPlay
          controls
          playsInline
          className="pp-lightbox-video"
        />
      </div>
    </div>
  )
}

// ─── Infographic Lightbox ────────────────────────────────────────────────────

function InfographicLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    gsap.fromTo(
      innerRef.current,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.5)' }
    )
  }, [])

  const handleClose = () => {
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  return (
    <div ref={backdropRef} className="pp-lightbox" onClick={handleClose}>
      <div ref={innerRef} className="pp-inf-inner" onClick={e => e.stopPropagation()}>
        <button className="pp-lightbox-close" onClick={handleClose} aria-label="Close image">
          ×
        </button>
        <img src={src} alt="Project infographic" className="pp-inf-img" />
      </div>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onVideoClick,
  onInfographicClick,
}: {
  project: Project
  onVideoClick: (src: string) => void
  onInfographicClick: (src: string) => void
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const rotXQ    = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rotYQ    = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    gsap.set(el, { transformPerspective: 900 })
    rotXQ.current = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power2.out' })
    rotYQ.current = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power2.out' })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el    = cardRef.current
    const sheen = sheenRef.current
    if (!el || !rotXQ.current || !rotYQ.current) return
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width
    const y    = (e.clientY - rect.top)  / rect.height
    rotXQ.current((y - 0.5) * -18)
    rotYQ.current((x - 0.5) *  18)
    if (sheen) {
      sheen.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(196,154,60,0.30) 0%, transparent 62%)`
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
    <div
      ref={cardRef}
      className="pp-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pp-card-img-wrap"
        onClick={() => onInfographicClick(project.infographic)}
      >
        <img
          src={project.infographic}
          alt={project.title}
          className="pp-card-img"
          loading="lazy"
        />
      </div>

      <div className="pp-card-info">
        <h3 className="pp-card-title">{project.title}</h3>
        <div className="pp-card-actions">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="pp-btn-demo"
            >
              View Live →
            </a>
          )}
          {project.video && (
            <button
              className="pp-btn-video"
              onClick={() => project.video && onVideoClick(project.video)}
            >
              ▶ Play
            </button>
          )}
        </div>
      </div>

      <div ref={sheenRef} className="pp-card-sheen" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProfilePageProps {
  onClose: () => void
}

const TITLE_CHARS = 'MY WORK'.split('')
const N = PROJECTS.length

export default function ProfilePage({ onClose }: ProfilePageProps) {
  const overlayRef     = useRef<HTMLDivElement>(null)
  const lettersRef     = useRef<HTMLSpanElement[]>([])
  const subtitleRef    = useRef<HTMLParagraphElement>(null)
  const underlineRef   = useRef<HTMLDivElement>(null)
  const stageCardRef   = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const directionRef   = useRef<1 | -1>(1)

  const [currentIndex, setCurrentIndex]       = useState(0)
  const [videoSrc, setVideoSrc]               = useState<string | null>(null)
  const [infographicSrc, setInfographicSrc]   = useState<string | null>(null)

  // Entry animation timeline
  useEffect(() => {
    // Lock body scroll so Hero ScrollTrigger doesn't fire in the background
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()

    // 1. Overlay sweeps in from the right via clip-path
    tl.to(overlayRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.75,
      ease: 'power3.out',
    })

    // 2. Title letters stagger up
    .fromTo(
      lettersRef.current.filter(Boolean),
      { y: 55, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.055, duration: 0.5, ease: 'power3.out' },
      '-=0.15'
    )

    // 3. Subtitle fades in
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      '-=0.1'
    )

    // 4. Gold underline draws in (scaleX from left)
    .fromTo(
      underlineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.65, ease: 'power2.out', transformOrigin: 'left center' },
      '-=0.2'
    )

    // 5. Stage card slides in from right on first open
    .fromTo(
      stageCardRef.current,
      { x: 280, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
      '-=0.1'
    )

    return () => {
      document.body.style.overflow = ''   // restore scroll on unmount
      tl.kill()
    }
  }, [])

  // Animate new card in after state update (skip on initial mount)
  useEffect(() => {
    if (!isAnimatingRef.current) return
    gsap.to(stageCardRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => { isAnimatingRef.current = false },
    })
  }, [currentIndex])

  // Navigate to a new project index with slide animation
  const navigate = (newIndex: number, direction: 1 | -1) => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    directionRef.current   = direction
    const card = stageCardRef.current
    if (!card) return

    gsap.to(card, {
      x: direction * -320,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(card, { x: direction * 320 })  // position for entry
        setCurrentIndex(newIndex)                // React re-renders new project
      },
    })
  }

  const handlePrev  = () => navigate((currentIndex - 1 + N) % N, -1)
  const handleNext  = () => navigate((currentIndex + 1) % N,       1)
  const goTo = (i: number) => {
    if (i === currentIndex) return
    navigate(i, i > currentIndex ? 1 : -1)
  }

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.5,
      ease: 'power3.in',
      onComplete: onClose,
    })
  }

  return (
    <>
      <div ref={overlayRef} className="pp-overlay">

        {/* 3D Background — same pattern as CoffeeScene */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          gl={{ alpha: true }}
          dpr={[1, 1.5]}
        >
          <ProfileScene />
        </Canvas>

        {/* Warm gradient for text readability */}
        <div className="pp-gradient" />

        {/* Profile video — top-left ring */}
        <video
          className="pp-profile-video"
          src="/profile/profilepic.mp4"
          autoPlay
          loop
          muted
          playsInline
          onClick={() => setVideoSrc('/profile/profilepic.mp4')}
        />

        {/* Close button */}
        <button className="pp-close" onClick={handleClose} aria-label="Close portfolio">
          ×
        </button>

        {/* Full-height flex layout — no scroll */}
        <div className="pp-stage-wrap">

          {/* Compact header */}
          <header className="pp-header">
            <h1 className="pp-title" aria-label="My Work">
              {TITLE_CHARS.map((char, i) => (
                <span
                  key={i}
                  ref={el => { if (el) lettersRef.current[i] = el }}
                  className={`pp-title-char${char === ' ' ? ' pp-title-space' : ''}`}
                >
                  {char}
                </span>
              ))}
            </h1>
            <p ref={subtitleRef} className="pp-subtitle">
              Design <span className="pp-dot">·</span> Product{' '}
              <span className="pp-dot">·</span> Strategy
            </p>
            <div ref={underlineRef} className="pp-underline" />
          </header>

          {/* Stage: arrows + single animated card */}
          <div className="pp-stage">
            <button className="pp-arrow pp-arrow--prev" onClick={handlePrev} aria-label="Previous project">
              ‹
            </button>

            {/* Animated container — GSAP manages x + opacity, no CSS transform */}
            <div ref={stageCardRef} className="pp-stage-card">
              <ProjectCard
                project={PROJECTS[currentIndex]}
                onVideoClick={setVideoSrc}
                onInfographicClick={setInfographicSrc}
              />
            </div>

            <button className="pp-arrow pp-arrow--next" onClick={handleNext} aria-label="Next project">
              ›
            </button>
          </div>

          {/* Counter + dot navigation */}
          <div className="pp-nav">
            <span className="pp-counter">{currentIndex + 1} / {N}</span>
            <div className="pp-dots">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  className={`pp-dot-btn${i === currentIndex ? ' pp-dot-btn--active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {videoSrc && (
        <VideoLightbox src={videoSrc} onClose={() => setVideoSrc(null)} />
      )}
      {infographicSrc && (
        <InfographicLightbox src={infographicSrc} onClose={() => setInfographicSrc(null)} />
      )}
    </>
  )
}
