import { safeRedirectPath } from "@/lib/safeRedirect";
import LoginForm from "./LoginForm";

function headingFor(next: string): string {
  if (next.startsWith("/submit")) return "Log in to submit a matcha";
  if (next.includes("/review")) return "Log in to write a review";
  return "Log in to Matchado";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextParam } = await searchParams;
  const next = safeRedirectPath(nextParam);
  const signupHref = next !== "/" ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">{headingFor(next)}</h1>

        <LoginForm next={next} signupHref={signupHref} />
      </div>
    </div>
  );
}
