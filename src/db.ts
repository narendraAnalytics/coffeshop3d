import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(import.meta.env.VITE_DATABASE_URL as string)
export const db = drizzle(sql)
