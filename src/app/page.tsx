import { Inter, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-noto-serif-jp",
});

async function getApprovedProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, brand_name, product_name, grade, origin, photo_url, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

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
      reviewCount > 0
        ? productReviews.reduce((sum, r) => sum + r.overall, 0) / reviewCount
        : 0;
    return { ...product, avgRating, reviewCount };
  });
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const products = await getApprovedProducts();

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div
      className={`${inter.variable} ${notoSerifJP.variable} min-h-screen bg-[oklch(0.98_0.012_95)] text-[oklch(0.22_0.015_100)] font-[family-name:var(--font-inter)]`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-[oklch(0.9_0.02_130)] bg-[oklch(0.985_0.01_95)] px-12 py-[18px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[oklch(0.48_0.09_145)]">
            <span className="text-[17px] leading-none text-white font-[family-name:var(--font-noto-serif-jp)]">
              抹
            </span>
          </div>
          <span className="text-[22px] font-semibold tracking-[0.5px] text-[oklch(0.3_0.06_145)] font-[family-name:var(--font-noto-serif-jp)]">
            Matchado
          </span>
        </Link>

        <div className="flex max-w-[480px] flex-1 items-center gap-2.5 rounded-3xl border border-[oklch(0.88_0.02_130)] bg-[oklch(0.96_0.012_95)] px-[18px] py-[9px]">
          <span className="text-[15px] text-[oklch(0.55_0.02_130)]">⌕</span>
          <input
            type="text"
            placeholder="Search brands, products, or origins..."
            className="w-full bg-transparent text-sm text-[oklch(0.25_0.01_100)] outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/submit"
            className="shrink-0 rounded-[20px] border border-[oklch(0.7_0.06_145)] px-[18px] py-[9px] text-sm font-medium whitespace-nowrap text-[oklch(0.35_0.06_145)] transition-colors hover:bg-[oklch(0.94_0.03_145)]"
          >
            Submit a Matcha
          </Link>

          {user ? (
            <>
              <span className="px-1.5 text-sm text-[oklch(0.3_0.02_100)]">
                {user.email}
              </span>
              <form action={logout}>
                <button className="rounded-[20px] bg-[oklch(0.45_0.09_145)] px-5 py-[9px] text-sm font-semibold text-[oklch(0.99_0.005_145)] transition-colors hover:bg-[oklch(0.38_0.09_145)]">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-1.5 py-[9px] text-sm font-medium text-[oklch(0.3_0.02_100)] transition-colors hover:text-[oklch(0.45_0.09_145)]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-[20px] bg-[oklch(0.45_0.09_145)] px-5 py-[9px] text-sm font-semibold text-[oklch(0.99_0.005_145)] transition-colors hover:bg-[oklch(0.38_0.09_145)]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center bg-[linear-gradient(oklch(0.96_0.02_140)_0%,oklch(0.98_0.012_95)_100%)] px-6 pt-[88px] pb-[72px] text-center">
        <span className="mb-[18px] text-[13px] tracking-[2.5px] uppercase text-[oklch(0.48_0.08_145)]">
          A community for matcha lovers
        </span>
        <h1 className="mb-[18px] max-w-[680px] text-[46px] leading-[1.3] font-semibold text-[oklch(0.24_0.03_140)] font-[family-name:var(--font-noto-serif-jp)]">
          Discover and rate matcha from around the world
        </h1>
        <p className="mb-[34px] max-w-[520px] text-base leading-[1.6] text-[oklch(0.42_0.02_120)]">
          Explore ceremonial, culinary, and unknown grades reviewed by a community that knows their matcha.
        </p>
        <button className="rounded-[26px] bg-[oklch(0.45_0.09_145)] px-8 py-3.5 text-[15px] font-semibold whitespace-nowrap text-[oklch(0.99_0.005_145)] shadow-[0_8px_20px_oklch(0.45_0.09_145_/_0.25)] transition-colors hover:bg-[oklch(0.38_0.09_145)]">
          Browse All Matcha
        </button>
      </section>

      {/* Recently Added */}
      <section className="mx-auto max-w-[1180px] px-12 pt-2 pb-24">
        <h2 className="mb-7 text-2xl font-semibold text-[oklch(0.24_0.03_140)] font-[family-name:var(--font-noto-serif-jp)]">
          Recently Added
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[oklch(0.9_0.02_130)] py-20 text-center">
            <p className="text-lg font-semibold text-[oklch(0.24_0.03_140)] font-[family-name:var(--font-noto-serif-jp)]">
              No matcha here yet
            </p>
            <p className="max-w-sm text-sm text-[oklch(0.42_0.02_120)]">
              Be the first to submit a matcha and start the reviews rolling in.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
