import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  username: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  points: number
  created_at: string
}

export type Favourite = {
  id: string
  user_id: string
  product_id: string
  product_name: string
  product_image: string
  product_price: number
  fulfillment: string
}

export type Order = {
  id: string
  user_id: string
  order_total: number
  status: string
  items: any[]
  shipping_address: any
  points_earned: number
  points_used: number
  created_at: string
}
