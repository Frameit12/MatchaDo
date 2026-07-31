"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ReportReason } from "./reportActions";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "fake", label: "Fake review" },
  { value: "offensive", label: "Offensive content" },
  { value: "spam", label: "Spam or duplicate" },
  { value: "other", label: "Other" },
];

export default function ReportReviewButton({
  isLoggedIn,
  hasReported,
  loginHref,
  onReport,
}: {
  isLoggedIn: boolean;
  hasReported: boolean;
  loginHref: string;
  onReport: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("fake");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href={loginHref}
        title="Log in to report this review"
        className="text-xs font-medium text-[oklch(0.55_0.02_150)] hover:text-[oklch(0.55_0.13_30)]"
      >
        ⚑ Report
      </Link>
    );
  }

  if (hasReported || submitted) {
    return <span className="text-xs font-medium text-[oklch(0.6_0.02_150)]">⚑ Reported</span>;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("reason", reason);
    formData.set("details", details);
    startTransition(async () => {
      await onReport(formData);
      setSubmitted(true);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-medium text-[oklch(0.55_0.02_150)] hover:text-[oklch(0.55_0.13_30)]"
      >
        ⚑ Report
      </button>

      {open && (
        <div className="absolute top-full right-0 z-10 mt-2 w-56 rounded-xl border border-[oklch(0.89_0.02_135)] bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {REASONS.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm text-[oklch(0.3_0.02_150)]">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                />
                {r.label}
              </label>
            ))}

            {reason === "other" && (
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value.slice(0, 150))}
                placeholder="Briefly explain (optional)"
                rows={2}
                className="rounded-lg border border-[oklch(0.85_0.02_135)] px-2 py-1.5 text-xs"
              />
            )}

            <div className="mt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-[oklch(0.55_0.02_150)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-[oklch(0.4_0.09_150)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Sending…" : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
