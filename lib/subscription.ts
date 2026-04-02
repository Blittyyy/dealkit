import type { SupabaseClient } from "@supabase/supabase-js";

export type UserPlan = "free" | "pro";

/**
 * Reads user_subscriptions for the current user. No row or unknown → free.
 */
export async function fetchUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPlan> {
  const { data } = await supabase
    .from("user_subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.plan === "pro") return "pro";
  return "free";
}

export function isPro(plan: UserPlan): boolean {
  return plan === "pro";
}
