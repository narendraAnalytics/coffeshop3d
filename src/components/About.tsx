import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const STORY_PARAGRAPHS = [
  {
    label: 'The Origin',
    text: 'Born from a small corner in the city, Sunrise Brew House was founded on one simple belief — great coffee changes the way a morning feels.',
  },
  {
    label: 'The Craft',
    text: 'Every cup is a collaboration between farmer, roaster, and barista. We source single-origin beans from Ethiopia, Colombia, and Guatemala.',
  },
  {
    label: 'The Promise',
    text: "No shortcuts. No compromises. From 18-hour cold brews to hand-poured V60s — we obsess over the details so you don't have to.",
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef   = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      // Draw-in rule line
      gsap.fromTo(
        '.about-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Staggered paragraph reveals
      linesRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { y: 60 + i * 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="story"
      style={{
        minHeight: '100vh',
        padding: '8rem 2rem',
        background: '#1a0f0a',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <p
          style={{
            color: '#c49a3c',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          Our Story
        </p>

        <div
          className="about-rule"
          style={{
            height: '1px',
            background: 'rgba(196, 154, 60, 0.4)',
            marginBottom: '3.5rem',
          }}
        />

        {STORY_PARAGRAPHS.map((para, i) => (
          <div
            key={para.label}
            ref={(el) => { linesRef.current[i] = el }}
            style={{ marginBottom: '4rem' }}
          >
            <span
              style={{
                display: 'block',
                color: '#c4622d',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                fontWeight: 600,
              }}
            >
              {para.label}
            </span>
            <p
              style={{
                color: '#f5e6d3',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                lineHeight: 1.75,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              {para.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
