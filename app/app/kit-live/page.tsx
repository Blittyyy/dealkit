import { redirect } from "next/navigation";

/** Backwards compatibility: old links → same UI at /app/success */
export const dynamic = "force-dynamic";

function slugFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): string | null {
  const raw = searchParams.slug;
  if (raw == null) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw || null;
}

export default function KitLiveRedirect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const slug = slugFromSearchParams(searchParams);
  if (slug) {
    redirect(`/app/success?slug=${encodeURIComponent(slug)}`);
  }
  redirect("/app/builder");
}
