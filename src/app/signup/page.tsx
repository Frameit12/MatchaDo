"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupFormState } from "./actions";

const initialState: SignupFormState = { error: null, message: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">
          Create your Matchado account
        </h1>

        {state.message ? (
          <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-center text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
            {state.message}
          </p>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-zinc-700 dark:text-zinc-50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-zinc-700 dark:text-zinc-50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-zinc-700 dark:text-zinc-50"
              />
            </div>

            {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Sign up"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-green-700 dark:text-green-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
