import { pgTable, serial, text, real, timestamp } from 'drizzle-orm/pg-core'

export const orders = pgTable('orders', {
  id:          serial('id').primaryKey(),
  clerkUserId: text('clerk_user_id').notNull(),
  userName:    text('user_name').notNull(),
  email:       text('email').notNull(),
  phone:       text('phone').notNull(),
  items:       text('items').notNull(),       // JSON: [{coffee_name, cost, cups}]
  totalCost:   real('total_cost').notNull(),
  status:      text('status').notNull().default('pending'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

export type Order    = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
