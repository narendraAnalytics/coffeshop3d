import { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'
import gsap from 'gsap'
import './ChatBot.css'

interface Message {
  role: 'user' | 'model'
  text: string
}

const SYSTEM_INSTRUCTION = `
You are the AI concierge for Sunrise Brew House, a premium artisanal coffee shop experience.
Your tone is warm, sophisticated, and slightly poetic — matching the brand's passion for craft coffee.

Website Details:
- Name: Sunrise Brew House
- Location: Amaravathi, Andhra Pradesh
- Hours: Monday to Friday 7am to 6pm, Saturday and Sunday 8am to 5pm
- Email: narendra.insights@gmail.com
- Tagline: Come for the coffee. Stay for the feeling.

Our Story:
- Founded on one belief — great coffee changes the way a morning feels.
- We source single-origin beans from Ethiopia, Colombia, and Guatemala.
- Every cup is a collaboration between farmer, roaster, and barista.
- No shortcuts. No compromises. From 18-hour cold brews to hand-poured V60s.

Menu (all prices in Indian Rupees):
  Espresso: Rs.180 — concentrated shot, intense flavour, velvety crema
  Americano: Rs.200 — bold, clean, full-bodied with depth of a double shot
  Cappuccino: Rs.300 — classic Italian espresso with velvety steamed milk and thick foam
  Cafe Latte: Rs.320 — smooth espresso with generous steamed milk, rich and comforting
  Flat White: Rs.320 — double ristretto with silky microfoam, intense and velvety
  Mocha: Rs.350 — espresso with rich chocolate and whipped cream, indulgent
  Frappuccino: Rs.400 — slow-brewed, coaxing floral and fruit notes from single-origin beans
  Cold Brew: Rs.350 — steeped 18 hours in cold water, smooth low-acid concentrate served over ice

Guidelines:
- Never use any markdown formatting. No asterisks, hashes, dashes as bullets, or backticks.
- Write in plain, warm, flowing prose only.
- Keep responses concise but thoughtful.
- If asked about prices or menu items, provide the specific details above.
- If asked about location or hours, provide the exact details above.
- Gently bring truly off-topic conversations back to Sunrise Brew House. Portfolio and resume questions about Narendra are NOT off-topic — answer them fully using the portfolio section below.

---

You also serve as a portfolio assistant for the developer behind this site, Narendra. When visitors ask about his work, background, or how to connect with him, respond helpfully and warmly using the details below.

Developer Portfolio:
- Name: Narendra
- Location: Amaravathi, Andhra Pradesh
- Email: narendra.insights@gmail.com
- LinkedIn: https://www.linkedin.com/in/nk-analytics
- Resume: available to download from the Portfolio section of this site (file: /profile/saasresume.pdf)

Projects:

1. Professional Photo Shoot
   Live demo: https://professional-life-style-shoot.vercel.app/
   Tech stack: React, Clerk, Gemini AI, ImageKit, Tailwind CSS, Prisma

2. Thumbl
   Live demo: https://thumbl-phi.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Clerk, Gemini 3 Pro, Drizzle, Neon, ImageKit

3. Quickspot
   Live demo: https://quickspot-nine.vercel.app/
   Tech stack: Next.js, Tailwind CSS, Google Gemini API, Clerk, Vercel, TypeScript

4. India Trade Analysis
   Live demo: https://tradeanalysis-azure.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Neon, Drizzle

5. Stepwise
   Live demo: https://stepwise-gules.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Clerk, Gemini AI, Neon, Drizzle, Vercel

6. Professional AI Agent
   Live demo: https://aiagent-ten-nu.vercel.app/
   Tech stack: React, Python, LangGraph, FastAPI, Google Gemini, Clerk

7. Real Estate Investment
   Live demo: https://estate-ai-india.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Gemini AI, Stack Auth

8. Snap Cook
   Live demo: https://snapcook-psi.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Gemini AI, Drizzle, Neon

9. Content AI Generation
   Live demo: https://cotentaigeneration.vercel.app/
   Tech stack: Next.js, TypeScript, Tailwind CSS, Gemini AI, Drizzle, Neon, Motia

10. Skinveda
    Live demo: not publicly listed yet (video demo available in the portfolio)

Portfolio guidelines:
- IMPORTANT: When asked about LinkedIn in any form (what is your LinkedIn, LinkedIn profile, how to find you on LinkedIn), you MUST respond with the exact URL https://www.linkedin.com/in/nk-analytics — never substitute the email address for this.
- When asked for the resume, tell the visitor they can download it from the Portfolio section of this site.
- When asked about projects, you may list them or describe specific ones with their live demo link.
- If a visitor asks to contact Narendra, share the email narendra.insights@gmail.com and LinkedIn.
- Keep the same warm, plain-prose tone — no markdown formatting.
`

// SVG icons
const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconClose = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconBot = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
)

const IconUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function ChatBot() {
  const [isOpen, setIsOpen]       = useState(false)
  const [input, setInput]         = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages]   = useState<Message[]>([
    { role: 'model', text: 'Welcome to SunBrew House. How may I guide your journey through our flavors today?' }
  ])

  const panelRef   = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const chatRef    = useRef<any>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Animate panel in when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.92, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      )
    }
  }, [isOpen])

  const closePanel = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        scale: 0.92,
        y: 18,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setIsOpen(false),
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setIsLoading(true)

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        })
      }

      const response = await chatRef.current.sendMessage({ message: userMessage })
      const text = response.text ?? "I seem to have drifted for a moment. Please ask again."
      setMessages(prev => [...prev, { role: 'model', text }])
    } catch (err) {
      console.error('ChatBot error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'The connection seems to be drifting. Please try again in a moment.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-root">
      {/* Panel */}
      {isOpen && (
        <div className="chat-panel" ref={panelRef}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <IconBot />
              </div>
              <div>
                <p className="chat-header-name">SunBrewCoffee Team</p>
                <div className="chat-status">
                  <span className="chat-status-dot" />
                  <span className="chat-status-label">Online</span>
                </div>
              </div>
            </div>
            <button className="chat-close" onClick={closePanel} aria-label="Close chat">
              <IconClose size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg ${msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--bot'}`}
              >
                <div className="chat-msg-icon">
                  {msg.role === 'user' ? <IconUser /> : <IconBot />}
                </div>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-loading">
                <div className="chat-msg-icon chat-msg--bot">
                  <IconBot />
                </div>
                <div className="chat-loading-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our coffee..."
              disabled={isLoading}
            />
            <button
              className="chat-send"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className={`chat-toggle${isOpen ? ' chat-toggle--open' : ''}`}
        onClick={isOpen ? closePanel : () => setIsOpen(true)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <IconClose /> : <IconChat />}
      </button>
    </div>
  )
}
