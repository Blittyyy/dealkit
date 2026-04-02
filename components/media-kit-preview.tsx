"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, Package, Percent, TrendingUp, Quote, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlanFeatures } from "@/lib/plan-features";

function PerformanceMetricCard({
  label,
  value,
  icon,
  embedded,
}: {
  label: string;
  value?: string | null;
  icon: ReactNode;
  embedded?: boolean;
}) {
  const display = typeof value === "string" ? value.trim() : "";
  const hasValue = display.length > 0;

  const accent = (() => {
    switch (label) {
      case "CTR":
        return {
          iconBg: "bg-[#2563EB]/10",
          iconText: "text-[#2563EB]",
          valueText:
            "bg-gradient-to-r from-[#2563EB] to-[#3B6FFF] bg-clip-text text-transparent",
        };
      case "Retention":
        return {
          iconBg: "bg-[#7C3AED]/10",
          iconText: "text-[#7C3AED]",
          valueText:
            "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent",
        };
      case "ROAS":
        return {
          iconBg: "bg-[#16A34A]/10",
          iconText: "text-[#16A34A]",
          valueText:
            "bg-gradient-to-r from-[#16A34A] to-[#18B67A] bg-clip-text text-transparent",
        };
      default:
        return {
          iconBg: "bg-[#F1F5F9]",
          iconText: "text-primary/65",
          valueText: "text-primary",
        };
    }
  })();

  return (
    <div
      className={cn(
        "rounded-[18px] border bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_8px_30px_rgba(15,23,42,0.06)]",
        embedded
          ? "border-border-soft/60 p-7 sm:p-8"
          : "border-border-soft/70 p-5 sm:p-6"
      )}
    >
      <div className="flex items-center gap-2.5 mb-3.5">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
            embedded ? accent.iconBg : "bg-[#F1F5F9]",
            embedded ? accent.iconText : "text-primary/65"
          )}
        >
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted/60">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "font-extrabold tabular-nums tracking-tight leading-none",
          embedded
            ? "text-[2.45rem] sm:text-[2.75rem]"
            : "text-[1.75rem] sm:text-[2rem]",
          display ? (embedded ? accent.valueText : "text-primary") : "text-muted/20"
        )}
      >
        {hasValue ? display : "—"}
      </p>
      {embedded && !hasValue && (
        <p className="mt-2 text-[11px] text-muted/45 leading-snug">Add metrics in the editor</p>
      )}
    </div>
  );
}

export type MediaKitPreviewVideo = { url?: string | null; title?: string | null };
export type MediaKitPreviewPackage = {
  name?: string | null;
  price?: string | null;
  deliverables?: string | null;
};

export type MediaKitPreviewKit = {
  user_id?: string;
  avatar_url?: string | null;
  name?: string | null;
  niche?: string | null;
  bio?: string | null;
  ctr?: string | null;
  retention?: string | null;
  roas?: string | null;
  packages?: MediaKitPreviewPackage[] | null;
  videos?: MediaKitPreviewVideo[] | null;
  testimonial?: string | null;
};

