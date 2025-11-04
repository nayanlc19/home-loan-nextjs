import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for use in API routes and server components
 * This uses the anon key for general database operations
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client with service role key for admin operations
 * Use this only when you need to bypass RLS policies
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types for type safety
export interface UserSubscription {
  id?: number;
  user_email: string;
  subscription_status: "active" | "expired" | "cancelled";
  subscribed_at: string;
  expires_at: string;
  payment_id: string;
  amount_paid: number;
  created_at?: string;
  updated_at?: string;
}
