import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CoffeeScene from './CoffeeScene'

const MENU_ITEMS = [
  {
    name: 'Flat White',
    desc: 'Double ristretto, microfoam milk. Clean and intense.',
    price: '$5.50',
    tag: 'Signature',
  },
  {
    name: 'Pour Over',
    desc: 'Single origin Ethiopian Yirgacheffe, bright and floral.',
    price: '$6.00',
    tag: 'Single Origin',
  },
  {
    name: 'Cold Brew',
    desc: '18-hour steep, served over oat milk and caramel.',
    price: '$6.50',
    tag: 'Seasonal',
  },
  {
    name: 'Cortado',
    desc: 'Equal parts espresso and steamed milk. Perfectly balanced.',
    price: '$5.00',
    tag: 'Classic',
  },
  {
    name: 'Oat Latte',
    desc: 'House oat milk, triple shot, light body, nutty finish.',
    price: '$6.00',
    tag: 'Dairy Free',
  },
  {
    name: 'Espresso',
    desc: 'Pure. Direct. Our house blend, 20g in, 40g out.',
    price: '$4.00',
    tag: 'Classic',
  },
]

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

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

      gsap.fromTo(
        cardsRef.current?.querySelectorAll('.menu-card') ?? [],
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
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
      id="menu"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '8rem 2rem',
        overflow: 'hidden',
        background: '#1a0f0a',
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
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

        {/* Card grid */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {MENU_ITEMS.map((item) => (
            <div
              key={item.name}
              className="menu-card"
              style={{
                background: 'rgba(45, 26, 16, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(196, 154, 60, 0.2)',
                borderRadius: '4px',
                padding: '2rem',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-6px)'
                el.style.borderColor = 'rgba(196, 154, 60, 0.6)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(0)'
                el.style.borderColor = 'rgba(196, 154, 60, 0.2)'
              }}
            >
              <span
                style={{
                  color: '#c4622d',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {item.tag}
              </span>
              <h3
                style={{
                  color: '#f5e6d3',
                  margin: '0.75rem 0 0.5rem',
                  fontSize: '1.4rem',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  color: '#e8d5b7',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  margin: '0 0 1.5rem',
                  opacity: 0.85,
                }}
              >
                {item.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#c49a3c',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {item.price}
                </span>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid #c4622d',
                    color: '#c4622d',
                    padding: '0.4rem 1.1rem',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = '#c4622d'
                    el.style.color = '#f5e6d3'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'transparent'
                    el.style.color = '#c4622d'
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
