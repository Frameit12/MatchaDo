"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitProduct, type SubmitFormState } from "./actions";

const initialState: SubmitFormState = { error: null, fieldErrors: {}, success: false };

export default function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitProduct, initialState);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) setSubmitted(true);
  }, [state.success]);

  function resetForm() {
    formRef.current?.reset();
    setPhotoName("");
    setSubmitted(false);
  }

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
          Your matcha has been submitted for review. We&apos;ll approve it shortly.
        </p>
        <button
          onClick={resetForm}
          className="mt-2.5 rounded-[10px] border border-[oklch(0.8_0.03_145)] bg-white px-6 py-3 text-sm font-semibold text-[oklch(0.35_0.06_150)]"
        >
          Submit another
        </button>
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
          Help the community discover something new.
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
            placeholder="e.g. Ummon Matcha"
            className="rounded-[10px] border border-[oklch(0.87_0.02_145)] bg-white px-[15px] py-[13px] text-[15px] text-[oklch(0.25_0.03_150)] placeholder:text-[oklch(0.6_0.01_145)] focus:outline-none focus:border-[oklch(0.45_0.09_150)]"
          />
          {state.fieldErrors.product_name && (
            <p className="text-sm text-[oklch(0.55_0.13_30)]">{state.fieldErrors.product_name}</p>
          )}
        </div>

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
            className="flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-[oklch(0.68_0.06_150)] bg-[oklch(0.95_0.03_145)] p-[30px] text-center"
          >
            {photoName ? (
              <div className="text-sm font-medium text-[oklch(0.35_0.07_150)]">{photoName}</div>
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
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        {state.error && <p className="text-sm text-[oklch(0.55_0.13_30)]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-[10px] bg-[oklch(0.4_0.09_150)] py-[15px] text-base font-semibold text-[oklch(0.98_0.01_145)] transition-colors hover:bg-[oklch(0.35_0.09_150)] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit Matcha"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] leading-[1.5] text-[oklch(0.55_0.02_150)]">
        All submissions are reviewed before going live to keep the catalog accurate.
      </p>
    </div>
  );
}
