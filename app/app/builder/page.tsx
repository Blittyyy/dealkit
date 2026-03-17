"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugFromName } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppNavbar } from "@/components/sections/AppNavbar";
import { AvatarUpload } from "@/components/avatar-upload";
import { cn } from "@/lib/utils";

type PackageItem = { name: string; price: string };
type VideoItem = { url: string; title: string };

export default function MediaKitBuilderPage() {
  const router = useRouter();
  const [draftLoading, setDraftLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCheckingAuth(false);
      if (!session) router.replace("/login");
    });
  }, [router]);

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

    const packagesPayload = packages
      .filter((p) => p.name.trim())
      .map((p) => ({ name: p.name.trim(), price: p.price.trim() }));
    const videosPayload = videos
      .filter((v) => v.url.trim())
      .map((v) => ({ url: v.url.trim(), title: v.title.trim() }));

    const basePayload = {
      user_id: user.id,
      name: name.trim() || "My Media Kit",
      avatar_url: avatarUrl.trim() || null,
      niche: niche.trim() || null,
      bio: bio.trim() || null,
      ctr: ctr.trim() || null,
      retention: retention.trim() || null,
      roas: roas.trim() || null,
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
    if (existing) {
      slug = existing.slug;
    } else {
      const baseSlug = slugFromName(name || "kit");
      slug = await findAvailableSlug(supabase, baseSlug);
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
      router.replace(`/app/kit-live${result.slug ? `?slug=${encodeURIComponent(result.slug)}` : ""}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish media kit.");
    } finally {
      setPublishLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
        }}
      >
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
      }}
    >
      <AppNavbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="rounded-[18px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/5 p-8 lg:p-10">
          <h1 className="text-2xl md:text-[1.75rem] font-semibold text-primary tracking-tight">
            Media Kit Builder
          </h1>
          <p className="mt-2 text-[15px] text-muted/90 leading-relaxed">
            Build your performance page. Fill in your metrics and packages.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-8">
            {error && (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {draftSuccess && (
              <div className="rounded-[10px] border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                Draft saved
              </div>
            )}

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-primary">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Lee"
                    required
                    disabled={draftLoading || publishLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    Profile photo <span className="text-red-500">*</span>
                  </label>
                  <AvatarUpload
                    value={avatarUrl || null}
                    onChange={setAvatarUrl}
                    disabled={draftLoading || publishLoading}
                    size={112}
                  />
                </div>
                <div>
                  <label htmlFor="niche" className="block text-sm font-medium text-primary mb-1.5">
                    Niche <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="niche"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Beauty, Skincare, DTC"
                    required
                    disabled={draftLoading || publishLoading}
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1.5">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short creator bio..."
                    disabled={draftLoading || publishLoading}
                    className={cn(
                      "flex w-full rounded-[12px] border border-border-soft bg-white px-4 py-3 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-primary">Performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ctr" className="block text-sm font-medium text-primary mb-1.5">
                    CTR
                  </label>
                  <Input
                    id="ctr"
                    value={ctr}
                    onChange={(e) => setCtr(e.target.value)}
                    placeholder="3.4x"
                    disabled={draftLoading || publishLoading}
                  />
                </div>
                <div>
                  <label htmlFor="retention" className="block text-sm font-medium text-primary mb-1.5">
                    Retention
                  </label>
                  <Input
                    id="retention"
                    value={retention}
                    onChange={(e) => setRetention(e.target.value)}
                    placeholder="48%"
                    disabled={draftLoading || publishLoading}
                  />
                </div>
                <div>
                  <label htmlFor="roas" className="block text-sm font-medium text-primary mb-1.5">
                    ROAS
                  </label>
                  <Input
                    id="roas"
                    value={roas}
                    onChange={(e) => setRoas(e.target.value)}
                    placeholder="4.2x"
                    disabled={draftLoading || publishLoading}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary">Packages</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackage}
                  disabled={draftLoading || publishLoading}
                >
                  + Add
                </Button>
              </div>
              <div className="space-y-3">
                {packages.map((p, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start"
                  >
                    <Input
                      value={p.name}
                      onChange={(e) => updatePackage(i, "name", e.target.value)}
                      placeholder="Package name"
                      disabled={draftLoading || publishLoading}
                      className="flex-1"
                    />
                    <Input
                      value={p.price}
                      onChange={(e) => updatePackage(i, "price", e.target.value)}
                      placeholder="Price"
                      disabled={draftLoading || publishLoading}
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePackage(i)}
                      disabled={draftLoading || publishLoading || packages.length === 1}
                      className="shrink-0 text-muted hover:text-red-600"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary">Videos</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVideo}
                  disabled={draftLoading || publishLoading}
                >
                  + Add
                </Button>
              </div>
              <div className="space-y-3">
                {videos.map((v, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start"
                  >
                    <Input
                      type="url"
                      value={v.url}
                      onChange={(e) => updateVideo(i, "url", e.target.value)}
                      placeholder="Video URL"
                      disabled={draftLoading || publishLoading}
                      className="flex-1"
                    />
                    <Input
                      value={v.title}
                      onChange={(e) => updateVideo(i, "title", e.target.value)}
                      placeholder="Title"
                      disabled={draftLoading || publishLoading}
                      className="w-36"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVideo(i)}
                      disabled={draftLoading || publishLoading || videos.length === 1}
                      className="shrink-0 text-muted hover:text-red-600"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-primary">Testimonial</h2>
              <textarea
                rows={4}
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Brand testimonial or quote..."
                disabled={draftLoading || publishLoading}
                className={cn(
                  "flex w-full rounded-[12px] border border-border-soft bg-white px-4 py-3 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                )}
              />
            </section>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
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
                className="flex-1 h-12 text-sm font-medium"
              >
                {publishLoading ? "Publishing…" : "Generate my media kit"}
              </Button>
            </div>
          </form>

          <Link
            href="/app"
            className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
