"use client";

import { useTransition } from "react";

export default function RejectButton({
  productName,
  onReject,
}: {
  productName: string;
  onReject: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      `Permanently delete "${productName}"? This cannot be undone.`
    );
    if (confirmed) {
      startTransition(() => {
        onReject();
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="w-full rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Rejecting…" : "Reject"}
    </button>
  );
}
