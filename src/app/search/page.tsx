import { Inter, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getApprovedProducts, GRADES, BEST_FOR_TAGS, SORT_OPTIONS, DEFAULT_SORT, type SortOption } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SortDropdown from "./SortDropdown";

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; grade?: string; bestFor?: string; sort?: string }>;
}) {
  const { q, grade: gradeParam, bestFor: bestForParam, sort: sortParam } = await searchParams;
  const query = q?.trim() ?? "";
  const grade = (GRADES as readonly string[]).includes(gradeParam ?? "") ? gradeParam : undefined;
  const bestFor = (BEST_FOR_TAGS as readonly string[]).includes(bestForParam ?? "") ? bestForParam : undefined;
  const sort: SortOption = (SORT_OPTIONS as readonly { value: string }[]).some((o) => o.value === sortParam)
    ? (sortParam as SortOption)
    : DEFAULT_SORT;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const products = await getApprovedProducts({
    ...(query ? { search: query } : {}),
    ...(grade ? { grade } : {}),
    ...(bestFor ? { bestFor } : {}),
    sort,
  });

  function hrefFor(overrides: { grade?: string | null; bestFor?: string | null; sort?: SortOption }) {
    const params = new URLSearchParams();
    const g = overrides.grade === undefined ? grade : overrides.grade;
    const bf = overrides.bestFor === undefined ? bestFor : overrides.bestFor;
    const s = overrides.sort === undefined ? sort : overrides.sort;
    if (query) params.set("q", query);
    if (g) params.set("grade", g);
    if (bf) params.set("bestFor", bf);
    if (s && s !== DEFAULT_SORT) params.set("sort", s);
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  }

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
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[oklch(0.9_0.02_130)] bg-[oklch(0.985_0.01_95)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-12 sm:py-[18px]">
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

        <form
          action="/search"
          className="flex w-full items-center gap-2.5 rounded-3xl border border-[oklch(0.88_0.02_130)] bg-[oklch(0.96_0.012_95)] px-[18px] py-[9px] sm:max-w-[480px] sm:flex-1"
        >
          <span className="text-[15px] text-[oklch(0.55_0.02_130)]">⌕</span>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search brands, products, or origins..."
            className="w-full bg-transparent text-sm text-[oklch(0.25_0.01_100)] outline-none"
          />
          {grade && <input type="hidden" name="grade" value={grade} />}
          {bestFor && <input type="hidden" name="bestFor" value={bestFor} />}
        </form>

        <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:flex-nowrap">
          <Link
            href="/submit"
            className="shrink-0 rounded-[20px] border border-[oklch(0.7_0.06_145)] px-[18px] py-[9px] text-sm font-medium whitespace-nowrap text-[oklch(0.35_0.06_145)] transition-colors hover:bg-[oklch(0.94_0.03_145)]"
          >
            Submit a Matcha
          </Link>

          {user ? (
            <>
              <span className="px-1.5 text-sm text-[oklch(0.3_0.02_100)]">{user.email}</span>
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

      <section className="mx-auto max-w-[1180px] px-4 pt-11 pb-24 sm:px-12">
        <h1 className="mb-5 text-2xl font-semibold text-[oklch(0.24_0.03_140)] font-[family-name:var(--font-noto-serif-jp)]">
          {query ? `Search results for "${query}"` : "All Matcha"}
        </h1>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={hrefFor({ grade: null })}
              className={
                grade
                  ? "rounded-[20px] border-[1.5px] border-[oklch(0.75_0.04_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.35_0.06_145)]"
                  : "rounded-[20px] border-[1.5px] border-[oklch(0.45_0.09_145)] bg-[oklch(0.45_0.09_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.99_0.005_145)]"
              }
            >
              All
            </Link>
            {GRADES.map((g) => (
              <Link
                key={g}
                href={hrefFor({ grade: g })}
                className={
                  grade === g
                    ? "rounded-[20px] border-[1.5px] border-[oklch(0.45_0.09_145)] bg-[oklch(0.45_0.09_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.99_0.005_145)]"
                    : "rounded-[20px] border-[1.5px] border-[oklch(0.75_0.04_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.35_0.06_145)]"
                }
              >
                {g}
              </Link>
            ))}
          </div>

          <SortDropdown
            currentLabel={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Top Rated"}
            options={SORT_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
              href: hrefFor({ sort: o.value }),
              active: o.value === sort,
            }))}
          />
        </div>

        <div className="mb-7 flex flex-wrap gap-2.5">
          {BEST_FOR_TAGS.map((tag) => (
            <Link
              key={tag}
              href={hrefFor({ bestFor: bestFor === tag ? null : tag })}
              className={
                bestFor === tag
                  ? "rounded-[20px] border-[1.5px] border-[oklch(0.45_0.09_145)] bg-[oklch(0.45_0.09_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.99_0.005_145)]"
                  : "rounded-[20px] border-[1.5px] border-[oklch(0.75_0.04_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.35_0.06_145)]"
              }
            >
              Good for {tag}
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[oklch(0.9_0.02_130)] py-20 text-center">
            <p className="text-lg font-semibold text-[oklch(0.24_0.03_140)] font-[family-name:var(--font-noto-serif-jp)]">
              {query || grade || bestFor ? "No matcha found" : "No matcha here yet"}
            </p>
            <p className="max-w-sm text-sm text-[oklch(0.42_0.02_120)]">
              {query
                ? `Nothing matched "${query}"${grade ? ` in ${grade}` : ""}${bestFor ? ` good for ${bestFor}` : ""}. Try a different brand, product, or origin.`
                : grade || bestFor
                  ? `No matcha found${grade ? ` in ${grade}` : ""}${bestFor ? ` good for ${bestFor}` : ""} yet. Try a different filter or browse all.`
                  : "Be the first to submit a matcha and start the reviews rolling in."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
