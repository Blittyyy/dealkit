"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Plan = "pro" | "pro_yearly";

export function CheckoutButton({
  plan,
  children,
  className,
  variant = "outline",
  ...props
}: {
  plan: Plan;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
} & React.ComponentProps<typeof Button>) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: user?.id ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      {...props}
      variant={variant}
      className={cn("w-full transition-interactive hover:scale-[1.02] hover:shadow-md", className)}
      disabled={loading || props.disabled}
      onClick={handleClick}
    >
      {loading ? "Redirecting…" : children}
    </Button>
  );
}
