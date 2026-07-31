import { type EmailOtpType } from "@supabase/supabase-js";
import { safeRedirectPath } from "@/lib/safeRedirect";
import { confirmToken } from "./actions";

const HEADINGS: Partial<Record<EmailOtpType, string>> = {
  recovery: "Reset your password",
  signup: "Confirm your email",
  email_change: "Confirm your new email",
  invite: "Accept your invite",
  magiclink: "Log in",
};

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next: nextParam } = await searchParams;
  const next = safeRedirectPath(nextParam);

  if (!token_hash || !type) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Invalid link</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This link is missing information it needs to work. Please request a new one.
          </p>
        </div>
      </div>
    );
  }

  const heading = HEADINGS[type as EmailOtpType] ?? "Confirm";

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">{heading}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Click below to continue. This extra step protects your account from being confirmed
          automatically by email security scanners.
        </p>

        <form action={confirmToken} className="mt-6">
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next} />

          <button
            type="submit"
            className="w-full rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
