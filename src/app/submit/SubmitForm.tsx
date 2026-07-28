"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import StarRatingInput from "@/components/StarRatingInput";
import { usePhotoDropzone } from "@/lib/usePhotoDropzone";
import { submitProduct, checkDuplicateProduct, type SubmitFormState, type DuplicateMatch } from "./actions";

const initialState: SubmitFormState = { error: null, fieldErrors: {}, success: false, productId: null };

const CRITERIA: { key: string; label: string; tooltip?: string }[] = [
  { key: "color", label: "Color" },
  { key: "aroma", label: "Aroma" },
  { key: "taste", label: "Taste" },
  { key: "finish", label: "Finish", tooltip: "How does it taste after you swallow?" },
  { key: "value_for_money", label: "Value for Money" },
];

const TASTE_DESCRIPTORS = ["Bitter", "Umami", "Balanced", "Sweet", "Grassy", "Astringent"];

const BEST_FOR_OPTIONS = [
  { value: "Usucha", title: "Usucha", subtitle: "Thin style, everyday drinking" },
  { value: "Latte", title: "Latte", subtitle: "Mixed with milk" },
  { value: "Cooking", title: "Cooking", subtitle: "Baking and food recipes" },
];

export default function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitProduct, initialState);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");

  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [checkingDuplicates, startDuplicateCheck] = useTransition();
  const [confirmNotDuplicate, setConfirmNotDuplicate] = useState(false);

  const [overall, setOverall] = useState(0);
  const [criteria, setCriteria] = useState<Record<string, number>>({
    color: 0,
    aroma: 0,
    taste: 0,
    finish: 0,
    value_for_money: 0,
  });
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [whatILoved, setWhatILoved] = useState("");
  const [couldBeBetter, setCouldBeBetter] = useState("");
  const [reviewPhotoName, setReviewPhotoName] = useState("");

  const productPhotoInputRef = useRef<HTMLInputElement>(null);
  const productPhotoDrop = usePhotoDropzone(productPhotoInputRef, setPhotoName);
  const reviewPhotoInputRef = useRef<HTMLInputElement>(null);
  const reviewPhotoDrop = usePhotoDropzone(reviewPhotoInputRef, setReviewPhotoName);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) setSubmitted(true);
  }, [state.success]);

  useEffect(() => {
    setConfirmNotDuplicate(false);
    if (!brandName.trim() || !productName.trim()) {
      setDuplicates([]);
      return;
    }
    const timeout = setTimeout(() => {
      startDuplicateCheck(async () => {
        const matches = await checkDuplicateProduct(brandName, productName);
        setDuplicates(matches);
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [brandName, productName]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function resetForm() {
    formRef.current?.reset();
    setPhotoName("");
    setSubmitted(false);
    setBrandName("");
    setProductName("");
    setDuplicates([]);
    setConfirmNotDuplicate(false);
    setOverall(0);
    setCriteria({ color: 0, aroma: 0, taste: 0, finish: 0, value_for_money: 0 });
    setDescriptors([]);
    setBestFor([]);
    setWhatILoved("");
    setCouldBeBetter("");
    setReviewPhotoName("");
  }

  const blockedByDuplicate = duplicates.length > 0 && !confirmNotDuplicate;

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-[18px] rounded-2xl border border-[oklch(0.91_0.02_145)] bg-[oklch(0.99_0.01_145)] px-10 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.88_0.05_148)]">
          <div className="h-3 w-[22px] translate-x-0.5 -translate-y-0.5 -rotate-45 border-b-[3px] border-l-[3px] border-[oklch(0.4_0.09_150)]" />
        </div>
        <h2 className="text-[26px] font-semibold text-[oklch(0.28_0.07_150)] font-[family-name:var(--font-noto-serif-jp)]">
          Thank you!
        </h2>
        <p className="max-w-[380px] text-[15px] leading-[1.6] text-[oklch(0.45_0.03_150)]">
          Your matcha and review have been submitted. It&apos;ll go live for everyone else once an
          admin approves it, but you can view it right away.
        </p>
        <div className="mt-2.5 flex items-center gap-3">
          {state.productId && (
            <Link
              href={`/matcha/${state.productId}`}
              className="rounded-[10px] bg-[oklch(0.4_0.09_150)] px-6 py-3 text-sm font-semibold text-[oklch(0.98_0.01_145)]"
            >
              View your submission
            </Link>
          )}
          <button
            onClick={resetForm}
            className="rounded-[10px] border border-[oklch(0.8_0.03_145)] bg-white px-6 py-3 text-sm font-semibold text-[oklch(0.35_0.06_150)]"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="mb-2.5 text-[38px] font-semibold text-[oklch(0.28_0.07_150)] font-[family-name:var(--font-noto-serif-jp)]">
          Share a Matcha
        </h1>
        <p className="text-base text-[oklch(0.45_0.03_150)]">
          Help the community discover something new — and write the first review yourself.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-[26px] rounded-2xl border border-[oklch(0.91_0.02_145)] bg-[oklch(0.99_0.01_145)] p-10 shadow-[0_1px_3px_oklch(0.4_0.05_150_/_0.05)]"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
            Brand name <span className="text-[oklch(0.55_0.13_30)]">*</span>
          </label>
          <input
            type="text"
            name="brand_name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Ippodo Tea"
            className="rounded-[10px] border border-[oklch(0.87_0.02_145)] bg-white px-[15px] py-[13px] text-[15px] text-[oklch(0.25_0.03_150)] placeholder:text-[oklch(0.6_0.01_145)] focus:outline-none focus:border-[oklch(0.45_0.09_150)]"
          />
          {state.fieldErrors.brand_name && (
            <p className="text-sm text-[oklch(0.55_0.13_30)]">{state.fieldErrors.brand_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
            Product name <span className="text-[oklch(0.55_0.13_30)]">*</span>
          </label>
          <input
            type="text"
            name="product_name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Ummon Matcha"
            className="rounded-[10px] border border-[oklch(0.87_0.02_145)] bg-white px-[15px] py-[13px] text-[15px] text-[oklch(0.25_0.03_150)] placeholder:text-[oklch(0.6_0.01_145)] focus:outline-none focus:border-[oklch(0.45_0.09_150)]"
          />
          {state.fieldErrors.product_name && (
            <p className="text-sm text-[oklch(0.55_0.13_30)]">{state.fieldErrors.product_name}</p>
          )}
        </div>

        {checkingDuplicates && (
          <p className="-mt-3 text-sm text-[oklch(0.55_0.02_150)]">Checking for existing matches…</p>
        )}

        {duplicates.length > 0 && (
          <div className="-mt-1 flex flex-col gap-3 rounded-xl border border-[oklch(0.75_0.13_60)] bg-[oklch(0.97_0.04_75)] p-4">
            <p className="text-sm font-semibold text-[oklch(0.35_0.1_50)]">
              This looks like it might already be in the catalog:
            </p>
            <div className="flex flex-col gap-2">
              {duplicates.map((match) => (
                <div key={match.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[oklch(0.3_0.05_50)]">
                    <span className="font-semibold">{match.brand_name}</span> — {match.product_name}
                    {match.status === "pending" && (
                      <span className="ml-2 text-xs uppercase text-[oklch(0.5_0.08_50)]">(pending approval)</span>
                    )}
                  </span>
                  <Link href={`/matcha/${match.id}`} className="font-semibold text-[oklch(0.35_0.09_150)] hover:underline">
                    View &amp; review →
                  </Link>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[oklch(0.35_0.1_50)]">
              <input
                type="checkbox"
                checked={confirmNotDuplicate}
                onChange={(e) => setConfirmNotDuplicate(e.target.checked)}
                className="h-[15px] w-[15px] cursor-pointer accent-[oklch(0.35_0.1_50)]"
              />
              No, this is a different matcha — let me submit anyway
            </label>
            <input type="hidden" name="confirm_not_duplicate" value={confirmNotDuplicate ? "true" : "false"} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
              Grade <span className="font-normal text-[oklch(0.55_0.02_150)]">(optional)</span>
            </label>
            <select
              name="grade"
              defaultValue=""
              className="rounded-[10px] border border-[oklch(0.87_0.02_145)] bg-white px-[15px] py-[13px] text-[15px] text-[oklch(0.25_0.03_150)] focus:outline-none focus:border-[oklch(0.45_0.09_150)]"
            >
              <option value="">Select a grade</option>
              <option value="Ceremonial">Ceremonial</option>
              <option value="Culinary">Culinary</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
              Origin <span className="font-normal text-[oklch(0.55_0.02_150)]">(optional)</span>
            </label>
            <input
              type="text"
              name="origin"
              placeholder="e.g. Uji, Japan"
              className="rounded-[10px] border border-[oklch(0.87_0.02_145)] bg-white px-[15px] py-[13px] text-[15px] text-[oklch(0.25_0.03_150)] placeholder:text-[oklch(0.6_0.01_145)] focus:outline-none focus:border-[oklch(0.45_0.09_150)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
            Product photo <span className="font-normal text-[oklch(0.55_0.02_150)]">(optional)</span>
          </label>
          <label
            htmlFor="photo-input"
            {...productPhotoDrop.dropzoneProps}
            className={`flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-[1.5px] p-[30px] text-center ${
              productPhotoDrop.isDragging
                ? "border-solid border-[oklch(0.45_0.09_150)] bg-[oklch(0.9_0.05_145)]"
                : "border-dashed border-[oklch(0.68_0.06_150)] bg-[oklch(0.95_0.03_145)]"
            }`}
          >
            {productPhotoDrop.previewUrl ? (
              <div className="flex flex-col items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productPhotoDrop.previewUrl}
                  alt=""
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="text-sm font-medium text-[oklch(0.35_0.07_150)]">{photoName}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[oklch(0.88_0.05_148)]">
                  <div className="relative h-3.5 w-[18px] rounded-[3px] border-2 border-[oklch(0.45_0.09_150)]">
                    <div className="absolute -top-1.5 left-1 h-1.5 w-1.5 rounded-full border-2 border-[oklch(0.45_0.09_150)] bg-[oklch(0.95_0.03_145)]" />
                  </div>
                </div>
                <div className="text-sm font-medium text-[oklch(0.4_0.06_150)]">Upload a photo</div>
                <div className="text-xs text-[oklch(0.55_0.02_150)]">PNG or JPG, up to 10MB</div>
              </div>
            )}
            <input
              id="photo-input"
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              ref={productPhotoInputRef}
              onChange={productPhotoDrop.onChange}
            />
          </label>
        </div>

        <div className="my-1 h-px bg-[oklch(0.91_0.02_145)]" />

        <div>
          <h2 className="mb-1.5 text-2xl font-semibold text-[oklch(0.28_0.07_150)] font-[family-name:var(--font-noto-serif-jp)]">
            Write the First Review
          </h2>
          <p className="text-sm text-[oklch(0.45_0.03_150)]">
            Share your honest experience to help fellow matcha drinkers.
          </p>
        </div>

        <section>
          <label className="mb-3 block text-[15px] font-bold text-[oklch(0.28_0.07_150)]">Overall Rating</label>
          <div className="flex items-center gap-2.5">
            <StarRatingInput value={overall} onChange={setOverall} size={38} gap={8} />
            {overall > 0 && (
              <span className="ml-2 text-[15px] font-semibold text-[oklch(0.35_0.07_150)]">{overall} / 5</span>
            )}
          </div>
          <input type="hidden" name="overall" value={overall} />
          {state.fieldErrors.overall && (
            <p className="mt-2 text-sm text-[oklch(0.55_0.13_30)]">{state.fieldErrors.overall}</p>
          )}
        </section>

        <section className="flex flex-col gap-[22px]">
          {CRITERIA.map(({ key, label, tooltip }) => (
            <div key={key}>
              <div className="mb-2 flex items-center gap-1.5">
                <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">{label}</label>
                {tooltip && (
                  <span className="group relative inline-flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-[oklch(0.88_0.05_148)] text-[11px] font-bold text-[oklch(0.35_0.06_150)]">
                    i
                    <span className="pointer-events-none absolute bottom-[22px] left-1/2 z-10 -translate-x-1/2 rounded-lg bg-[oklch(0.28_0.07_150)] px-3 py-2 text-xs font-medium whitespace-nowrap text-[oklch(0.98_0.01_145)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {tooltip}
                    </span>
                  </span>
                )}
              </div>
              <StarRatingInput
                value={criteria[key]}
                onChange={(v) => setCriteria((prev) => ({ ...prev, [key]: v }))}
                size={24}
                gap={6}
              />
              <input type="hidden" name={key} value={criteria[key]} />
              {state.fieldErrors[key as keyof typeof state.fieldErrors] && (
                <p className="mt-2 text-sm text-[oklch(0.55_0.13_30)]">
                  {state.fieldErrors[key as keyof typeof state.fieldErrors]}
                </p>
              )}
            </div>
          ))}
        </section>

        <section>
          <label className="mb-3 block text-sm font-semibold text-[oklch(0.3_0.05_150)]">Taste Descriptors</label>
          <div className="flex flex-wrap gap-2.5">
            {TASTE_DESCRIPTORS.map((descriptor) => (
              <label
                key={descriptor}
                className="flex cursor-pointer items-center gap-2 rounded-[20px] border-[1.5px] border-[oklch(0.87_0.02_145)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[oklch(0.35_0.04_150)]"
              >
                <input
                  type="checkbox"
                  name="descriptors"
                  value={descriptor}
                  checked={descriptors.includes(descriptor)}
                  onChange={() => toggle(descriptors, setDescriptors, descriptor)}
                  className="h-[15px] w-[15px] cursor-pointer accent-[oklch(0.4_0.09_150)]"
                />
                {descriptor}
              </label>
            ))}
          </div>
        </section>

        <section>
          <label className="mb-3 block text-sm font-semibold text-[oklch(0.3_0.05_150)]">Best For</label>
          <div className="flex flex-wrap gap-2.5">
            {BEST_FOR_OPTIONS.map(({ value, title, subtitle }) => (
              <label
                key={value}
                className="flex min-w-[180px] cursor-pointer items-start gap-2.5 rounded-[14px] border-[1.5px] border-[oklch(0.87_0.02_145)] bg-white px-[18px] py-3"
              >
                <input
                  type="checkbox"
                  name="best_for"
                  value={value}
                  checked={bestFor.includes(value)}
                  onChange={() => toggle(bestFor, setBestFor, value)}
                  className="mt-0.5 h-[15px] w-[15px] shrink-0 cursor-pointer accent-[oklch(0.4_0.09_150)]"
                />
                <span>
                  <span className="block text-[13px] font-semibold text-[oklch(0.35_0.04_150)]">{title}</span>
                  <span className="mt-0.5 block text-xs text-[oklch(0.55_0.02_150)]">{subtitle}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">What I Loved</label>
            <span className="text-xs text-[oklch(0.55_0.02_150)]">{whatILoved.length}/150</span>
          </div>
          <textarea
            name="what_i_loved"
            maxLength={150}
            rows={2}
            value={whatILoved}
            onChange={(e) => setWhatILoved(e.target.value)}
            placeholder="The vibrant color, the smooth umami finish..."
            className="w-full resize-none rounded-xl border border-[oklch(0.87_0.02_145)] bg-white px-3.5 py-3 text-sm outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">Could Be Better</label>
            <span className="text-xs text-[oklch(0.55_0.02_150)]">{couldBeBetter.length}/150</span>
          </div>
          <textarea
            name="could_be_better"
            maxLength={150}
            rows={2}
            value={couldBeBetter}
            onChange={(e) => setCouldBeBetter(e.target.value)}
            placeholder="A touch bitter for my taste, price is steep..."
            className="w-full resize-none rounded-xl border border-[oklch(0.87_0.02_145)] bg-white px-3.5 py-3 text-sm outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[oklch(0.3_0.05_150)]">
            Review photo <span className="font-normal text-[oklch(0.55_0.02_150)]">(optional)</span>
          </label>
          <label
            htmlFor="review-photo-input"
            {...reviewPhotoDrop.dropzoneProps}
            className={`flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-[1.5px] p-[30px] text-center ${
              reviewPhotoDrop.isDragging
                ? "border-solid border-[oklch(0.45_0.09_150)] bg-[oklch(0.9_0.05_145)]"
                : "border-dashed border-[oklch(0.68_0.06_150)] bg-[oklch(0.95_0.03_145)]"
            }`}
          >
            {reviewPhotoDrop.previewUrl ? (
              <div className="flex flex-col items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reviewPhotoDrop.previewUrl}
                  alt=""
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="text-sm font-medium text-[oklch(0.35_0.07_150)]">{reviewPhotoName}</div>
              </div>
            ) : (
              <div className="text-sm font-medium text-[oklch(0.4_0.06_150)]">
                Drop a photo or click to upload
              </div>
            )}
            <input
              id="review-photo-input"
              name="review_photo"
              type="file"
              accept="image/*"
              className="hidden"
              ref={reviewPhotoInputRef}
              onChange={reviewPhotoDrop.onChange}
            />
          </label>
        </div>

        {state.error && <p className="text-sm text-[oklch(0.55_0.13_30)]">{state.error}</p>}
        {!state.error && Object.keys(state.fieldErrors).length > 0 && (
          <p className="text-sm text-[oklch(0.55_0.13_30)]">
            Please fix the highlighted field{Object.keys(state.fieldErrors).length > 1 ? "s" : ""} above before
            submitting.
          </p>
        )}

        <button
          type="submit"
          disabled={pending || blockedByDuplicate}
          title={blockedByDuplicate ? "Resolve the possible duplicate above before submitting" : undefined}
          className="mt-2 rounded-[10px] bg-[oklch(0.4_0.09_150)] py-[15px] text-base font-semibold text-[oklch(0.98_0.01_145)] transition-colors hover:bg-[oklch(0.35_0.09_150)] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit Matcha & Review"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] leading-[1.5] text-[oklch(0.55_0.02_150)]">
        All submissions are reviewed before going live to keep the catalog accurate.
      </p>
    </div>
  );
}
