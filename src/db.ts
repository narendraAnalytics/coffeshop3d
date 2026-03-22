import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

// Lazy: only connect when a query is made, not at app startup
export function getDb() {
  const url = import.meta.env.VITE_DATABASE_URL as string
  if (!url) throw new Error('VITE_DATABASE_URL is not set in .env')
  return drizzle(neon(url))
}
