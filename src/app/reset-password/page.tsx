import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only reachable with the temporary session created by clicking a valid
  // password-reset email link.
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">Set a new password</h1>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
