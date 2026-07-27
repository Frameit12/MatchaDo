"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupFormState = { error: string | null; message: string | null };

export async function signup(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const headersList = await headers();
  const origin = headersList.get("origin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message, message: null };
  }

  // If email confirmation is disabled on the project, signUp already
  // returns an active session, so we can go straight in.
  if (data.session) {
    redirect("/");
  }

  return {
    error: null,
    message: "Check your email to confirm your account, then log in.",
  };
}
