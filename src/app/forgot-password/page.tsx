import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">Reset your password</h1>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Enter your username and we&apos;ll email you a link to reset your password.
        </p>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-green-700 dark:text-green-500">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
