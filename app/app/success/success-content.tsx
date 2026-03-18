"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

/**
 * No useSearchParams — it triggers static prerender failures on Vercel even with Suspense.
 * Read ?slug= from the URL on the client after mount.
 */
export default function SuccessContent() {
  const router = useRouter();
  /** undefined = not hydrated yet; null = no slug; string = kit slug */
  const [slug, setSlug] = useState<string | null | undefined>(undefined);
  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug"));
  }, []);

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#3B6FFF", "#18B67A", "#F7B731"],
    });
  }, []);

  useEffect(() => {
    if (slug === null) {
      router.replace("/app/builder");
    }
  }, [slug, router]);

  useEffect(() => {
    if (!slug) return;
    if (countdown <= 0) {
      router.replace(`/kit/${slug}`);
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [slug, countdown, router]);

  async function handleCopy() {
    if (!slug) return;
    const url = `${window.location.origin}/kit/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayUrl =
    typeof window !== "undefined" && slug
      ? `${window.location.host}/kit/${slug}`
      : slug
        ? `/kit/${slug}`
        : "";

  if (slug === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
        }}
      >
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!slug) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
        }}
      >
        <p className="text-sm text-muted">Redirecting…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.2), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
      }}
    >
      <div className="rounded-[18px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/5 p-8 lg:p-12 max-w-md w-full text-center animate-success-pop">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium mb-6">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Media kit created
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Your media kit is live.
        </h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Your media kit is live and ready to share with brands.
        </p>
        <div className="mt-8 p-4 rounded-[12px] bg-base/50 border border-border-soft">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Your link
          </p>
          <p className="text-base font-mono font-medium text-primary break-all">
            {displayUrl}
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/kit/${slug}`}>View my media kit</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className={`flex-1 min-w-[120px] transition-colors ${copied ? "border-success text-success" : ""}`}
          >
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted animate-pulse-soft">
          Redirecting to your media kit in {countdown} seconds…
        </p>
      </div>
    </div>
  );
}
