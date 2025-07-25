import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usmsstwmfjyutidqfsei.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbXNzdHdtZmp5dXRpZHFmc2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjgyMjksImV4cCI6MjA2OTAwNDIyOX0.6af6kea37yVgyyqUlw36RjoR83Bi_QzsUZbOTQviqcc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          genre: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          genre: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          genre?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          book_id: string
          user_id: string
          rating: number
          review_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          rating: number
          review_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          rating?: number
          review_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
