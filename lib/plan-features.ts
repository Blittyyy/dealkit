/**
 * Central plan rules — match Pricing page (MVP).
 * Source of truth for plan is `user_subscriptions.plan` ('free' | 'pro').
 */
export type PlanId = "free" | "pro";

export type PlanFeatures = {
  id: PlanId;
  /** Max example-video rows in builder (non-empty URLs count toward public cap). */
  maxExampleVideos: number;
  canCustomizeSlug: boolean;
  showAdvancedPerformanceInBuilder: boolean;
  /** Public kit: CTR / retention / ROAS section */
  showPerformanceOnPublicKit: boolean;
  showVerifiedBadgeOnPublicKit: boolean;
  showDealKitHeaderOnPublicKit: boolean;
  showBuiltWithFooterOnPublicKit: boolean;
};

const FREE: PlanFeatures = {
  id: "free",
  maxExampleVideos: 3,
  canCustomizeSlug: false,
  showAdvancedPerformanceInBuilder: false,
  showPerformanceOnPublicKit: false,
  showVerifiedBadgeOnPublicKit: false,
  showDealKitHeaderOnPublicKit: true,
  showBuiltWithFooterOnPublicKit: true,
};

const PRO: PlanFeatures = {
  id: "pro",
  maxExampleVideos: 50,
  canCustomizeSlug: true,
  showAdvancedPerformanceInBuilder: true,
  showPerformanceOnPublicKit: true,
  showVerifiedBadgeOnPublicKit: true,
  showDealKitHeaderOnPublicKit: false,
  showBuiltWithFooterOnPublicKit: false,
};

export function getPlanFeatures(plan: PlanId | null | undefined): PlanFeatures {
  return plan === "pro" ? PRO : FREE;
}

export function planFromSubscriptionRow(
  plan: string | null | undefined
): PlanId {
  return plan === "pro" ? "pro" : "free";
}
