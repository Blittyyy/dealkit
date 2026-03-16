import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function MediaKitPreview() {
  return (
    <section className="bg-base pt-8 pb-20" id="output-preview">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center">
          {/* Centered media kit preview card */}
          <div
            className="rounded-[12px] border border-border-soft bg-white p-5 md:p-6 w-full max-w-[420px]"
            style={{
              boxShadow: "0 8px 32px -6px rgba(0, 0, 0, 0.10), 0 2px 8px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 flex-wrap">
              <Image
                src="/jordan-lee.png"
                alt="Jordan Lee"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary">Jordan Lee</p>
                <p className="text-xs text-muted mt-0.5">DTC UGC Creator • Paid Ads</p>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-[9999px] bg-success px-2 py-0.5 text-[10px] font-medium text-white shrink-0"
                style={{ boxShadow: "0 2px 6px rgba(24, 182, 122, 0.2)" }}
              >
                <Check className="h-2.5 w-2.5" />
                Verified Performance
              </span>
            </div>

            <Separator className="my-4" />

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[10px] border border-border-soft bg-base/50 p-2.5">
                <p className="text-[9px] text-muted/70 uppercase tracking-wider">CTR</p>
                <p className="mt-0.5 text-base font-bold text-primary">3.4x <span className="text-success text-xs">+</span></p>
              </div>
              <div className="rounded-[10px] border border-border-soft bg-base/50 p-2.5 relative">
                <p className="text-[9px] text-muted/70 uppercase tracking-wider">Hook Retention</p>
                <p className="mt-0.5 text-base font-bold text-primary">48.2%</p>
                <span className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-success/15 text-success px-1 py-0.5 text-[9px] font-semibold">+32%</span>
              </div>
              <div className="rounded-[10px] border border-border-soft bg-base/50 p-2.5">
                <p className="text-[9px] text-muted/70 uppercase tracking-wider">Avg ROAS</p>
                <p className="mt-0.5 text-base font-bold text-primary">$42,500</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Packages */}
            <div>
              <h3 className="text-xs font-semibold text-primary">Packages</h3>
              <div className="mt-2 space-y-0 divide-y divide-border-soft">
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-medium text-primary">Premium UGC Package</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">$8,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-medium text-primary">Growth Package</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">$5,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-medium text-primary">Starter Package</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">$2,500</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Recent Work */}
            <div>
              <h3 className="text-xs font-semibold text-primary">Recent Work</h3>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-[8px] border border-border-soft bg-base/60 flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 text-muted" fill="currentColor" />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Testimonial */}
            <div>
              <h3 className="text-xs font-semibold text-primary">What brands say</h3>
              <blockquote className="mt-1.5 text-xs italic text-primary leading-relaxed">
                &ldquo;Clear performance breakdown. Easy yes.&rdquo;
              </blockquote>
              <p className="mt-0.5 text-[10px] text-muted">— Growth Lead, Skincare Brand</p>
            </div>

            {/* Bottom CTA */}
            <div className="mt-5 pt-4 border-t border-border-soft">
              <Button variant="default" size="sm" className="w-full h-9 text-sm" asChild>
                <Link href="#cta">Book a campaign</Link>
              </Button>
              <p className="mt-1.5 text-center text-[10px] text-muted">Response time: &lt; 24 hours</p>
            </div>
          </div>

          {/* Bullet points below the card */}
          <ul className="mt-10 flex flex-col items-center space-y-3 max-w-md">
            <li className="flex items-center gap-2 text-primary text-sm justify-center sm:justify-start w-full sm:w-auto">
              <Check className="h-5 w-5 text-success shrink-0" strokeWidth={2.5} />
              Verified performance metrics (CTR, retention, ROAS)
            </li>
            <li className="flex items-center gap-2 text-primary text-sm justify-center sm:justify-start w-full sm:w-auto">
              <Check className="h-5 w-5 text-success shrink-0" strokeWidth={2.5} />
              Structured packages that make pricing feel obvious
            </li>
            <li className="flex items-center gap-2 text-primary text-sm justify-center sm:justify-start w-full sm:w-auto">
              <Check className="h-5 w-5 text-success shrink-0" strokeWidth={2.5} />
              One link you can send in every pitch
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
