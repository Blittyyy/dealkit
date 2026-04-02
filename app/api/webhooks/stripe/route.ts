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

  async function upsertProSubscription(
    userId: string,
    subscriptionId: string,
    customerId: string | null,
    stripe: Stripe
  ) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const price = subscription.items.data[0]?.price;
    const interval = price?.recurring?.interval === "year" ? "yearly" : "monthly";
    const supabase = createAdminClient();
    const { error } = await supabase.from("user_subscriptions").upsert(
      {
        user_id: userId,
        plan: "pro",
        interval,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) {
      console.error("user_subscriptions upsert error:", error.message, error);
      throw error;
    }
  }

  function subscriptionIdFromSession(session: Stripe.Checkout.Session): string | null {
    const sub = session.subscription;
    if (typeof sub === "string" && sub) return sub;
    if (sub && typeof sub === "object" && "id" in sub) return (sub as Stripe.Subscription).id;
    return null;
  }

  if (event.type === "checkout.session.completed") {
    let session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const userId =
      session.client_reference_id ||
      meta.supabase_user_id ||
      null;

    let subscriptionId = subscriptionIdFromSession(session);
    if (!subscriptionId && session.id) {
      try {
        session = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["subscription"],
        });
        subscriptionId = subscriptionIdFromSession(session);
      } catch (e) {
        console.error("[stripe webhook] session retrieve failed:", e);
      }
    }

    if (!userId) {
      console.warn("[stripe webhook] checkout.session.completed: no user id", {
        sessionId: session.id,
        hasClientRef: !!session.client_reference_id,
        metadataKeys: Object.keys(meta),
      });
      return NextResponse.json({ received: true });
    }

    if (!subscriptionId) {
      console.warn("[stripe webhook] checkout.session.completed: no subscription on session", {
        sessionId: session.id,
        mode: session.mode,
        paymentStatus: session.payment_status,
      });
      return NextResponse.json({ received: true });
    }

    try {
      await upsertProSubscription(
        userId,
        subscriptionId,
        (session.customer as string) || null,
        stripe
      );
      console.log("[stripe webhook] user_subscriptions upsert ok", {
        userId: userId.slice(0, 8) + "…",
        subscriptionId,
      });
    } catch (err) {
      console.error("Webhook subscription update error:", err);
      return NextResponse.json({ error: "Subscription update failed" }, { status: 500 });
    }
  }

  /** Fallback when session payload is thin but invoice has subscription + metadata */
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    };
    const subRaw = invoice.subscription;
    const subscriptionId =
      typeof subRaw === "string" ? subRaw : subRaw && typeof subRaw === "object" && "id" in subRaw
        ? (subRaw as Stripe.Subscription).id
        : null;
    if (
      subscriptionId &&
      (invoice.billing_reason === "subscription_create" || invoice.billing_reason === "subscription_cycle")
    ) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await upsertProSubscription(
            userId,
            subscriptionId,
            (sub.customer as string) || null,
            stripe
          );
          console.log("[stripe webhook] invoice.payment_succeeded upsert ok", {
            userId: userId.slice(0, 8) + "…",
            subscriptionId,
          });
        }
      } catch (err) {
        console.error("Webhook invoice.payment_succeeded error:", err);
        return NextResponse.json({ error: "Invoice sync failed" }, { status: 500 });
      }
    }
  }

  if (event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.supabase_user_id;
    if (userId && sub.id) {
      try {
        await upsertProSubscription(
          userId,
          sub.id,
          (sub.customer as string) || null,
          stripe
        );
      } catch (err) {
        console.error("Webhook subscription.created error:", err);
        return NextResponse.json({ error: "Subscription create sync failed" }, { status: 500 });
      }
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
