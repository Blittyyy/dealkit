/**
 * Generate a URL-safe slug from a name.
 * - lowercase
 * - replace spaces with hyphens
 * - remove special characters
 */
export function slugFromName(name: string): string {
  if (!name?.trim()) return "kit";
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, "") || "kit";
}
