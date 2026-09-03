/**
 * Generates a clean URL slug from category name or existing slug.
 * Example: "Men's Clothing" -> "mens-clothing"
 * Example: "Combo Gift Boxes" -> "combo-gift-boxes"
 * Example: "Fashion & Jewellery" -> "fashion-jewellery"
 */
export function getCategorySlug(name: string, slug?: string): string {
  if (slug && slug.trim()) {
    return slug
      .trim()
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  return (name || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Robust matching between a URL slug and a category name/slug.
 * Ignores hyphens, spaces, apostrophes and special characters.
 */
export function isCategoryMatch(categoryNameOrSlug: string, targetSlugOrName: string): boolean {
  const normalize = (str: string) =>
    (str || '')
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const a = normalize(categoryNameOrSlug);
  const b = normalize(targetSlugOrName);
  return a.length > 0 && (a === b || a.includes(b) || b.includes(a));
}
