"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <header className="bg-base border-b border-border-soft">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center">
        <div className="flex-1 flex items-center">
          <Link href="/" className="font-semibold text-primary text-lg tracking-tight">
            DealKit
          </Link>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="/#product" className="text-sm text-muted hover:text-primary transition-colors">
            Product
          </Link>
          <Link href="/#customers" className="text-sm text-muted hover:text-primary transition-colors">
            Customers
          </Link>
          <Link href="/#pricing" className="text-sm text-muted hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-3">
          {!loading && (
            user ? (
              <>
                <Button variant="ghost" size="default" asChild>
                  <Link href="/app/builder">Dashboard</Link>
                </Button>
                <Button variant="outline" size="default" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="default" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )
          )}
          <Button variant="default" size="default" asChild>
            <Link href={user ? "/app/builder" : "/#cta"}>Start building kits</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
