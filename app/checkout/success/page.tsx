import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/15 flex items-center justify-center">
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
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Thank you for subscribing
        </h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Your payment was successful. You now have full access to DealKit.
        </p>
        <Button asChild className="mt-8">
          <Link href="/app/builder">Go to media kit builder</Link>
        </Button>
      </div>
    </div>
  );
}
