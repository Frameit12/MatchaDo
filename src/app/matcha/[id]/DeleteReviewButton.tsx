"use client";

import { useTransition } from "react";

export default function DeleteReviewButton({
  username,
  onDelete,
}: {
  username: string;
  onDelete: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(`Delete ${username}'s review? This cannot be undone.`);
    if (confirmed) {
      startTransition(() => {
        onDelete();
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-medium text-[oklch(0.55_0.02_150)] underline underline-offset-4 hover:text-[oklch(0.55_0.13_30)] disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