export function MediaKitPreview({
  kit,
  features,
  variant = "public",
}: {
  kit: MediaKitPreviewKit;
  features: PlanFeatures;
  variant?: "public" | "embedded";
}) {
  const f = features;
  const isEmbedded = variant === "embedded";
  const campaignMailto = "mailto:hello@example.com?subject=Campaign%20inquiry";

  function parseDeliverables(deliverables?: string | null): string[] {
    const raw = (deliverables ?? "").trim();
    if (!raw) return [];
    const parts = raw
      .split(/[\n,•]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.slice(0, 4);
  }

  function domainFromUrl(url?: string | null): string | null {
    const raw = (url ?? "").trim();
    if (!raw) return null;
    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.replace(/^www\./, "");
      return host.length > 26 ? host.slice(0, 26) + "…" : host;
    } catch {
      return null;
    }
  }

  const packages = ((kit.packages ?? []) as MediaKitPreviewPackage[]).filter(
    (p) => (p.name ?? "").trim() || (p.price ?? "").trim()
  );

  let videos = ((kit.videos ?? []) as MediaKitPreviewVideo[]).filter(
    (v) => (v.url ?? "").trim()
  );
  videos = videos.slice(0, f.maxExampleVideos);

  const showPerformancePublic =
    f.showPerformanceOnPublicKit &&
    (!!kit.ctr || !!kit.retention || !!kit.roas);

  const showPerformance = isEmbedded ? true : showPerformancePublic;

  const displayName = (kit.name ?? "").trim();
  const displayNiche = (kit.niche ?? "").trim();
  const displayBio = (kit.bio ?? "").trim();
  const displayTestimonial = (kit.testimonial ?? "").trim();

  return (
    <div
      className={
        variant === "public"
          ? "min-h-screen bg-base flex flex-col"
          : "bg-white rounded-[18px]"
      }
    >
      {f.showDealKitHeaderOnPublicKit && (
        <header className="border-b border-border-soft bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <Link
              href="/"
              className="text-sm font-semibold text-brand hover:underline"
            >
              DealKit
            </Link>
          </div>
        </header>
      )}

      <main
        className={
          variant === "public"
            ? "max-w-3xl mx-auto px-6 py-16 space-y-20 flex-1"
            : "max-w-none px-8 py-12 sm:px-12 sm:py-16 space-y-16 sm:space-y-[4.5rem] flex-1"
        }
      >
        {/* ── Hero ── */}
        <section className="text-center">
          <div
            className={cn(
              "space-y-8 sm:space-y-10",
              isEmbedded &&
                "rounded-[26px] border border-border-soft/70 bg-gradient-to-b from-[#F7FAFF] via-white to-[#F6F7FB] px-6 sm:px-12 py-12 sm:py-14 shadow-[0_30px_70px_rgba(59,111,255,0.10),0_10px_26px_rgba(15,23,42,0.06)]"
            )}
          >
          <div className="flex justify-center pb-2 sm:pb-3">
            {kit.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={kit.avatar_url}
                alt={displayName || "Profile"}
                width={isEmbedded ? 140 : 120}
                height={isEmbedded ? 140 : 120}
                className={cn(
                  "rounded-full object-cover border-[3px] border-white shadow-[0_6px_28px_rgba(15,23,42,0.14),0_0_0_1px_rgba(15,23,42,0.04)]",
                  isEmbedded
                    ? "w-[132px] h-[132px] sm:w-[140px] sm:h-[140px]"
                    : "w-[120px] h-[120px]"
                )}
              />
            ) : (
              <div
                className={cn(
                  "rounded-full bg-gradient-to-br from-[#E8EEF5] to-[#D4DDE8] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]",
                  isEmbedded
                    ? "w-[132px] h-[132px] sm:w-[140px] sm:h-[140px]"
                    : "w-[120px] h-[120px]"
                )}
              >
                <span
                  className={cn(
                    "font-semibold text-primary/30",
                    isEmbedded ? "text-6xl sm:text-[2.85rem]" : "text-4xl"
                  )}
                >
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {displayName ? (
              <h1
                className={cn(
                  "font-extrabold text-primary tracking-[-0.03em] leading-[1.05]",
                  isEmbedded
                    ? "text-[2.35rem] sm:text-[3rem] lg:text-[3.25rem]"
                    : "text-[1.75rem] sm:text-[2.25rem]"
                )}
              >
                {displayName}
              </h1>
            ) : (
              <h1
                className={cn(
                  "font-semibold text-muted/35 tracking-[-0.02em] leading-tight",
                  isEmbedded ? "text-[2rem] sm:text-[2.5rem]" : "text-[1.75rem] sm:text-[2.25rem]"
                )}
              >
                Creator
              </h1>
            )}
            {displayNiche ? (
              <p
                className={
                  isEmbedded
                    ? "text-[11px] sm:text-[12px] text-muted/55 font-semibold tracking-[0.12em] uppercase"
                    : "text-[13px] sm:text-sm font-semibold uppercase tracking-wide text-brand/75"
                }
              >
                {displayNiche}
              </p>
            ) : (
              isEmbedded && (
                <p className="text-[13px] text-muted/35 font-medium tracking-wide">
                  Category and niche
                </p>
              )
            )}
          </div>

          {displayBio ? (
            <p
              className={cn(
                "mx-auto text-primary/75",
                isEmbedded
                    ? "max-w-lg text-[16px] sm:text-[17px] leading-[1.8] font-medium text-primary/80"
                  : "max-w-md text-[15px] leading-[1.75]"
              )}
            >
              {displayBio}
            </p>
          ) : (
            isEmbedded && (
              <p className="max-w-md mx-auto text-[14px] text-muted/45 leading-[1.7]">
                Add a short intro in the editor so brands know who you are.
              </p>
            )
          )}

          <div
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6",
              isEmbedded ? "pt-0" : "pt-1"
            )}
          >
            {(isEmbedded || f.showVerifiedBadgeOnPublicKit) && (
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-50/95 text-emerald-900 text-[11px] sm:text-xs font-semibold border border-emerald-200/80 shadow-[0_1px_10px_rgba(16,185,129,0.14)]">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Performance
              </span>
            )}

            <Button
              asChild
              size="lg"
              className={cn(
                "!bg-brand hover:!bg-brand/90 !text-white transition-[box-shadow,transform] duration-200 hover:-translate-y-px",
                isEmbedded
                  ? "!h-[3.35rem] !px-12 !text-base !font-semibold shadow-[0_12px_40px_rgba(59,111,255,0.35)] hover:shadow-[0_18px_56px_rgba(59,111,255,0.45)] !rounded-[16px]"
                  : "!h-12 !px-8 !text-[15px] !font-semibold shadow-[0_2px_12px_rgba(59,111,255,0.3)] hover:shadow-[0_4px_20px_rgba(59,111,255,0.35)]"
              )}
            >
              <a href={campaignMailto}>
                Book a campaign
              </a>
            </Button>
          </div>
          </div>
        </section>

        {/* ── Performance ── */}
        {showPerformance && (
          <section className={cn(isEmbedded && "pt-10 border-t border-[#E5E7EB]/70")}>
            <h2
              className={cn(
                isEmbedded
                  ? "mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-primary/45"
                  : "mb-5 text-xs font-semibold uppercase tracking-wider text-muted"
              )}
            >
              Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {isEmbedded ? (
                <>
                  <PerformanceMetricCard
                    label="CTR"
                    value={kit.ctr}
                    icon={<BarChart3 className="w-4 h-4" />}
                    embedded
                  />
                  <PerformanceMetricCard
                    label="Retention"
                    value={kit.retention}
                    icon={<Percent className="w-4 h-4" />}
                    embedded
                  />
                  <PerformanceMetricCard
                    label="ROAS"
                    value={kit.roas}
                    icon={<TrendingUp className="w-4 h-4" />}
                    embedded
                  />
                </>
              ) : (
                <>
                  {kit.ctr && (
                    <PerformanceMetricCard
                      label="CTR"
                      value={kit.ctr}
                      icon={<BarChart3 className="w-4 h-4" />}
                    />
                  )}
                  {kit.retention && (
                    <PerformanceMetricCard
                      label="Retention"
                      value={kit.retention}
                      icon={<Percent className="w-4 h-4" />}
                    />
                  )}
                  {kit.roas && (
                    <PerformanceMetricCard
                      label="ROAS"
                      value={kit.roas}
                      icon={<TrendingUp className="w-4 h-4" />}
                    />
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {/* ── Example content ── */}
        {(isEmbedded || videos.length > 0) && (
          <section className={cn(isEmbedded && "pt-10 border-t border-[#E5E7EB]/70")}>
            <h2
              className={cn(
                isEmbedded
                  ? "mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-primary/45"
                  : "mb-5 text-xs font-semibold uppercase tracking-wider text-muted"
              )}
            >
              Example Content
            </h2>
            {videos.length === 0 ? (
              <div
                className={cn(
                  "rounded-[20px] border border-dashed border-border-soft/80 bg-gradient-to-b from-[#F7FAFF] to-[#F4F6F9] px-8 py-16 text-center",
                  isEmbedded && "min-h-[200px] flex flex-col items-center justify-center"
                )}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white border border-border-soft/60 shadow-[0_4px_14px_rgba(15,23,42,0.06)] mb-6">
                  <Video className="w-6 h-6 text-muted/55" />
                </div>
                <p className="text-[16px] font-semibold text-primary/90">
                  Add your first example to showcase your work
                </p>
                <p className="mt-2 text-[13px] text-muted/60 max-w-sm mx-auto leading-relaxed">
                  Paste video links in the editor — they&#39;ll show up here as polished cards.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand/5 border border-brand/15 px-4 py-2 text-[12px] font-semibold text-brand/90 shadow-[0_1px_6px_rgba(59,111,255,0.10)]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">
                    +
                  </span>
                  Add an example above
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                {videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-[18px] border border-border-soft/60 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_36px_rgba(15,23,42,0.12)] hover:border-brand/25 transition-all duration-200 group"
                  >
                    <div className="rounded-[16px] border border-border-soft/70 bg-gradient-to-br from-[#F3F7FF] to-[#FAFAFB] overflow-hidden relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,111,255,0.22),transparent_48%)]" />
                      <div className="relative flex items-center justify-center h-[92px]">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/85 border border-border-soft/70 shadow-[0_8px_22px_rgba(15,23,42,0.10)]">
                          <Video className="w-5 h-5 text-brand" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[16px] text-primary group-hover:text-brand transition-colors truncate">
                          {video.title?.trim() || "Example video"}
                        </p>
                        <p className="mt-1 text-xs text-muted/60 truncate">
                          {domainFromUrl(video.url) ?? video.url}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/[0.08] text-brand text-sm font-medium group-hover:bg-brand group-hover:text-white transition-colors shadow-[0_1px_8px_rgba(59,111,255,0.10)]">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Packages ── */}
        {(isEmbedded || packages.length > 0) && (
          <section className={cn(isEmbedded && "pt-10 border-t border-[#E5E7EB]/70")}>
            <h2
              className={cn(
                isEmbedded
                  ? "mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-primary/45"
                  : "mb-5 text-xs font-semibold uppercase tracking-wider text-muted"
              )}
            >
              Packages
            </h2>
            {packages.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border-soft/80 bg-gradient-to-b from-[#F7FAFF] to-[#F4F6F9] px-8 py-14 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white border border-border-soft/60 shadow-[0_4px_14px_rgba(15,23,42,0.06)] mb-6">
                  <Package className="w-6 h-6 text-muted/55" />
                </div>
                <p className="text-[15px] font-semibold text-primary/85">
                  Packages will appear here once added
                </p>
                <p className="mt-2 text-[13px] text-muted/55 max-w-xs mx-auto leading-relaxed">
                  Add offers and pricing in the editor to show them on your public kit.
                </p>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {packages.map((pkg, i) => {
                  const deliverables = parseDeliverables(pkg.deliverables);
                  return (
                    <div
                      key={i}
                      className="rounded-[18px] border border-border-soft/60 bg-white p-6 sm:p-7 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[16px] sm:text-[17px] text-primary">
                            {pkg.name?.trim() || "Package"}
                          </h3>

                          {deliverables.length > 0 ? (
                            <ul className="mt-3 space-y-2">
                              {deliverables.map((d, di) => (
                                <li
                                  key={`${i}-${di}`}
                                  className="flex items-start gap-2 text-[13px] text-muted/70 leading-relaxed"
                                >
                                  <span className="mt-[6px] inline-flex h-2 w-2 rounded-full bg-brand/40" />
                                  <span className="min-w-0">{d}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-[13px] text-muted/55 leading-relaxed">
                              Add deliverables in the editor to show what brands get.
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          {pkg.price?.trim() ? (
                            <>
                              <p className="text-[30px] sm:text-[34px] font-extrabold text-brand tabular-nums tracking-tight leading-none">
                                {pkg.price}
                              </p>
                              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted/55">
                                Starting at
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted/45 shrink-0">Add price</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Testimonial (embedded: always show section; public: only when content) ── */}
        {(isEmbedded || displayTestimonial) && (
          <section className={cn(isEmbedded && "pt-10 border-t border-[#E5E7EB]/70")}>
            <h2
              className={cn(
                isEmbedded
                  ? "mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-primary/45"
                  : "text-xs font-bold uppercase tracking-[0.08em] text-primary/50 mb-6"
              )}
            >
              Testimonial
            </h2>
            {displayTestimonial ? (
              <blockquote className="relative rounded-[20px] bg-gradient-to-b from-[#FAFBFC] to-white border border-border-soft/70 p-7 sm:p-9 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="absolute -top-2 left-7 text-brand text-4xl font-serif leading-none select-none opacity-90">
                  &ldquo;
                </div>
                <p className="text-[15px] sm:text-[16px] text-primary/80 leading-[1.85] pt-3 font-medium">
                  {displayTestimonial}
                </p>
              </blockquote>
            ) : (
              isEmbedded && (
                <div className="rounded-[20px] border border-dashed border-border-soft/80 bg-gradient-to-b from-[#F7FAFF] to-[#F4F6F9] px-8 py-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-border-soft/70 shadow-[0_10px_30px_rgba(59,111,255,0.10)] mb-5">
                    <Quote className="w-5 h-5 text-muted/50" />
                  </div>
                  <p className="text-[15px] font-semibold text-primary/85">Social proof, when you have it</p>
                  <p className="mt-2 text-[13px] text-muted/55 max-w-sm mx-auto leading-relaxed">
                    Add a quote from a brand or client in the editor — it will show here.
                  </p>
                </div>
              )
            )}
          </section>
        )}

        {/* ── Bottom conversion CTA (embedded only) ── */}
        {isEmbedded && (
          <section className="pt-10 border-t border-[#E5E7EB]/70">
            <div className="rounded-[22px] border border-border-soft/60 bg-gradient-to-b from-[#F7FAFF] via-white to-[#F6F7FB] p-6 sm:p-8 shadow-[0_18px_50px_rgba(59,111,255,0.10)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[16px] sm:text-[18px] font-extrabold text-primary tracking-tight">
                    Response time: {"<"} 24 hours
                  </p>
                </div>

                <div className="shrink-0">
                  <Button
                    asChild
                    size="lg"
                    className="!h-[3.6rem] !px-10 !text-base !font-semibold shadow-[0_10px_34px_rgba(59,111,255,0.35)] hover:shadow-[0_14px_46px_rgba(59,111,255,0.45)] !rounded-[16px]"
                  >
                    <a href={campaignMailto}>Book a campaign</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {f.showBuiltWithFooterOnPublicKit && (
        <footer className="border-t border-border-soft py-8">
          <p className="text-center text-sm text-muted">
            Built with{" "}
            <Link href="/" className="font-medium text-brand hover:underline">
              DealKit
            </Link>
          </p>
        </footer>
      )}
    </div>
  );
}
