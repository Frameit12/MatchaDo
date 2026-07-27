"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">
          Log in to Matchado
        </h1>

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
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-zinc-700 dark:text-zinc-50"
            />
          </div>

          {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-green-700 dark:text-green-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
