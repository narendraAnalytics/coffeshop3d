import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Contact.css'

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
      className="contact-section"
    >
      <div className="contact-content">
        <p className="contact-label">Visit Us</p>
        <h2 className="contact-heading">
          Come for the coffee.<br />
          <span className="contact-heading-accent">Stay for the feeling.</span>
        </h2>
        <p className="contact-description">
          Amaravathi,Andhra Pradesh<br />
          Mon–Fri: 7am – 6pm · Sat–Sun: 8am – 5pm
        </p>

        <div className="contact-btn-row">
          <a href="mailto:narendra.insights@gmail.com" className="contact-btn-primary">
            Get in Touch
          </a>
          <a href="#menu" className="contact-btn-outline">
            View Menu
          </a>
          <a
            href="https://www.linkedin.com/in/nk-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn-outline"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="contact-footer">
        © 2026 Sunrise Brew House
      </div>
    </section>
  )
}
