import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchOwnerPlan } from "@/lib/subscription-server";
import { getPlanFeatures } from "@/lib/plan-features";
import { MediaKitPreview } from "@/components/media-kit-preview";

export default async function PublicKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: kit } = await supabase
    .from("kits")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!kit) notFound();

  const ownerPlan = await fetchOwnerPlan(kit.user_id as string);
  const f = getPlanFeatures(ownerPlan);

  return <MediaKitPreview kit={kit} features={f} variant="public" />;
}

