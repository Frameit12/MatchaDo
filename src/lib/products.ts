import { createClient } from "@/lib/supabase/server";

export type ProductWithRating = {
  id: string;
  brand_name: string;
  product_name: string;
  grade: string | null;
  origin: string | null;
  photo_url: string | null;
  created_at: string;
  avgRating: number;
  reviewCount: number;
};

export const GRADES = ["Ceremonial", "Culinary"] as const;
export const BEST_FOR_TAGS = ["Usucha", "Latte", "Cooking"] as const;

export const SORT_OPTIONS = [
  { value: "top_rated", label: "Top Rated" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: SortOption = "top_rated";

export async function getApprovedProducts(options?: {
  search?: string;
  grade?: string;
  bestFor?: string;
  limit?: number;
  sort?: SortOption;
}): Promise<ProductWithRating[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, brand_name, product_name, grade, origin, photo_url, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const search = options?.search?.trim().slice(0, 100);
  if (search) {
    // Strip characters that are structurally significant in PostgREST's
    // .or() filter syntax so a search term can't break or extend the query.
    const safe = search.replace(/[%_,()]/g, " ").trim();
    if (safe) {
      query = query.or(`brand_name.ilike.%${safe}%,product_name.ilike.%${safe}%,origin.ilike.%${safe}%`);
    }
  }

  if (options?.grade && (GRADES as readonly string[]).includes(options.grade)) {
    query = query.eq("grade", options.grade);
  }

  if (options?.bestFor && (BEST_FOR_TAGS as readonly string[]).includes(options.bestFor)) {
    // best_for is a per-review tag, not a product column, so match any
    // product with at least one review carrying this tag.
    const { data: taggedReviews } = await supabase
      .from("review_best_for")
      .select("review_id")
      .eq("tag", options.bestFor);
    const reviewIds = (taggedReviews ?? []).map((r) => r.review_id);

    if (reviewIds.length === 0) return [];

    const { data: matchingReviews } = await supabase.from("reviews").select("product_id").in("id", reviewIds);
    const productIds = [...new Set((matchingReviews ?? []).map((r) => r.product_id))];

    if (productIds.length === 0) return [];
    query = query.in("id", productIds);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: products } = await query;
  if (!products || products.length === 0) return [];

  const { data: reviews } = await supabase
    .from("reviews")
    .select("product_id, overall, photo_url, created_at")
    .in(
      "product_id",
      products.map((p) => p.id)
    );

  const withRatings = products.map((product) => {
    const productReviews = reviews?.filter((r) => r.product_id === product.id) ?? [];
    const reviewCount = productReviews.length;
    const avgRating =
      reviewCount > 0 ? productReviews.reduce((sum, r) => sum + r.overall, 0) / reviewCount : 0;

    // Fall back to the most recent review photo when the product itself has
    // no photo, so the card isn't stuck showing the empty placeholder.
    let photo_url = product.photo_url;
    if (!photo_url) {
      const mostRecentPhotoReview = productReviews
        .filter((r) => r.photo_url)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      photo_url = mostRecentPhotoReview?.photo_url ?? null;
    }

    return { ...product, photo_url, avgRating, reviewCount };
  });

  // Rating/review-count aren't database columns, so this sort has to happen
  // in JS after the averaging above rather than in the Supabase query. Note
  // this runs after `limit` was already applied to the SQL query, so pairing
  // `sort` with `limit` would sort within an already-recency-limited page,
  // not the true top N -- fine for today's only caller (search, unlimited),
  // but worth knowing before reusing this with `limit`.
  // Callers that don't ask for a sort keep the original DB order (newest
  // first) so existing behavior (e.g. the homepage) is unaffected.
  if (!options?.sort) return withRatings;

  return [...withRatings].sort((a, b) => {
    if (options.sort === "most_reviewed") {
      return b.reviewCount - a.reviewCount || b.avgRating - a.avgRating;
    }
    if (options.sort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return b.avgRating - a.avgRating || b.reviewCount - a.reviewCount;
  });
}
