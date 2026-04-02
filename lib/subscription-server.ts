import { createAdminClient } from "@/lib/supabase/admin";
import { planFromSubscriptionRow, type PlanId } from "@/lib/plan-features";

/** Server-only: public kit page needs owner plan (RLS blocks anon reads of user_subscriptions). */
export async function fetchOwnerPlan(userId: string): Promise<PlanId> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("user_subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle();
    return planFromSubscriptionRow(data?.plan);
  } catch {
    return "free";
  }
}
