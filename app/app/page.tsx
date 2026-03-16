"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function CongratulationsPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Confetti burst on mount
    const fireConfetti = () => {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#3B6FFF", "#18B67A", "#F7B731", "#EB4D4B"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3B6FFF", "#18B67A", "#F7B731", "#EB4D4B"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      // Extra center burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#3B6FFF", "#18B67A", "#F7B731"],
        });
      }, 200);
    };

    fireConfetti();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.replace("/app/builder");
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.2), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
      }}
    >
      <div className="rounded-[18px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/5 p-8 lg:p-10 max-w-md w-full text-center animate-success-pop">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-success/15 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-[1.75rem] font-semibold text-primary tracking-tight">
          Congratulations!
        </h1>
        <p className="mt-2 text-[15px] text-muted/90 leading-relaxed">
          Your account is ready. You&apos;re now in DealKit.
        </p>
        <div className="mt-6 pt-6 border-t border-border-soft">
          <p className="text-sm text-muted animate-pulse-soft">
            Redirecting to your media kit in {countdown}…
          </p>
          <Link
            href="/app/builder"
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Go now →
          </Link>
        </div>
      </div>
    </div>
  );
}
