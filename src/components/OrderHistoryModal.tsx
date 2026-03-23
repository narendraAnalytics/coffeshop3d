import { useEffect, useState } from 'react'
import { getDb } from '../db'
import { orders } from '../schema'
import type { Order } from '../schema'
import { eq, desc } from 'drizzle-orm'
import './OrderHistoryModal.css'

type CartItem = { coffee_name: string; cost: number; cups: number }

interface Props {
  onClose: () => void
  userId: string
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export default function OrderHistoryModal({ onClose, userId }: Props) {
  const [pastOrders, setPastOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const db = getDb()
        const result = await db
          .select()
          .from(orders)
          .where(eq(orders.clerkUserId, userId))
          .orderBy(desc(orders.createdAt))
        setPastOrders(result)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(`Failed to load orders: ${msg}`)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [userId])

  return (
    <div className="ohm-backdrop" onClick={onClose}>
      <div className="ohm-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ohm-header">
          <h2 className="ohm-title">My Orders</h2>
          <button className="ohm-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="ohm-loading">
            <div className="ohm-spinner" />
            <p className="ohm-loading-text">Fetching your orders…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <p className="ohm-error">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && pastOrders.length === 0 && (
          <div className="ohm-empty">
            <p className="ohm-empty-text">No orders found.</p>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && pastOrders.length > 0 && (
          <div className="ohm-orders-list">
            {pastOrders.map(order => {
              let items: CartItem[] = []
              try {
                items = JSON.parse(order.items) as CartItem[]
              } catch {
                items = []
              }

              return (
                <div key={order.id} className="ohm-order-card">
                  <div className="ohm-order-header-row">
                    <span className="ohm-order-number">Order #{order.id}</span>
                    <span className={`ohm-status-badge ohm-status--${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="ohm-order-date">{formatDate(order.createdAt)}</p>

                  <div className="ohm-items-list">
                    {items.map((item, idx) => (
                      <div key={idx} className="ohm-item-row">
                        <span className="ohm-item-name">{item.cups}× {item.coffee_name}</span>
                        <span className="ohm-item-cost">₹{item.cost * item.cups}</span>
                      </div>
                    ))}
                  </div>

                  <div className="ohm-order-divider" />

                  <div className="ohm-order-total-row">
                    <span className="ohm-order-total-label">Total</span>
                    <span className="ohm-order-total-value">₹{order.totalCost}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
