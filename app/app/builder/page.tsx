"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugFromName } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "@/components/avatar-upload";
import { cn } from "@/lib/utils";
import { fetchUserPlan, type UserPlan } from "@/lib/subscription";
import { getPlanFeatures } from "@/lib/plan-features";
import { MediaKitPreview } from "@/components/media-kit-preview";
import {
  BarChart3,
  Check,
  ChevronDown,
  MoreHorizontal,
  Package as PackageIcon,
  Plus,
  Quote,
  Settings,
  User as UserIcon,
  Video as VideoIcon,
} from "lucide-react";

const BIO_MAX_LENGTH = 120;

type PackageItem = { name: string; price: string };
type VideoItem = { url: string; title: string };

export default function MediaKitBuilderPage() {
  const router = useRouter();
  const [draftLoading, setDraftLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [customSlug, setCustomSlug] = useState("");
  const previewPanelRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("profile");

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [ctr, setCtr] = useState("");
  const [retention, setRetention] = useState("");
  const [roas, setRoas] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([{ name: "", price: "" }]);
  const [videos, setVideos] = useState<VideoItem[]>([{ url: "", title: "" }]);
  const [testimonial, setTestimonial] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setCheckingAuth(false);
      if (!session) {
        router.replace("/login");
        setPlanLoading(false);
        return;
      }
      const plan = await fetchUserPlan(supabase, session.user.id);
      setUserPlan(plan);
      setPlanLoading(false);
    });
  }, [router]);

  useEffect(() => {
    async function refreshPlan() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const p = await fetchUserPlan(supabase, session.user.id);
        setUserPlan(p);
      }
    }
    function onVis() {
      if (document.visibilityState === "visible") void refreshPlan();
    }
    window.addEventListener("focus", refreshPlan);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", refreshPlan);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const loadExistingKit = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: kit } = await supabase
      .from("kits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (kit) {
      setCustomSlug((kit.slug as string) ?? "");
      setName(kit.name ?? "");
      setAvatarUrl(kit.avatar_url ?? "");
      setNiche(kit.niche ?? "");
      setBio(kit.bio ?? "");
      setCtr(kit.ctr ?? "");
      setRetention(kit.retention ?? "");
      setRoas(kit.roas ?? "");
      setPackages(
        Array.isArray(kit.packages) && kit.packages.length > 0
          ? kit.packages.map((p: { name?: string; price?: string }) => ({
              name: p.name ?? "",
              price: p.price ?? "",
            }))
          : [{ name: "", price: "" }]
      );
      setVideos(
        Array.isArray(kit.videos) && kit.videos.length > 0
          ? kit.videos.map((v: { url?: string; title?: string }) => ({
              url: v.url ?? "",
              title: v.title ?? "",
            }))
          : [{ url: "", title: "" }]
      );
      setTestimonial(kit.testimonial ?? "");
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadExistingKit();
  }, [checkingAuth, loadExistingKit]);

  function addPackage() {
    setPackages((p) => [...p, { name: "", price: "" }]);
  }

  function removePackage(i: number) {
    setPackages((p) => (p.length > 1 ? p.filter((_, j) => j !== i) : p));
  }

  function updatePackage(i: number, field: keyof PackageItem, value: string) {
    setPackages((p) =>
      p.map((item, j) => (j === i ? { ...item, [field]: value } : item))
    );
  }

  function addVideo() {
    const plan = userPlan ?? "free";
    const maxV = getPlanFeatures(plan).maxExampleVideos;
    if (videos.length >= maxV) {
      if (plan === "free") {
        setError("Free plan allows up to 3 example videos. Upgrade to Pro for more.");
      }
      return;
    }
    setError(null);
    setVideos((v) => [...v, { url: "", title: "" }]);
  }

  function removeVideo(i: number) {
    setVideos((v) => (v.length > 1 ? v.filter((_, j) => j !== i) : v));
  }

  function updateVideo(i: number, field: keyof VideoItem, value: string) {
    setVideos((v) =>
      v.map((item, j) => (j === i ? { ...item, [field]: value } : item))
    );
  }

  async function findAvailableSlug(
    supabase: ReturnType<typeof createClient>,
    baseSlug: string,
    excludeSlug?: string
  ): Promise<string> {
    const { data: rows } = await supabase
      .from("kits")
      .select("slug")
      .or(`slug.eq.${baseSlug},slug.ilike.${baseSlug}-%`);

    let slugs = (rows ?? []).map((r) => r.slug);
    if (excludeSlug) {
      slugs = slugs.filter((s) => s !== excludeSlug);
    }

    if (slugs.length === 0) return baseSlug;

    const suffixes = slugs
      .filter((s) => s.startsWith(`${baseSlug}-`))
      .map((s) => {
        const num = parseInt(s.replace(`${baseSlug}-`, ""), 10);
        return isNaN(num) ? 0 : num;
      });

    const maxSuffix = Math.max(0, ...suffixes);
    return `${baseSlug}-${maxSuffix + 1}`;
  }

  async function saveKit(isPublish: boolean) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to save.");
      router.replace("/login");
      return { success: false };
    }

    const plan = await fetchUserPlan(supabase, user.id);
    setUserPlan(plan);
    const f = getPlanFeatures(plan);

    let videosPayload = videos
      .filter((v) => v.url.trim())
      .map((v) => ({ url: v.url.trim(), title: v.title.trim() }));
    if (videosPayload.length > f.maxExampleVideos) {
      videosPayload = videosPayload.slice(0, f.maxExampleVideos);
    }

    const packagesPayload = packages
      .filter((p) => p.name.trim())
      .map((p) => ({ name: p.name.trim(), price: p.price.trim() }));

    const basePayload = {
      user_id: user.id,
      name: name.trim() || "My Media Kit",
      avatar_url: avatarUrl.trim() || null,
      niche: niche.trim() || null,
      bio: bio.trim() || null,
      ctr: f.showAdvancedPerformanceInBuilder ? ctr.trim() || null : null,
      retention: f.showAdvancedPerformanceInBuilder ? retention.trim() || null : null,
      roas: f.showAdvancedPerformanceInBuilder ? roas.trim() || null : null,
      packages: packagesPayload,
      videos: videosPayload,
      testimonial: testimonial.trim() || null,
      is_published: isPublish,
    };

    const { data: existing } = await supabase
      .from("kits")
      .select("id, slug, published_at")
      .eq("user_id", user.id)
      .maybeSingle();

    let slug: string;
    if (f.canCustomizeSlug) {
      const desired = slugFromName(customSlug.trim() || name || "kit");
      if (desired.length < 2) {
        throw new Error("Kit URL must be at least 2 characters.");
      }
      const { data: taken } = await supabase
        .from("kits")
        .select("id")
        .eq("slug", desired)
        .maybeSingle();
      if (taken && taken.id !== existing?.id) {
        throw new Error("That kit URL is already taken. Try another.");
      }
      slug = desired;
    } else if (existing) {
      slug = existing.slug as string;
    } else {
      slug = await findAvailableSlug(supabase, slugFromName(name || "kit"));
    }

    const payload = {
      ...basePayload,
      slug,
      ...(isPublish && { published_at: existing?.published_at ?? new Date().toISOString() }),
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from("kits")
        .update(payload)
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("kits")
        .insert(payload);
      if (insertError) throw insertError;
    }

    setCustomSlug(slug);
    return { success: true, slug };
  }

  function validateRequired() {
    if (!avatarUrl?.trim()) {
      setError("Profile photo is required.");
      return false;
    }
    if (!niche?.trim()) {
      setError("Niche is required.");
      return false;
    }
    return true;
  }

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDraftSuccess(false);
    if (!validateRequired()) return;
    setDraftLoading(true);
    try {
      await saveKit(false);
      setDraftSuccess(true);
      setTimeout(() => setDraftSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setDraftLoading(false);
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateRequired()) return;
    setPublishLoading(true);
    try {
      const result = await saveKit(true);
      router.replace(`/app/success${result.slug ? `?slug=${encodeURIComponent(result.slug)}` : ""}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish media kit.");
    } finally {
      setPublishLoading(false);
    }
  }

  const planId = userPlan ?? "free";
  const f = getPlanFeatures(planId);
  const isBusy = draftLoading || publishLoading;

  const completionPercent = (() => {
    const hasAvatar = !!avatarUrl.trim();
    const hasName = !!name.trim();
    const hasNiche = !!niche.trim();
    const hasBio = !!bio.trim();
    const hasVideo = videos.some((v) => v.url.trim());
    const hasPackage = packages.some((p) => p.name.trim() && p.price.trim());

    const perfParts = f.showAdvancedPerformanceInBuilder ? 3 : 0;
    const perfScore =
      f.showAdvancedPerformanceInBuilder
        ? [ctr, retention, roas].filter((x) => x.trim()).length
        : 0;

    const hasTestimonial = !!testimonial.trim();

    const partsTotal = 4 + 1 + 1 + perfParts + 1;
    const score =
      (hasAvatar ? 1 : 0) +
      (hasName ? 1 : 0) +
      (hasNiche ? 1 : 0) +
      (hasBio ? 1 : 0) +
      (hasVideo ? 1 : 0) +
      (hasPackage ? 1 : 0) +
      perfScore +
      (hasTestimonial ? 1 : 0);

    if (partsTotal <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((score / partsTotal) * 100)));
  })();

  const previewKit = {
    avatar_url: avatarUrl.trim() || null,
    name: name.trim() || null,
    niche: niche.trim() || null,
    bio: bio.trim() || null,
    ctr: ctr.trim() || null,
    retention: retention.trim() || null,
    roas: roas.trim() || null,
    videos: videos.map((v) => ({ url: v.url, title: v.title })),
    packages: packages.map((p) => ({ name: p.name, price: p.price })),
    testimonial: testimonial.trim() || null,
  };

  function jumpToSection(sectionId: string) {
    setActiveSection(sectionId);
    setTimeout(() => {
      document
        .getElementById(`builder-section-${sectionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  if (checkingAuth || planLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(circle at 12% 8%, rgba(37,99,235,0.14), transparent 52%), radial-gradient(circle at 88% 22%, rgba(37,99,235,0.08), transparent 46%), linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)",
        }}
      >
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  const sectionIcon = (id: string) => {
    const cls = "w-4 h-4";
    switch (id) {
      case "profile": return <UserIcon className={cls} />;
      case "performance": return <BarChart3 className={cls} />;
      case "content": return <VideoIcon className={cls} />;
      case "packages": return <PackageIcon className={cls} />;
      case "testimonial": return <Quote className={cls} />;
      default: return null;
    }
  };

  const sectionColors: Record<string, string> = {
    profile: "bg-brand/10 text-brand",
    performance: "bg-emerald-500/10 text-emerald-600",
    content: "bg-violet-500/10 text-violet-600",
    packages: "bg-amber-500/10 text-amber-600",
    testimonial: "bg-pink-500/10 text-pink-600",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 18% 0%, rgba(37,99,235,0.14), transparent 52%), radial-gradient(ellipse at 92% 18%, rgba(99,102,241,0.10), transparent 46%), linear-gradient(180deg, #FFFFFF 0%, #F6F9FF 100%)",
      }}
    >
      {/* ─── Top bar ─── */}
      <div className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border-soft/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-5">
          <Link href="/" className="text-sm font-bold text-primary tracking-tight shrink-0">
            DealKit
          </Link>

          <div className="flex-1 flex items-center justify-center gap-3">
            {completionPercent > 0 && (
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-success shrink-0 shadow-[0_0_10px_rgba(24,182,122,0.22)]">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
            )}
            <span className="text-[13px] text-primary/60 whitespace-nowrap font-medium">
              Your kit is {completionPercent}% complete
            </span>
            <div className="w-36 h-2.5 bg-slate-900/[0.06] rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-brand rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={handleSaveDraft}
              className="h-9 border-border-soft/80 bg-white/70 text-primary/70 hover:bg-white hover:text-primary transition-all duration-200 shadow-[0_1px_10px_rgba(15,23,42,0.04)]"
            >
              {draftLoading ? "Saving…" : "Save draft"}
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={isBusy}
              onClick={handlePublish}
              className="h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-[0_1px_14px_rgba(37,99,235,0.28)] hover:shadow-[0_2px_18px_rgba(37,99,235,0.38)] transition-all duration-200"
            >
              {publishLoading ? "Publishing…" : "Generate my media kit"}
            </Button>

            <button
              type="button"
              className="p-2 rounded-lg hover:bg-slate-900/[0.04] text-primary/35 hover:text-primary/60 transition-all duration-200"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main layout: sidebar (narrow) | editor (~30%) | preview (~70%) ─── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ─── Sidebar (secondary) ─── */}
          <aside className="order-3 lg:order-none lg:col-span-2 rounded-[16px] p-3.5 sm:p-4 lg:sticky lg:top-[76px] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.70))] text-primary shadow-[0_14px_44px_rgba(15,23,42,0.10)] backdrop-blur-md">
            <nav className="space-y-0.5">
              {(["profile", "performance", "content", "packages", "testimonial"] as const).map(
                (id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => jumpToSection(id)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-[10px] pl-2.5 pr-2.5 py-2 text-[12px] font-medium text-left transition-all duration-200 capitalize",
                      activeSection === id
                        ? "bg-[#2563EB]/[0.10] text-[#2563EB] shadow-[0_1px_10px_rgba(37,99,235,0.10)]"
                        : "text-primary/55 hover:bg-slate-900/[0.03] hover:text-primary/80"
                    )}
                  >
                    <span className="w-4 h-4 shrink-0 opacity-70">{sectionIcon(id)}</span>
                    {id}
                  </button>
                )
              )}
              <div className="pt-0.5">
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[12px] font-medium opacity-35 cursor-not-allowed text-primary/45"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Design (Coming soon)
                </button>
              </div>
            </nav>

            <div className="mt-5 pt-4 border-t border-slate-900/[0.06]">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 h-9 rounded-[10px] border border-dashed border-slate-900/[0.14] text-[11px] font-medium text-primary/45 hover:text-primary/70 hover:border-[#2563EB]/30 hover:bg-[#2563EB]/[0.04] transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Section
              </button>
            </div>
          </aside>

          {/* ─── Workspace: shared light shell + twin white cards (editor + preview) ─── */}
          <div className="order-1 lg:order-none lg:col-span-10 min-w-0">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-10 lg:gap-6 lg:items-start">
          {/* ─── Editor (support panel) ─── */}
          <main className="order-2 lg:order-none lg:col-span-3 min-w-0">
            <div className="relative rounded-[16px] bg-white overflow-hidden shadow-[0_10px_26px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.05)]">
              {/* premium keyline */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.55) 18%, rgba(99,102,241,0.45) 52%, rgba(37,99,235,0.15) 82%, rgba(37,99,235,0) 100%)",
                }}
              />
              {/* edge highlight */}
              <div aria-hidden className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] pointer-events-none" />
              <form onSubmit={(e) => e.preventDefault()} className="p-4 sm:p-5 lg:p-6 space-y-6">

                {error && (
                  <div className="rounded-[12px] border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                    {error}
                  </div>
                )}
                {draftSuccess && (
                  <div className="rounded-[12px] border border-success/20 bg-success/[0.06] px-4 py-3 text-sm text-success font-medium shadow-sm">
                    Draft saved
                  </div>
                )}

                {/* ── Profile section ── */}
                <section id="builder-section-profile">
                  <div
                    role={activeSection !== "profile" ? "button" : undefined}
                    tabIndex={activeSection !== "profile" ? 0 : undefined}
                    onClick={() => activeSection !== "profile" && jumpToSection("profile")}
                    onKeyDown={(e) => e.key === "Enter" && activeSection !== "profile" && jumpToSection("profile")}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[14px] transition-all duration-200",
                      activeSection === "profile"
                        ? "pb-1"
                        : "px-4 py-4 bg-white border border-border-soft/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)] hover:border-border-soft cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", sectionColors.profile)}>
                        <UserIcon className="w-4 h-4" />
                      </span>
                      <h2 className="text-[14px] font-semibold text-primary tracking-tight">Profile</h2>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted/35 transition-transform duration-200",
                          activeSection === "profile" && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <button type="button" className="p-1.5 rounded-lg hover:bg-[#F1F4F8] text-muted/40 hover:text-muted/70 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeSection === "profile" && (
                    <div className="mt-4 rounded-[14px] border border-border-soft/50 bg-[#F8F9FB] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      {/* Profile module: photo + live labels + fields */}
                      <div className="flex flex-col items-center text-center pb-4 border-b border-border-soft/50">
                        <AvatarUpload
                          value={avatarUrl || null}
                          onChange={setAvatarUrl}
                          disabled={draftLoading || publishLoading}
                          size={96}
                        />
                        <p className={cn("mt-3 text-base font-bold tracking-tight truncate w-full", name.trim() ? "text-primary" : "text-muted/35")}>
                          {name.trim() || "Name"}
                        </p>
                        <p className={cn("text-[11px] uppercase tracking-wider truncate w-full mt-0.5", niche.trim() ? "text-muted/70" : "text-muted/30")}>
                          {niche.trim() || "Niche"}
                        </p>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="sr-only">Name (required)</label>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">Name <span className="text-red-400 normal-case">*</span></span>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jordan Lee"
                            required
                            disabled={draftLoading || publishLoading}
                            className="h-10 text-[13px] bg-white/80 border-border-soft/60"
                          />
                        </div>
                        <div>
                          <label htmlFor="niche" className="sr-only">Niche (required)</label>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">Niche <span className="text-red-400 normal-case">*</span></span>
                          <Input
                            id="niche"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            placeholder="Beauty, Skincare, DTC"
                            required
                            disabled={draftLoading || publishLoading}
                            className="h-10 text-[13px] bg-white/80 border-border-soft/60"
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="sr-only">Bio</label>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">Bio</span>
                          <textarea
                            id="bio"
                            rows={3}
                            maxLength={BIO_MAX_LENGTH}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Short intro for brands…"
                            disabled={draftLoading || publishLoading}
                            className="flex min-h-[72px] w-full rounded-[10px] border border-border-soft/60 bg-white/80 px-3 py-2.5 text-[13px] text-primary placeholder:text-muted/40 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15 focus-visible:border-brand/60 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                          />
                          <p className="mt-1 text-right text-[10px] text-muted/40 tabular-nums">
                            {bio.length} / {BIO_MAX_LENGTH}
                          </p>
                        </div>
                      </div>

                      {/* Public link */}
                      <div className="mt-5 pt-4 border-t border-border-soft/50 space-y-2">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted/45">Public link</h3>
                        {userPlan && getPlanFeatures(userPlan).canCustomizeSlug ? (
                          <div>
                            <label htmlFor="kit-slug" className="block text-[11px] font-medium text-muted/60 mb-1.5 uppercase tracking-wider">
                              Path (after /kit/)
                            </label>
                            <div className="flex items-center gap-2 text-sm text-muted">
                              <span className="shrink-0 text-primary/70 font-medium">/kit/</span>
                              <Input
                                id="kit-slug"
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                                placeholder="your-name"
                                disabled={draftLoading || publishLoading}
                                className="flex-1 font-mono text-sm"
                              />
                            </div>
                            <p className="mt-1.5 text-[11px] text-muted/50">
                              Letters, numbers, hyphens only. Must be unique.
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted/70 leading-relaxed">
                            {customSlug ? (
                              <>
                                Your kit:{" "}
                                <span className="font-mono text-primary/80 font-medium">/kit/{customSlug}</span>
                              </>
                            ) : (
                              <>URL is auto-generated when you save (from your name).</>
                            )}{" "}
                            <Link href="/#pricing" className="text-brand font-medium hover:underline">
                              Custom URL on Pro
                            </Link>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Performance section ── */}
                <section id="builder-section-performance">
                  <div
                    role={activeSection !== "performance" ? "button" : undefined}
                    tabIndex={activeSection !== "performance" ? 0 : undefined}
                    onClick={() => activeSection !== "performance" && jumpToSection("performance")}
                    onKeyDown={(e) => e.key === "Enter" && activeSection !== "performance" && jumpToSection("performance")}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[14px] transition-all duration-200",
                      activeSection === "performance"
                        ? "pb-1"
                        : "px-4 py-4 bg-white border border-border-soft/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)] hover:border-border-soft cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", sectionColors.performance)}>
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      <h2 className="text-[14px] font-semibold text-primary tracking-tight">Performance</h2>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted/35 transition-transform duration-200",
                          activeSection === "performance" && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <button type="button" className="p-1.5 rounded-lg hover:bg-[#F1F4F8] text-muted/40 hover:text-muted/70 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeSection === "performance" && (
                    <div className="mt-4 rounded-[14px] border border-border-soft/50 bg-[#F8F9FB] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      {userPlan && getPlanFeatures(userPlan).showAdvancedPerformanceInBuilder ? (
                        <div className="space-y-4">
                          <p className="text-[11px] text-muted/50 leading-relaxed">
                            Shown on your live kit (Pro).
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label htmlFor="ctr" className="sr-only">CTR</label>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">CTR</span>
                              <Input
                                id="ctr"
                                value={ctr}
                                onChange={(e) => setCtr(e.target.value)}
                                placeholder="3.4x"
                                disabled={draftLoading || publishLoading}
                                className="h-10 text-[13px] bg-white/80 border-border-soft/60"
                              />
                            </div>
                            <div>
                              <label htmlFor="retention" className="sr-only">Retention</label>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">Retention</span>
                              <Input
                                id="retention"
                                value={retention}
                                onChange={(e) => setRetention(e.target.value)}
                                placeholder="48%"
                                disabled={draftLoading || publishLoading}
                                className="h-10 text-[13px] bg-white/80 border-border-soft/60"
                              />
                            </div>
                            <div>
                              <label htmlFor="roas" className="sr-only">ROAS</label>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/45 mb-1.5 block">ROAS</span>
                              <Input
                                id="roas"
                                value={roas}
                                onChange={(e) => setRoas(e.target.value)}
                                placeholder="4.2x"
                                disabled={draftLoading || publishLoading}
                                className="h-10 text-[13px] bg-white/80 border-border-soft/60"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[13px] text-muted/60 leading-relaxed">
                          <span className="font-semibold text-primary/80">CTR, retention, and ROAS</span> on your public kit are{" "}
                          <Link href="/#pricing" className="text-brand font-semibold hover:underline">
                            Pro
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  )}
                </section>

                {/* ── Content section ── */}
                <section id="builder-section-content">
                  <div
                    role={activeSection !== "content" ? "button" : undefined}
                    tabIndex={activeSection !== "content" ? 0 : undefined}
                    onClick={() => activeSection !== "content" && jumpToSection("content")}
                    onKeyDown={(e) => e.key === "Enter" && activeSection !== "content" && jumpToSection("content")}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[14px] transition-all duration-200",
                      activeSection === "content"
                        ? "pb-1"
                        : "px-4 py-4 bg-white border border-border-soft/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)] hover:border-border-soft cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", sectionColors.content)}>
                        <VideoIcon className="w-4 h-4" />
                      </span>
                      <h2 className="text-[14px] font-semibold text-primary tracking-tight">Content</h2>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted/35 transition-transform duration-200",
                          activeSection === "content" && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <button type="button" className="p-1.5 rounded-lg hover:bg-[#F1F4F8] text-muted/40 hover:text-muted/70 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeSection === "content" && (
                    <div className="mt-4 rounded-[14px] border border-border-soft/50 bg-[#F8F9FB] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] text-muted/50">Video links for your kit.</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addVideo}
                          disabled={draftLoading || publishLoading}
                          className="h-8 text-[12px]"
                        >
                          + Add
                        </Button>
                      </div>
                      {userPlan === "free" && (
                        <p className="text-[10px] text-muted/40 mb-3">Up to 3 on Free. Pro: more.</p>
                      )}
                      <div className="space-y-2.5">
                        {videos.map((v, i) => (
                          <div
                            key={i}
                            className="rounded-[10px] border border-border-soft/60 bg-white/90 p-3 flex flex-col gap-2 shadow-sm"
                          >
                            <Input
                              type="url"
                              value={v.url}
                              onChange={(e) => updateVideo(i, "url", e.target.value)}
                              placeholder="Video URL"
                              disabled={draftLoading || publishLoading}
                              className="flex-1 h-9 text-[12px]"
                            />
                            <Input
                              value={v.title}
                              onChange={(e) => updateVideo(i, "title", e.target.value)}
                              placeholder="Title"
                              disabled={draftLoading || publishLoading}
                              className="w-full h-9 text-[12px]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVideo(i)}
                              disabled={draftLoading || publishLoading || videos.length === 1}
                              className="shrink-0 text-muted/40 hover:text-red-500"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Packages section ── */}
                <section id="builder-section-packages">
                  <div
                    role={activeSection !== "packages" ? "button" : undefined}
                    tabIndex={activeSection !== "packages" ? 0 : undefined}
                    onClick={() => activeSection !== "packages" && jumpToSection("packages")}
                    onKeyDown={(e) => e.key === "Enter" && activeSection !== "packages" && jumpToSection("packages")}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[14px] transition-all duration-200",
                      activeSection === "packages"
                        ? "pb-1"
                        : "px-4 py-4 bg-white border border-border-soft/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)] hover:border-border-soft cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", sectionColors.packages)}>
                        <PackageIcon className="w-4 h-4" />
                      </span>
                      <h2 className="text-[14px] font-semibold text-primary tracking-tight">Packages</h2>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted/35 transition-transform duration-200",
                          activeSection === "packages" && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <button type="button" className="p-1.5 rounded-lg hover:bg-[#F1F4F8] text-muted/40 hover:text-muted/70 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeSection === "packages" && (
                    <div className="mt-4 rounded-[14px] border border-border-soft/50 bg-[#F8F9FB] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] text-muted/50">Offers and pricing.</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPackage}
                          disabled={draftLoading || publishLoading}
                          className="h-8 text-[12px]"
                        >
                          + Add
                        </Button>
                      </div>
                      <div className="space-y-2.5">
                        {packages.map((p, i) => (
                          <div
                            key={i}
                            className="rounded-[10px] border border-border-soft/60 bg-white/90 p-3 flex flex-col gap-2 shadow-sm"
                          >
                            <Input
                              value={p.name}
                              onChange={(e) => updatePackage(i, "name", e.target.value)}
                              placeholder="Package name"
                              disabled={draftLoading || publishLoading}
                              className="flex-1 h-9 text-[12px]"
                            />
                            <Input
                              value={p.price}
                              onChange={(e) => updatePackage(i, "price", e.target.value)}
                              placeholder="Price"
                              disabled={draftLoading || publishLoading}
                              className="w-full h-9 text-[12px]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePackage(i)}
                              disabled={draftLoading || publishLoading || packages.length === 1}
                              className="shrink-0 text-muted/40 hover:text-red-500"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Testimonial section ── */}
                <section id="builder-section-testimonial">
                  <div
                    role={activeSection !== "testimonial" ? "button" : undefined}
                    tabIndex={activeSection !== "testimonial" ? 0 : undefined}
                    onClick={() => activeSection !== "testimonial" && jumpToSection("testimonial")}
                    onKeyDown={(e) => e.key === "Enter" && activeSection !== "testimonial" && jumpToSection("testimonial")}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[14px] transition-all duration-200",
                      activeSection === "testimonial"
                        ? "pb-1"
                        : "px-4 py-4 bg-white border border-border-soft/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)] hover:border-border-soft cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", sectionColors.testimonial)}>
                        <Quote className="w-4 h-4" />
                      </span>
                      <h2 className="text-[14px] font-semibold text-primary tracking-tight">Testimonial</h2>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted/35 transition-transform duration-200",
                          activeSection === "testimonial" && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <button type="button" className="p-1.5 rounded-lg hover:bg-[#F1F4F8] text-muted/40 hover:text-muted/70 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeSection === "testimonial" && (
                    <div className="mt-4 rounded-[14px] border border-border-soft/50 bg-[#F8F9FB] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <p className="text-[11px] text-muted/50 mb-3">Quote from a brand or client (optional).</p>
                      <textarea
                        rows={4}
                        value={testimonial}
                        onChange={(e) => setTestimonial(e.target.value)}
                        placeholder="Brand testimonial or quote..."
                        disabled={draftLoading || publishLoading}
                        className="flex w-full rounded-[12px] border border-border-soft/80 bg-white px-4 py-3 text-sm text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-muted/50 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:ring-offset-0 focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_rgba(59,111,255,0.08)] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                  )}
                </section>

                {/* Bottom add section */}
                <div className="pt-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-[14px] border border-dashed border-border-soft/60 py-4 text-[13px] font-medium text-muted/40 hover:text-brand hover:border-brand/30 hover:bg-brand/[0.02] transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>

                {/* Mobile action buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3 lg:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={draftLoading || publishLoading}
                    onClick={handleSaveDraft}
                    className="flex-1 h-12 text-sm font-medium"
                  >
                    {draftLoading ? "Saving…" : "Save draft"}
                  </Button>
                  <Button
                    type="button"
                    disabled={draftLoading || publishLoading}
                    onClick={handlePublish}
                    className="flex-1 h-12 text-sm font-medium bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
                  >
                    {publishLoading ? "Publishing…" : "Publish media kit"}
                  </Button>
                </div>
              </form>
            </div>
          </main>

          {/* ─── Live preview (primary canvas) ─── */}
          <aside
            ref={previewPanelRef}
            className="order-1 lg:order-none lg:col-span-7 min-w-0 lg:sticky lg:top-[76px]"
          >
            <div className="relative rounded-[16px] bg-white overflow-hidden shadow-[0_18px_52px_rgba(15,23,42,0.14),0_6px_18px_rgba(15,23,42,0.08)] flex flex-col h-full min-h-0">
              {/* premium keyline */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.45) 16%, rgba(99,102,241,0.38) 50%, rgba(37,99,235,0.12) 84%, rgba(37,99,235,0) 100%)",
                }}
              />
              {/* header band */}
              <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-3 shrink-0 bg-[linear-gradient(180deg,#FFFFFF,rgba(37,99,235,0.035))]">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/50">Live preview</h2>
                <p className="text-[10px] text-muted/50 font-medium">Updates as you edit</p>
              </div>
              <div className="h-[calc(100vh-168px)] min-h-[560px] overflow-y-auto overflow-x-hidden px-4 pb-4 pt-3 bg-[linear-gradient(180deg,rgba(37,99,235,0.035),rgba(250,250,251,0.95))]">
                <div className="rounded-[12px] overflow-hidden bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
                  <MediaKitPreview kit={previewKit} features={f} variant="embedded" />
                </div>
              </div>
            </div>
          </aside>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
