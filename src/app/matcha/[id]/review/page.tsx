import { Inter, Shippori_Mincho } from "next/font/google";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "./ReviewForm";
import { submitReview } from "./actions";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-shippori-mincho",
});

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: product } = await supabase
    .from("products")
    .select("brand_name, product_name, photo_url")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const boundSubmitReview = submitReview.bind(null, id);

  return (
    <div
      className={`${inter.variable} ${shipporiMincho.variable} min-h-screen text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-inter)]`}
    >
      <header className="flex items-center justify-between gap-6 border-b border-[oklch(0.9_0.025_140)] bg-[oklch(0.99_0.006_140)] px-12 py-[18px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[oklch(0.3_0.07_150)]">
            <span className="text-lg leading-none text-[oklch(0.99_0.005_140)] font-[family-name:var(--font-shippori-mincho)]">
              抹
            </span>
          </div>
          <span className="text-2xl font-bold tracking-[0.3px] text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
            Matchado
          </span>
        </Link>

        <div className="relative max-w-[520px] flex-1">
          <input
            placeholder="Search matcha, brands, reviews..."
            className="w-full rounded-3xl border border-[oklch(0.87_0.03_140)] bg-[oklch(0.965_0.015_140)] py-[11px] pr-4 pl-10 text-sm outline-none"
          />
          <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px] opacity-55">⌕</span>
        </div>

        <nav className="flex shrink-0 items-center gap-5 whitespace-nowrap">
          <Link
            href="/submit"
            className="rounded-[20px] border-[1.5px] border-[oklch(0.3_0.07_150)] px-4 py-2.5 text-sm font-semibold text-[oklch(0.3_0.07_150)] hover:bg-[oklch(0.3_0.07_150)] hover:text-[oklch(0.99_0.005_140)]"
          >
            Submit a Matcha
          </Link>
          <span className="text-sm font-semibold text-[oklch(0.24_0.03_150)]">{user.email}</span>
        </nav>
      </header>

      <div className="mx-auto max-w-[880px] px-6 pt-10">
        <Link
          href={`/matcha/${id}`}
          className="text-[13px] font-semibold text-[oklch(0.38_0.06_150)] hover:underline"
        >
          ← Back to product page
        </Link>

        <div className="mt-[18px] flex items-center gap-5 border-b border-[oklch(0.88_0.028_140)] pb-7">
          <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[14px] bg-[oklch(0.9_0.03_140)]">
            {product.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.photo_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.08em] text-[oklch(0.45_0.06_150)] uppercase">
              {product.brand_name}
            </div>
            <div className="mt-0.5 text-[30px] font-semibold text-[oklch(0.22_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
              {product.product_name}
            </div>
            <div className="mt-1 text-[13px] text-[oklch(0.45_0.02_140)]">
              You&apos;re writing a review for this product
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[880px] px-6 pt-9 pb-24">
        <ReviewForm action={boundSubmitReview} />
      </div>
    </div>
  );
}
