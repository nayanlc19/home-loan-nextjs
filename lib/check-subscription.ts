import { createClient } from "@/lib/supabase/server";

/**
 * Check if a user has an active subscription
 * @param userEmail - The email address of the user to check
 * @returns Promise<boolean> - True if user has active subscription, false otherwise
 */
export async function checkUserSubscription(
  userEmail: string
): Promise<boolean> {
  try {
    if (!userEmail) {
      return false;
    }

    // Admin users always have access
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || ['nayanlc19@gmail.com'];
    if (adminEmails.includes(userEmail)) {
      return true;
    }

    const supabase = await createClient();

    // Query the user_subscriptions table matching existing schema
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("is_paid, access_granted_at")
      .eq("email", userEmail)
      .single();

    if (error) {
      // If no record found, user doesn't have subscription
      if (error.code === "PGRST116") {
        return false;
      }
      console.error("Error checking subscription:", error);
      return false;
    }

    if (!data || !data.is_paid) {
      return false;
    }

    // Check if subscription is still valid (within 1 year)
    const grantedAt = new Date(data.access_granted_at);
    const expiresAt = new Date(grantedAt.getTime() + 365 * 24 * 60 * 60 * 1000);
    return expiresAt > new Date();
  } catch (error) {
    console.error("Error in checkUserSubscription:", error);
    return false;
  }
}

/**
 * Get subscription details for a user
 * @param userEmail - The email address of the user
 * @returns Promise with subscription details or null
 */
export async function getUserSubscription(userEmail: string) {
  try {
    if (!userEmail) {
      return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error getting subscription details:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserSubscription:", error);
    return null;
  }
}
