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

export async function getApprovedProducts(options?: {
  search?: string;
  limit?: number;
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

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: products } = await query;
  if (!products || products.length === 0) return [];

  const { data: reviews } = await supabase
    .from("reviews")
    .select("product_id, overall")
    .in(
      "product_id",
      products.map((p) => p.id)
    );

  return products.map((product) => {
    const productReviews = reviews?.filter((r) => r.product_id === product.id) ?? [];
    const reviewCount = productReviews.length;
    const avgRating =
      reviewCount > 0 ? productReviews.reduce((sum, r) => sum + r.overall, 0) / reviewCount : 0;
    return { ...product, avgRating, reviewCount };
  });
}
