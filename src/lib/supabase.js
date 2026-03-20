import { createClient } from '@supabase/supabase-js'

// Step 1: get values from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Step 2: create connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey)