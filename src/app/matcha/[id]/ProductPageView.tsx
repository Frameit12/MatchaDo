import Link from "next/link";
import StarRow from "@/components/StarRow";

export const CRITERIA = [
  { key: "color", label: "Color" },
  { key: "aroma", label: "Aroma" },
  { key: "taste", label: "Taste" },
  { key: "finish", label: "Finish" },
  { key: "value_for_money", label: "Value for Money" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];

type ReviewCardData = {
  id: string;
  username: string;
  createdAtLabel: string;
  overall: number;
  descriptors: string[];
  whatILoved: string | null;
  couldBeBetter: string | null;
};

export type ProductPageViewProps = {
  productId: string;
  product: {
    brand_name: string;
    product_name: string;
    grade: string | null;
    origin: string | null;
    photo_url: string | null;
    status: string;
  };
  userEmail: string | null;
  onLogout: () => Promise<void>;
  reviewCount: number;
  avgOverall: number;
  criterionAverages: Record<CriterionKey, number>;
  topDescriptors: string[];
  reviews: ReviewCardData[];
};

export default function ProductPageView({
  productId,
  product,
  userEmail,
  onLogout,
  reviewCount,
  avgOverall,
  criterionAverages,
  topDescriptors,
  reviews,
}: ProductPageViewProps) {
  const grade = product.grade ?? "Unknown";

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_135)] text-[oklch(0.22_0.02_150)] font-[family-name:var(--font-noto-sans-jp)]">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-[oklch(0.89_0.02_135)] bg-[oklch(0.98_0.012_135)] px-12 py-[18px]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[oklch(0.32_0.06_150)]">
            <span className="text-[17px] text-[oklch(0.97_0.02_135)] font-[family-name:var(--font-shippori-mincho)]">
              抹
            </span>
          </div>
          <span className="text-[22px] font-semibold tracking-[0.01em] text-[oklch(0.28_0.05_150)] font-[family-name:var(--font-shippori-mincho)]">
            Matchado
          </span>
        </Link>

        <div className="flex max-w-[480px] flex-1 items-center gap-2 rounded-[10px] border border-[oklch(0.88_0.02_135)] bg-[oklch(0.99_0.005_135)] px-3.5 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <circle cx="11" cy="11" r="7" stroke="oklch(55% 0.03 150)" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="oklch(55% 0.03 150)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-[oklch(0.3_0.02_150)]">Search matcha, brands, origins...</span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/submit"
            className="rounded-lg border border-[oklch(0.32_0.06_150)] px-[18px] py-2.5 text-sm font-semibold text-[oklch(0.3_0.06_150)]"
          >
            Submit a Matcha
          </Link>
          {userEmail ? (
            <>
              <span className="text-sm text-[oklch(0.3_0.06_150)]">{userEmail}</span>
              <form action={onLogout}>
                <button className="rounded-lg bg-[oklch(0.32_0.06_150)] px-5 py-2.5 text-sm font-semibold text-[oklch(0.98_0.01_135)]">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[oklch(0.32_0.06_150)] px-5 py-2.5 text-sm font-semibold text-[oklch(0.98_0.01_135)]"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] px-12 pt-11 pb-20">
        <div className="mb-[18px] flex items-center gap-2 text-[13px] text-[oklch(0.5_0.02_150)]">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{grade} Grade</span>
          <span>/</span>
          <span className="text-[oklch(0.35_0.02_150)]">{product.product_name}</span>
        </div>

        <div className="mb-9 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-3">
              <h1 className="text-[38px] font-semibold text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
                {product.product_name}
              </h1>
              <span className="shrink-0 rounded-full bg-[oklch(0.32_0.06_150)] px-3.5 py-[5px] text-xs font-bold tracking-[0.06em] whitespace-nowrap text-[oklch(0.98_0.01_135)] uppercase">
                {grade} Grade
              </span>
              {product.status === "pending" && (
                <span className="shrink-0 rounded-full bg-[oklch(0.85_0.13_80)] px-3.5 py-[5px] text-xs font-bold tracking-[0.06em] whitespace-nowrap text-[oklch(0.3_0.1_70)] uppercase">
                  Pending Approval
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3.5 text-[15px] text-[oklch(0.45_0.03_150)]">
              <span>
                by <span className="font-semibold">{product.brand_name}</span>
              </span>
              {product.origin && (
                <>
                  <span className="inline-block h-1 w-1 rounded-full bg-[oklch(0.7_0.02_150)]" />
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="oklch(55% 0.03 150)" strokeWidth="1.5" />
                    </svg>
                    Origin: {product.origin}
                  </span>
                </>
              )}
            </div>
          </div>
          <Link
            href={`/matcha/${productId}/review`}
            className="shrink-0 rounded-lg bg-[oklch(0.32_0.06_150)] px-7 py-3.5 text-[15px] font-bold whitespace-nowrap text-[oklch(0.98_0.01_135)]"
          >
            Write a Review
          </Link>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_135)] bg-[repeating-linear-gradient(135deg,oklch(0.93_0.03_140)_0px,oklch(0.93_0.03_140)_14px,oklch(0.9_0.03_140)_14px,oklch(0.9_0.03_140)_28px)]">
            {product.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.photo_url} alt={product.product_name} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-md bg-[oklch(0.98_0.01_135_/_0.85)] px-4 py-2 font-mono text-[13px] text-[oklch(0.38_0.04_145)]">
                  product photo
                </span>
              </div>
            )}
          </div>

          <div>
            {reviewCount > 0 ? (
              <>
                <div className="mb-1.5 flex items-baseline gap-4">
                  <span className="text-[56px] leading-none font-semibold text-[oklch(0.28_0.05_150)] font-[family-name:var(--font-shippori-mincho)]">
                    {avgOverall.toFixed(1)}
                  </span>
                  <div>
                    <div className="mb-1">
                      <StarRow rating={avgOverall} size={22} gap={3} />
                    </div>
                    <div className="text-sm text-[oklch(0.48_0.02_150)]">
                      {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                </div>

                <div className="my-6 h-px bg-[oklch(0.88_0.02_135)]" />

                {topDescriptors.length > 0 && (
                  <>
                    <div className="mb-6">
                      <div className="mb-0.5 text-[15px] font-bold text-[oklch(0.24_0.03_150)]">
                        Community Taste Profile
                      </div>
                      <div className="mb-3 text-[13px] text-[oklch(0.5_0.02_150)]">
                        Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {topDescriptors.map((descriptor) => (
                          <span
                            key={descriptor}
                            className="rounded-full bg-[oklch(0.93_0.03_140)] px-4 py-1.5 text-[13px] font-semibold text-[oklch(0.28_0.06_150)]"
                          >
                            {descriptor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="my-6 h-px bg-[oklch(0.88_0.02_135)]" />
                  </>
                )}

                <div className="flex flex-col gap-3.5">
                  {CRITERIA.map(({ key, label }) => (
                    <div key={key} className="grid grid-cols-[110px_1fr_34px] items-center gap-3">
                      <span className="text-sm text-[oklch(0.38_0.02_150)]">{label}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.9_0.02_135)]">
                        <div
                          className="h-full bg-[oklch(0.32_0.06_150)]"
                          style={{ width: `${(criterionAverages[key] / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-right text-[13px] font-semibold text-[oklch(0.35_0.02_150)]">
                        {criterionAverages[key].toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[oklch(0.88_0.02_135)] py-16 text-center">
                <p className="mb-1 text-lg font-semibold text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
                  No ratings yet
                </p>
                <p className="max-w-xs text-sm text-[oklch(0.48_0.02_150)]">
                  Be the first to rate this matcha.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
              Reviews
            </h2>
            <span className="text-sm text-[oklch(0.5_0.02_150)]">{reviewCount} total</span>
          </div>

          {reviewCount > 0 ? (
            <div className="flex flex-col gap-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-[oklch(0.89_0.02_135)] bg-[oklch(0.99_0.005_135)] px-7 py-[26px]"
                >
                  <div className="mb-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[oklch(0.9_0.03_140)] text-[15px] font-semibold text-[oklch(0.32_0.06_150)] font-[family-name:var(--font-shippori-mincho)]">
                        {review.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[oklch(0.24_0.02_150)]">{review.username}</div>
                        <div className="text-[13px] text-[oklch(0.52_0.02_150)]">{review.createdAtLabel}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <StarRow rating={review.overall} />
                      {review.descriptors.map((descriptor, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[oklch(0.93_0.03_140)] px-3 py-1 text-xs font-semibold text-[oklch(0.32_0.06_150)]"
                        >
                          {descriptor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {review.whatILoved && (
                      <div>
                        <div className="mb-1.5 text-xs font-bold tracking-[0.05em] text-[oklch(0.38_0.06_150)] uppercase">
                          What I loved
                        </div>
                        <div className="text-sm leading-[1.55] text-[oklch(0.3_0.02_150)]">{review.whatILoved}</div>
                      </div>
                    )}
                    {review.couldBeBetter && (
                      <div>
                        <div className="mb-1.5 text-xs font-bold tracking-[0.05em] text-[oklch(0.55_0.04_40)] uppercase">
                          Could be better
                        </div>
                        <div className="text-sm leading-[1.55] text-[oklch(0.3_0.02_150)]">{review.couldBeBetter}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-[oklch(0.88_0.02_135)] py-16 text-center">
              <p className="text-lg font-semibold text-[oklch(0.24_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
                No reviews yet
              </p>
              <p className="max-w-sm text-sm text-[oklch(0.48_0.02_150)]">
                Be the first to share your thoughts on this matcha.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
