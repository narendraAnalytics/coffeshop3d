import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.contact-content',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 2rem',
        background: 'linear-gradient(to bottom, #1a0f0a, #2d1a10)',
      }}
    >
      <div className="contact-content">
        <p
          style={{
            color: '#c49a3c',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            marginBottom: '1.5rem',
            fontWeight: 500,
          }}
        >
          Visit Us
        </p>
        <h2
          style={{
            color: '#f5e6d3',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            margin: '0 0 1.5rem',
            lineHeight: 1.2,
          }}
        >
          Come for the coffee.<br />
          <span style={{ color: '#c4622d', fontStyle: 'italic' }}>
            Stay for the feeling.
          </span>
        </h2>
        <p
          style={{
            color: '#e8d5b7',
            opacity: 0.75,
            maxWidth: '500px',
            lineHeight: 1.7,
            marginBottom: '3rem',
            fontSize: '1rem',
          }}
        >
          123 Morning Lane, The City<br />
          Mon–Fri: 7am – 6pm · Sat–Sun: 8am – 5pm
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="mailto:hello@sunrisebrew.com"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2.5rem',
              background: '#c4622d',
              color: '#f5e6d3',
              textDecoration: 'none',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              transition: 'opacity 0.3s ease',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            Get in Touch
          </a>
          <a
            href="#menu"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2.5rem',
              border: '1px solid rgba(196, 154, 60, 0.5)',
              color: '#c49a3c',
              textDecoration: 'none',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              transition: 'border-color 0.3s ease',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196, 154, 60, 0.9)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196, 154, 60, 0.5)')}
          >
            View Menu
          </a>
        </div>
      </div>

      <div
        style={{
          marginTop: '6rem',
          color: '#e8d5b7',
          opacity: 0.3,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
        }}
      >
        © 2025 Sunrise Brew House
      </div>
    </section>
  )
}
