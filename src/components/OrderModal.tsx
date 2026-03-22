import { useState } from 'react'
import { getDb } from '../db'
import { orders } from '../schema'
import './OrderModal.css'

type CartItem = { coffee_name: string; cost: number; cups: number }

interface MenuItem { name: string; price: string }

interface Props {
  onClose: () => void
  initialItem: MenuItem
  allItems: MenuItem[]
  user: {
    id: string
    fullName: string | null
    firstName: string | null
    primaryEmailAddress: { emailAddress: string } | null
  } | null | undefined
}

const parsePrice = (p: string) => parseInt(p.replace(/[^\d]/g, ''), 10)

export default function OrderModal({ onClose, initialItem, allItems, user }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { coffee_name: initialItem.name, cost: parsePrice(initialItem.price), cups: 1 },
  ])
  const [phone,      setPhone]      = useState('')
  const [email,      setEmail]      = useState(user?.primaryEmailAddress?.emailAddress ?? '')
  const [addName,    setAddName]    = useState(allItems[0].name)
  const [addCups,    setAddCups]    = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  const total = cartItems.reduce((s, i) => s + i.cost * i.cups, 0)

  const setCups = (idx: number, delta: number) => {
    setCartItems(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, cups: Math.max(1, item.cups + delta) } : item
      )
    )
  }

  const removeItem = (idx: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx))
  }

  const addToCart = () => {
    const found = allItems.find(m => m.name === addName)
    if (!found) return
    const cost = parsePrice(found.price)
    setCartItems(prev => {
      const existing = prev.findIndex(i => i.coffee_name === addName)
      if (existing >= 0) {
        return prev.map((item, i) =>
          i === existing ? { ...item, cups: item.cups + addCups } : item
        )
      }
      return [...prev, { coffee_name: addName, cost, cups: addCups }]
    })
    setAddCups(1)
  }

  const handleSubmit = async () => {
    if (!user) return
    if (!phone.trim()) { setError('Please enter your phone number.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (cartItems.length === 0) { setError('Your cart is empty.'); return }

    setError('')
    setSubmitting(true)
    try {
      await getDb().insert(orders).values({
        clerkUserId: user.id,
        userName:    user.fullName ?? user.firstName ?? 'Guest',
        email:       email.trim(),
        phone:       phone.trim(),
        items:       JSON.stringify(cartItems),
        totalCost:   total,
      })
      setSuccess(true)
      setTimeout(onClose, 2200)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="om-backdrop" onClick={onClose}>
      <div className="om-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="om-header">
          <h2 className="om-title">Your Order</h2>
          <button className="om-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {success ? (
          <div className="om-success">
            <div className="om-success-icon">✓</div>
            <p className="om-success-text">Order placed successfully!</p>
            <p className="om-success-sub">We'll have it ready for you.</p>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="om-cart-list">
              {cartItems.map((item, idx) => (
                <div key={idx} className="om-cart-row">
                  <div className="om-cart-info">
                    <span className="om-cart-name">{item.coffee_name}</span>
                    <span className="om-cart-unit">₹{item.cost}/cup</span>
                  </div>
                  <div className="om-cart-controls">
                    <button className="om-qty-btn" onClick={() => setCups(idx, -1)}>−</button>
                    <span className="om-qty">{item.cups}</span>
                    <button className="om-qty-btn" onClick={() => setCups(idx, +1)}>+</button>
                    <span className="om-cart-subtotal">₹{item.cost * item.cups}</span>
                    <button
                      className="om-remove-btn"
                      onClick={() => removeItem(idx)}
                      aria-label="Remove"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add another coffee */}
            <div className="om-add-section">
              <p className="om-add-label">Add Another Coffee</p>
              <div className="om-add-row">
                <select
                  className="om-select"
                  aria-label="Select coffee to add"
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                >
                  {allItems.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} — {m.price}
                    </option>
                  ))}
                </select>
                <div className="om-add-qty-row">
                  <button className="om-qty-btn" onClick={() => setAddCups(c => Math.max(1, c - 1))}>−</button>
                  <span className="om-qty">{addCups}</span>
                  <button className="om-qty-btn" onClick={() => setAddCups(c => c + 1)}>+</button>
                </div>
                <button className="om-add-btn" onClick={addToCart}>Add</button>
              </div>
            </div>

            {/* Total */}
            <div className="om-total-row">
              <span className="om-total-label">Total</span>
              <span className="om-total-value">₹{total}</span>
            </div>

            <div className="om-divider" />

            {/* Contact fields */}
            <div className="om-fields">
              <label className="om-label">
                Email
                <input
                  className="om-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </label>
              <label className="om-label">
                Phone
                <input
                  className="om-input"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </label>
            </div>

            {error && <p className="om-error">{error}</p>}

            <button
              className="om-submit-btn"
              onClick={handleSubmit}
              disabled={submitting || cartItems.length === 0}
            >
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
