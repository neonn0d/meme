import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Regular client for client-side operations
// In the browser, only create the client if the keys are available
// Using non-null assertion to fix TypeScript errors, but we'll still do runtime checks
export const supabase = (!isBrowser || (supabaseUrl && supabaseAnonKey)) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-url.supabase.co', 'placeholder-key');

// Helper function to check if supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
}

// Admin client for server-side operations that need to bypass RLS
// Only create this on the server side, never expose it to the client
export const supabaseAdmin = !isBrowser && supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
