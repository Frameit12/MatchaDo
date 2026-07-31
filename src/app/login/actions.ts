"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeRedirectPath } from "@/lib/safeRedirect";

export type AuthFormState = { error: string | null };

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Service-role client: the username->email lookup must not be callable
  // by the public anon key, so it runs through the admin client instead.
  const admin = createAdminClient();
  const { data: email, error: lookupError } = await admin.rpc("get_email_for_username", {
    p_username: username,
  });

  if (lookupError || !email) {
    return { error: "Invalid username or password." };
  }

  // Regular cookie-aware client for the actual sign-in, so the session
  // gets written to the browser correctly.
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid username or password." };
  }

  redirect(safeRedirectPath(formData.get("next")));
}
