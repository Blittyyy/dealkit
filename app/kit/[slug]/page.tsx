import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PackageItem = { name?: string; price?: string; deliverables?: string };
type VideoItem = { url?: string; title?: string };

export default async function PublicKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: kit } = await supabase
    .from("kits")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!kit) notFound();

  const packages = (kit.packages ?? []) as PackageItem[];
  const videos = ((kit.videos ?? []) as VideoItem[]).filter((v) => v?.url);

  return (
    <div className="min-h-screen bg-base">
      {/* Header with DealKit wordmark */}
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

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-20">
        {/* Section 1 — Hero */}
        <section className="text-center space-y-6">
          <div className="flex justify-center">
            {kit.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={kit.avatar_url}
                alt={kit.name}
                width={120}
                height={120}
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-border-soft flex items-center justify-center">
                <span className="text-4xl font-semibold text-muted">
                  {kit.name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              {kit.name}
            </h1>
            {kit.niche && (
              <p className="mt-2 text-brand font-medium">{kit.niche}</p>
            )}
          </div>
          {kit.bio && (
            <p className="max-w-xl mx-auto text-[15px] text-muted leading-relaxed">
              {kit.bio}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified Performance
            </span>
            <Button asChild size="lg" className="!bg-brand hover:!bg-brand/90">
              <a href="mailto:hello@example.com?subject=Campaign inquiry">
                Book a campaign
              </a>
            </Button>
          </div>
        </section>

        {/* Section 2 — Performance Metrics */}
        {(kit.ctr || kit.retention || kit.roas) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {kit.ctr && (
                <div className="rounded-[14px] border border-border-soft bg-white p-6 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    CTR
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-bold text-primary">
                    {kit.ctr}
                  </p>
                </div>
              )}
              {kit.retention && (
                <div className="rounded-[14px] border border-border-soft bg-white p-6 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    Hook retention
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-bold text-primary">
                    {kit.retention}
                  </p>
                </div>
              )}
              {kit.roas && (
                <div className="rounded-[14px] border border-border-soft bg-white p-6 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    ROAS
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-bold text-primary">
                    {kit.roas}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 3 — Packages */}
        {packages.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Packages
            </h2>
            <div className="space-y-4">
              {packages.map((pkg, i) => (
                <div
                  key={i}
                  className="rounded-[14px] border border-border-soft bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-primary">
                      {pkg.name || "Package"}
                    </h3>
                    {pkg.deliverables && (
                      <p className="mt-1 text-sm text-muted">{pkg.deliverables}</p>
                    )}
                  </div>
                  {pkg.price && (
                    <p className="text-lg font-bold text-brand shrink-0">
                      {pkg.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4 — Example Content (Videos) */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Example content
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block rounded-[14px] border border-border-soft bg-white p-5 shadow-sm",
                    "hover:border-brand/40 hover:shadow-md transition-all",
                    "group"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-primary group-hover:text-brand transition-colors truncate">
                        {video.title || "Watch video"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted truncate">
                        {video.url}
                      </p>
                    </div>
                    <span className="shrink-0 text-brand text-sm font-medium">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Section 5 — Testimonial */}
        {kit.testimonial && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Testimonial
            </h2>
            <blockquote className="relative pl-6 border-l-4 border-brand">
              <p className="text-lg text-primary leading-relaxed italic">
                &ldquo;{kit.testimonial}&rdquo;
              </p>
            </blockquote>
          </section>
        )}
      </main>
    </div>
  );
}
