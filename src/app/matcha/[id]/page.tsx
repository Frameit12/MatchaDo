import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductPageView, { CRITERIA, type CriterionKey } from "./ProductPageView";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
});

const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-shippori-mincho",
});

function average(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: product } = await supabase
    .from("products")
    .select("id, brand_name, product_name, grade, origin, photo_url")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      "id, user_id, color, aroma, taste, finish, value_for_money, overall, what_i_loved, could_be_better, created_at"
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  const reviewList = reviews ?? [];
  const reviewCount = reviewList.length;
  const avgOverall = average(reviewList.map((r) => r.overall));
  const criterionAverages = Object.fromEntries(
    CRITERIA.map(({ key }) => [key, average(reviewList.map((r) => r[key] as number))])
  ) as Record<CriterionKey, number>;

  const reviewIds = reviewList.map((r) => r.id);

  const [{ data: descriptorRows }, { data: profiles }] = await Promise.all([
    reviewIds.length > 0
      ? supabase.from("review_taste_descriptors").select("review_id, descriptor").in("review_id", reviewIds)
      : Promise.resolve({ data: [] as { review_id: string; descriptor: string }[] }),
    reviewList.length > 0
      ? supabase
          .from("profiles")
          .select("id, username")
          .in("id", [...new Set(reviewList.map((r) => r.user_id))])
      : Promise.resolve({ data: [] as { id: string; username: string }[] }),
  ]);

  const descriptorsByReview = new Map<string, string[]>();
  const descriptorCounts = new Map<string, number>();
  for (const row of descriptorRows ?? []) {
    descriptorsByReview.set(row.review_id, [...(descriptorsByReview.get(row.review_id) ?? []), row.descriptor]);
    descriptorCounts.set(row.descriptor, (descriptorCounts.get(row.descriptor) ?? 0) + 1);
  }
  const topDescriptors = [...descriptorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([descriptor]) => descriptor);

  const usernameById = new Map((profiles ?? []).map((p) => [p.id, p.username]));

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className={`${notoSansJP.variable} ${shipporiMincho.variable}`}>
      <ProductPageView
        productId={id}
        product={product}
        userEmail={user?.email ?? null}
        onLogout={logout}
        reviewCount={reviewCount}
        avgOverall={avgOverall}
        criterionAverages={criterionAverages}
        topDescriptors={topDescriptors}
        reviews={reviewList.map((review) => ({
          id: review.id,
          username: usernameById.get(review.user_id) ?? "Anonymous",
          createdAtLabel: formatDate(review.created_at),
          overall: review.overall,
          descriptors: descriptorsByReview.get(review.id) ?? [],
          whatILoved: review.what_i_loved,
          couldBeBetter: review.could_be_better,
        }))}
      />
    </div>
  );
}
