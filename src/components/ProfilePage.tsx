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
    id: 'content-ai',
    title: 'Content AI Generation',
    infographic: '/profile/infographics/contentaigeneration.png',
  },
  {
    id: 'india-trade',
    title: 'India Trade Analysis',
    infographic: '/profile/infographics/IndiaTradeAnalysis.png',
  },
  {
    id: 'professional-ai-agent',
    title: 'Professional AI Agent',
    infographic: '/profile/infographics/ProfessionalAIAgent.png',
  },
  {
    id: 'quickbook',
    title: 'QuickBook',
    infographic: '/profile/infographics/QuickBook.png',
  },
  {
    id: 'quiclspot',
    title: 'Quiclspot',
    infographic: '/profile/infographics/QuiclspotInfographic.png',
  },
  {
    id: 'read-with-me',
    title: 'Read With Me',
    infographic: '/profile/infographics/ReadWithME.png',
  },
  {
    id: 'real-estate',
    title: 'Real Estate Investment',
    infographic: '/profile/infographics/Real Estate Investment.png',
  },
  {
    id: 'skinveda',
    title: 'Skinveda',
    infographic: '/profile/infographics/skinvedainfographic.png',
  },
  {
    id: 'snapcook',
    title: 'Snap Cook',
    infographic: '/profile/infographics/snapcook.png',
  },
  {
    id: 'stepwise',
    title: 'Stepwise',
    infographic: '/profile/infographics/stepwise.png',
  },
  {
    id: 'thumbl',
    title: 'Thumbl',
    infographic: '/profile/infographics/thumblinfographic.png',
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

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onVideoClick,
}: {
  project: Project
  onVideoClick: (src: string) => void
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
      <div className="pp-card-img-wrap">
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

export default function ProfilePage({ onClose }: ProfilePageProps) {
  const overlayRef      = useRef<HTMLDivElement>(null)
  const lettersRef      = useRef<HTMLSpanElement[]>([])
  const subtitleRef     = useRef<HTMLParagraphElement>(null)
  const underlineRef    = useRef<HTMLDivElement>(null)
  const cardWrappersRef = useRef<HTMLDivElement[]>([])
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  // Entry animation timeline
  useEffect(() => {
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

    // 5. Cards stagger up from below
    .fromTo(
      cardWrappersRef.current.filter(Boolean),
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.065,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform',
      },
      '-=0.1'
    )

    return () => { tl.kill() }
  }, [])

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

        {/* Dark gradient for text readability */}
        <div className="pp-gradient" />

        {/* Close button */}
        <button className="pp-close" onClick={handleClose} aria-label="Close portfolio">
          ×
        </button>

        {/* Scrollable content */}
        <div className="pp-scroll-area">

          {/* Header */}
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

          {/* Project grid */}
          <div className="pp-grid">
            {PROJECTS.map((project, i) => (
              <div
                key={project.id}
                ref={el => { if (el) cardWrappersRef.current[i] = el }}
                className="pp-card-wrapper"
              >
                <ProjectCard project={project} onVideoClick={setVideoSrc} />
              </div>
            ))}
          </div>

        </div>
      </div>

      {videoSrc && (
        <VideoLightbox src={videoSrc} onClose={() => setVideoSrc(null)} />
      )}
    </>
  )
}
