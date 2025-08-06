import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  created_at: string
  updated_at: string
}

export interface Photography {
  id: string
  title?: string
  description?: string
  image_url: string
  price?: number
  location?: string
  date: string
  tags: string[]
  status: 'available' | 'sold'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  start_date: string
  end_date?: string
  technologies: string[]
  role: string
  status: 'completed' | 'in-progress' | 'planned'
  external_links?: {
    github?: string
    live?: string
    demo?: string
  }
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  category: 'photography' | 'project'
  created_at: string
}
