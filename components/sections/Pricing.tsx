import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout-button";
import { Check } from "lucide-react";

const freeFeatures = [
  "1 media kit",
  "Public creator page",
  "Up to 3 example videos",
  "Packages section",
  "Basic creator profile",
  "DealKit branding",
];

const proFeatures = [
  "Everything in Free",
  "Unlimited example videos",
  "Remove DealKit branding",
  "Custom kit slug",
  "Advanced performance metrics for brands",
  "Priority support",
];

export function Pricing() {
  return (
    <section className="bg-base py-[4.5rem]" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-muted text-center max-w-xl mx-auto">
          Start free, then upgrade when you&apos;re ready to share a more polished kit with brands.
        </p>
        <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-border-soft shadow-sm transition-interactive hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader>
              <h3 className="font-semibold text-lg text-primary">Free</h3>
              <p className="text-[1.9rem] md:text-[2rem] font-bold text-primary mt-1">
                $0
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-primary">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full transition-interactive hover:scale-[1.02] hover:shadow-md" asChild>
                <Link href="/signup">Start free</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-2 border-brand/80 shadow-[0_4px_14px_rgba(59,111,255,0.12)] bg-white transition-interactive hover:-translate-y-0.5 hover:shadow-lg relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <span className="rounded-[9999px] bg-brand px-2.5 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <CardHeader className="pt-7">
              <h3 className="font-semibold text-lg text-primary">Pro</h3>
              <p className="text-[1.9rem] md:text-[2rem] font-bold text-primary mt-1">
                $9 <span className="text-base font-normal text-muted">/ month</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                or $79 / year (Save 27%)
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-primary">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <CheckoutButton plan="pro" variant="default">
                Upgrade your kit
              </CheckoutButton>
              <CheckoutButton plan="pro_yearly" variant="outline" className="!h-9 text-xs">
                Save 27% — Pay yearly
              </CheckoutButton>
            </CardFooter>
          </Card>
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          No contracts. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
