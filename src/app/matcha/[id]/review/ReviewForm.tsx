"use client";

import { useActionState, useState } from "react";
import StarRatingInput from "@/components/StarRatingInput";
import type { ReviewFormState } from "./actions";

const initialState: ReviewFormState = { error: null, fieldErrors: {} };

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

export default function ReviewForm({
  action,
}: {
  action: (prevState: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

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
  const [photoName, setPhotoName] = useState("");

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  return (
    <div className="rounded-[20px] border border-[oklch(0.9_0.025_140)] bg-[oklch(0.99_0.006_140)] px-12 py-11">
      <h1 className="mb-1.5 text-2xl font-semibold text-[oklch(0.22_0.03_150)] font-[family-name:var(--font-shippori-mincho)]">
        Write a Review
      </h1>
      <p className="mb-9 text-sm text-[oklch(0.48_0.02_140)]">
        Share your honest experience to help fellow matcha drinkers.
      </p>

      <form action={formAction} className="flex flex-col">
        <section className="mb-9">
          <label className="mb-3 block text-[15px] font-bold text-[oklch(0.24_0.03_150)]">Overall Rating</label>
          <div className="flex items-center gap-2.5">
            <StarRatingInput value={overall} onChange={setOverall} size={44} gap={10} />
            {overall > 0 && (
              <span className="ml-2 text-[15px] font-semibold text-[oklch(0.4_0.05_150)]">{overall} / 5</span>
            )}
          </div>
          <input type="hidden" name="overall" value={overall} />
          {state.fieldErrors.overall && (
            <p className="mt-2 text-sm text-[oklch(0.55_0.13_30)]">{state.fieldErrors.overall}</p>
          )}
        </section>

        <section className="mb-9 flex flex-col gap-[22px]">
          {CRITERIA.map(({ key, label, tooltip }) => (
            <div key={key}>
              <div className="mb-2 flex items-center gap-1.5">
                <label className="text-sm font-semibold text-[oklch(0.28_0.03_150)]">{label}</label>
                {tooltip && (
                  <span className="group relative inline-flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-[oklch(0.85_0.03_140)] text-[11px] font-bold text-[oklch(0.35_0.05_150)] hover:bg-[oklch(0.75_0.04_140)]">
                    i
                    <span className="pointer-events-none absolute bottom-[22px] left-1/2 z-10 -translate-x-1/2 rounded-lg bg-[oklch(0.22_0.03_150)] px-3 py-2 text-xs font-medium whitespace-nowrap text-[oklch(0.98_0.005_140)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {tooltip}
                    </span>
                  </span>
                )}
              </div>
              <StarRatingInput
                value={criteria[key]}
                onChange={(v) => setCriteria((prev) => ({ ...prev, [key]: v }))}
                size={26}
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

        <section className="mb-8">
          <label className="mb-3 block text-[15px] font-bold text-[oklch(0.24_0.03_150)]">Taste Descriptors</label>
          <div className="flex flex-wrap gap-2.5">
            {TASTE_DESCRIPTORS.map((descriptor) => (
              <label
                key={descriptor}
                className="flex cursor-pointer items-center gap-2 rounded-[20px] border-[1.5px] border-[oklch(0.87_0.03_140)] bg-[oklch(0.98_0.008_140)] px-4 py-2.5 text-[13px] font-semibold text-[oklch(0.38_0.02_140)]"
              >
                <input
                  type="checkbox"
                  name="descriptors"
                  value={descriptor}
                  checked={descriptors.includes(descriptor)}
                  onChange={() => toggle(descriptors, setDescriptors, descriptor)}
                  className="h-[15px] w-[15px] cursor-pointer accent-[oklch(0.32_0.06_150)]"
                />
                {descriptor}
              </label>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <label className="mb-3 block text-[15px] font-bold text-[oklch(0.24_0.03_150)]">Best For</label>
          <div className="flex flex-wrap gap-2.5">
            {BEST_FOR_OPTIONS.map(({ value, title, subtitle }) => (
              <label
                key={value}
                className="flex min-w-[180px] cursor-pointer items-start gap-2.5 rounded-[14px] border-[1.5px] border-[oklch(0.87_0.03_140)] bg-[oklch(0.98_0.008_140)] px-[18px] py-3"
              >
                <input
                  type="checkbox"
                  name="best_for"
                  value={value}
                  checked={bestFor.includes(value)}
                  onChange={() => toggle(bestFor, setBestFor, value)}
                  className="mt-0.5 h-[15px] w-[15px] shrink-0 cursor-pointer accent-[oklch(0.32_0.06_150)]"
                />
                <span>
                  <span className="block text-[13px] font-semibold text-[oklch(0.38_0.02_140)]">{title}</span>
                  <span className="mt-0.5 block text-xs text-[oklch(0.5_0.02_140)]">{subtitle}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="mb-[26px]">
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-[15px] font-bold text-[oklch(0.24_0.03_150)]">What I Loved</label>
            <span className="text-xs text-[oklch(0.55_0.02_140)]">{whatILoved.length}/150</span>
          </div>
          <textarea
            name="what_i_loved"
            maxLength={150}
            rows={2}
            value={whatILoved}
            onChange={(e) => setWhatILoved(e.target.value)}
            placeholder="The vibrant color, the smooth umami finish..."
            className="w-full resize-none rounded-xl border border-[oklch(0.87_0.03_140)] bg-[oklch(0.975_0.012_140)] px-3.5 py-3 text-sm outline-none"
          />
        </section>

        <section className="mb-8">
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-[15px] font-bold text-[oklch(0.24_0.03_150)]">Could Be Better</label>
            <span className="text-xs text-[oklch(0.55_0.02_140)]">{couldBeBetter.length}/150</span>
          </div>
          <textarea
            name="could_be_better"
            maxLength={150}
            rows={2}
            value={couldBeBetter}
            onChange={(e) => setCouldBeBetter(e.target.value)}
            placeholder="A touch bitter for my taste, price is steep..."
            className="w-full resize-none rounded-xl border border-[oklch(0.87_0.03_140)] bg-[oklch(0.975_0.012_140)] px-3.5 py-3 text-sm outline-none"
          />
        </section>

        <section className="mb-10">
          <label className="mb-1 block text-[15px] font-bold text-[oklch(0.24_0.03_150)]">
            Photo <span className="font-medium text-[oklch(0.55_0.02_140)]">(optional)</span>
          </label>
          <p className="mb-3 text-[13px] text-[oklch(0.5_0.02_140)]">
            Show off the whisked bowl, the packaging, or your setup.
          </p>
          <label
            htmlFor="review-photo-input"
            className="block cursor-pointer rounded-2xl border-2 border-dashed border-[oklch(0.78_0.04_140)] bg-[oklch(0.975_0.012_140)] p-1.5"
          >
            <div className="flex h-[180px] w-full items-center justify-center rounded-xl bg-[oklch(0.97_0.008_140)] text-center text-sm text-[oklch(0.5_0.02_140)]">
              {photoName || "Drop a photo or click to upload"}
            </div>
            <input
              id="review-photo-input"
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </section>

        {state.error && <p className="mb-4 text-sm text-[oklch(0.55_0.13_30)]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-[14px] bg-[oklch(0.3_0.07_150)] py-4 text-base font-bold tracking-[0.01em] text-[oklch(0.99_0.005_140)] hover:bg-[oklch(0.25_0.07_150)] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
