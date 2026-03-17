import { KitCreatedSuccessContent } from "../success/kit-created-success-content";

export const dynamic = "force-dynamic";

function slugFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): string | null {
  const raw = searchParams.slug;
  if (raw == null) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw || null;
}

export default function KitLivePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const slug = slugFromSearchParams(searchParams);
  return <KitCreatedSuccessContent slug={slug} />;
}
