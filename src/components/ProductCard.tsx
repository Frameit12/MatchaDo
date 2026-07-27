type Product = {
  id: string;
  brand_name: string;
  product_name: string;
  grade: string | null;
  origin: string | null;
  photo_url: string | null;
  avgRating: number;
  reviewCount: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const starWidthPct = Math.max(0, Math.min(1, product.avgRating / 5)) * 100;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.9_0.02_130)] bg-[oklch(0.99_0.005_95)] transition-shadow duration-200 hover:shadow-[0_12px_28px_oklch(0.3_0.03_145_/_0.12)]">
      <div className="flex h-[150px] flex-col items-center justify-center bg-[linear-gradient(135deg,oklch(0.92_0.04_140)_0%,oklch(0.86_0.06_145)_100%)]">
        {product.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.photo_url}
            alt={product.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.99_0.01_100_/_0.9)]">
              <div className="h-[38px] w-[38px] rounded-full bg-[oklch(0.48_0.09_145)]" />
            </div>
            <span className="mt-2.5 text-[11px] tracking-[1px] uppercase text-[oklch(0.35_0.04_145_/_0.75)] font-[family-name:var(--font-inter)]">
              Product photo
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 px-5 pt-5 pb-[22px]">
        <span className="text-xs font-semibold tracking-[0.5px] uppercase text-[oklch(0.48_0.08_145)] font-[family-name:var(--font-inter)]">
          {product.brand_name}
        </span>
        <span className="text-lg leading-[1.35] font-semibold text-[oklch(0.22_0.02_100)] font-[family-name:var(--font-noto-serif-jp)]">
          {product.product_name}
        </span>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="rounded-[10px] bg-[oklch(0.93_0.04_145)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.35_0.06_145)] font-[family-name:var(--font-inter)]">
            {product.grade ?? "Unknown"}
          </span>
          {product.origin && (
            <span className="text-xs text-[oklch(0.52_0.015_100)] font-[family-name:var(--font-inter)]">
              {product.origin}
            </span>
          )}
        </div>

        {product.reviewCount > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            <div
              className="relative w-[98px] whitespace-nowrap text-base tracking-[2px] text-[oklch(0.85_0.02_90)] font-[family-name:var(--font-inter)]"
              aria-hidden="true"
            >
              ★★★★★
              <div
                className="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-[oklch(0.58_0.13_145)]"
                style={{ width: `${starWidthPct}%` }}
              >
                ★★★★★
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[oklch(0.28_0.02_100)] font-[family-name:var(--font-inter)]">
              {product.avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-[oklch(0.55_0.015_100)] font-[family-name:var(--font-inter)]">
              ({product.reviewCount} reviews)
            </span>
          </div>
        ) : (
          <span className="mt-2 text-xs text-[oklch(0.55_0.015_100)] font-[family-name:var(--font-inter)]">
            No reviews yet
          </span>
        )}
      </div>
    </div>
  );
}
