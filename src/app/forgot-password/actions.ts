"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ForgotPasswordState = { message: string | null };

const GENERIC_MESSAGE = "If an account with that username exists, we've sent a password reset email.";

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const username = ((formData.get("username") as string) || "").trim();
  if (!username) return { message: GENERIC_MESSAGE };

  // Service-role client: same username->email lookup used at login, must not
  // be callable by the public anon key.
  const admin = createAdminClient();
  const { data: email } = await admin.rpc("get_email_for_username", { p_username: username });

  // Always return the same generic message whether or not the username
  // exists, so this can't be used to enumerate valid accounts.
  if (!email) return { message: GENERIC_MESSAGE };

  const headersList = await headers();
  const origin = headersList.get("origin");

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  return { message: GENERIC_MESSAGE };
}
