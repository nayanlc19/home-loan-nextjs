import { createClient } from "@/lib/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  email: string;
  is_paid: boolean;
  payment_id: string | null;
  access_granted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string | null;
  email: string;
  order_id: string;
  payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Check if a user has paid access
 */
export async function checkUserAccess(email: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("is_paid")
    .eq("email", email)
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_paid;
}

/**
 * Get or create user in database
 */
export async function upsertUser(userData: {
  email: string;
  name?: string;
  image?: string;
}): Promise<User | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        email: userData.email,
        name: userData.name || null,
        image: userData.image || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    return null;
  }

  return data;
}

/**
 * Get user subscription status
 */
export async function getUserSubscription(
  email: string
): Promise<UserSubscription | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data;
}

/**
 * Get user's payment history
 */
export async function getUserPayments(email: string): Promise<Payment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return data || [];
}
