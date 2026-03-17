import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string | null;

    if (!userId || !subscriptionId) {
      return NextResponse.json({ received: true });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const price = subscription.items.data[0]?.price;
      const interval = price?.recurring?.interval === "year" ? "yearly" : "monthly";

      const supabase = createAdminClient();
      await supabase.from("user_subscriptions").upsert(
        {
          user_id: userId,
          plan: "pro",
          interval,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string | null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("Webhook subscription update error:", err);
      return NextResponse.json({ error: "Subscription update failed" }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;

    try {
      const supabase = createAdminClient();
      if (event.type === "customer.subscription.deleted") {
        await supabase
          .from("user_subscriptions")
          .update({
            plan: "free",
            interval: null,
            stripe_subscription_id: null,
            stripe_customer_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);
      } else {
        const price = subscription.items.data[0]?.price;
        const interval = price?.recurring?.interval === "year" ? "yearly" : "monthly";
        await supabase
          .from("user_subscriptions")
          .update({
            interval,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);
      }
    } catch (err) {
      console.error("Webhook subscription sync error:", err);
      return NextResponse.json({ error: "Subscription sync failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
