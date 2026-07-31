"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safeRedirect";

export async function confirmToken(formData: FormData) {
  const token_hash = formData.get("token_hash") as string | null;
  const type = formData.get("type") as EmailOtpType | null;
  const next = safeRedirectPath(formData.get("next"));

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect(next);
    }
  }

  redirect("/login?error=confirmation_failed");
}
