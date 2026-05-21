import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
export const ADMIN_EMAIL   = import.meta.env.VITE_ADMIN_EMAIL ?? 'flyincloud2001@gmail.com'

export const supabase = createClient(SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
