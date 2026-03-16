"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AppNavbar() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="bg-base border-b border-border-soft">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-primary text-lg tracking-tight">
          DealKit
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/app/builder"
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Media Kit Builder
          </Link>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </nav>
    </header>
  );
}
