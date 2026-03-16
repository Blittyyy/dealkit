import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { Briefcase, ShieldCheck, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-base py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-[2.7rem] md:text-[3.65rem] font-bold text-primary tracking-tight leading-[1.04]">
              <span className="block">Close More</span>
              <span className="block">DTC Brand Deals.</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              Present your CTR, retention, and ROAS in a format brands instantly trust.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="default" size="lg" asChild>
                <Link href="#cta">Build your media kit</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how">See how it works</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Built for performance-driven DTC creators.
            </p>
            <p className="mt-1 text-sm text-muted">
              Cleaner. Stronger. Identity-based.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Very subtle radial highlight behind dashboard only */}
              <div
                className="absolute inset-0 rounded-[12px] pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
                aria-hidden
              />
              {/* Product Preview — dark card with browser chrome */}
              <div
                className="relative rounded-[12px] bg-dark overflow-hidden"
                style={{
                  boxShadow: "0px 30px 60px -15px rgba(15, 17, 21, 0.5)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  transform: "translateY(4px)",
                }}
              >
              {/* Browser window bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-dark">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-xs text-muted">DealKit Dashboard</span>
                <div className="flex items-center gap-1.5 rounded-[9999px] bg-success px-2.5 py-1">
                  <Check className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">Verified Performance</span>
                </div>
              </div>
              {/* Main content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white">DealKit</h3>
                <p className="text-xs text-muted uppercase tracking-wider mt-0.5">Performance Overview</p>
                {/* Metrics — two lighter dark panels */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[10px] bg-white/[0.08] p-4">
                    <p className="text-xs text-muted uppercase tracking-wider">CTR</p>
                    <p className="mt-1 text-[2rem] font-bold text-white tracking-tight">
                      3.4x <span className="text-success text-xl">+</span>
                    </p>
                  </div>
                  <div className="rounded-[10px] bg-white/[0.08] p-4 relative min-h-[128px]">
                    {/* Metric content constrained left so chip never covers 48.2% */}
                    <div className="pr-[110px]">
                      <p className="text-xs text-muted uppercase tracking-wider">Hook Retention</p>
                      <p className="mt-1 text-2xl font-bold text-white">48.2%</p>
                    </div>
                    {/* Floating chip — slightly larger, soft green glow only */}
                    <div
                      className="absolute bottom-2 right-2 rounded-[8px] border border-white/10 bg-[#1a1d24] px-2.5 py-2 shadow-sm w-[100px]"
                      style={{ boxShadow: "0 0 14px rgba(24, 182, 122, 0.18)" }}
                    >
                      <p className="text-base font-bold text-success leading-tight">
                        <CountUp value={32} prefix="+" suffix="%" duration={1000} className="text-base font-bold text-success leading-tight" />
                      </p>
                      <p className="text-xs text-white leading-tight mt-0.5">Higher Close Rate</p>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-success" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Package rows */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between rounded-[10px] bg-white/[0.06] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-white" />
                      <span className="text-sm font-medium text-white">Premium Package</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">$8,000</span>
                      <span className="text-xs text-muted">/mo</span>
                      <span className="rounded-[9999px] border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-muted">Goal: 50/month</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-[10px] bg-white/[0.06] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium text-white">Verified Performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">$5,000</span>
                      <span className="text-xs text-muted">/mo</span>
                      <span className="rounded-[9999px] border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-muted">Goal: 30/month</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
