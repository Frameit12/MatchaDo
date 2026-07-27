import { Inter, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitForm from "./SubmitForm";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-jp",
});

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div
      className={`${inter.variable} ${notoSerifJP.variable} flex min-h-screen flex-col bg-[oklch(0.97_0.02_145)] font-[family-name:var(--font-inter)]`}
    >
      <header className="flex items-center justify-between gap-6 border-b border-[oklch(0.91_0.02_145)] bg-[oklch(0.99_0.01_145)] px-14 py-[22px]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[oklch(0.45_0.09_150)]">
            <span className="text-[17px] leading-none text-white font-[family-name:var(--font-noto-serif-jp)]">
              抹
            </span>
          </div>
          <span className="text-[21px] font-semibold tracking-[0.3px] text-[oklch(0.3_0.07_150)] font-[family-name:var(--font-noto-serif-jp)]">
            Matchado
          </span>
        </Link>

        <div className="mx-10 flex max-w-[440px] flex-1 items-center gap-2.5 rounded-[10px] border border-[oklch(0.89_0.02_145)] bg-[oklch(0.95_0.02_145)] px-4 py-2.5">
          <div className="relative h-[15px] w-[15px] shrink-0 rounded-full border-2 border-[oklch(0.55_0.03_150)]">
            <div className="absolute -right-1 -bottom-1.5 h-0.5 w-1.5 rotate-45 rounded-sm bg-[oklch(0.55_0.03_150)]" />
          </div>
          <span className="text-sm text-[oklch(0.55_0.02_150)]">Search matcha, brands...</span>
        </div>

        <nav className="flex items-center gap-4 text-[15px] font-semibold">
          <Link
            href="/submit"
            className="rounded-[9px] bg-[oklch(0.4_0.09_150)] px-[18px] py-2.5 text-[oklch(0.98_0.01_145)]"
          >
            Submit a Matcha
          </Link>
          <span className="px-1 text-[oklch(0.35_0.04_150)]">{user.email}</span>
          <form action={logout}>
            <button className="px-1 py-2.5 text-[oklch(0.35_0.04_150)] hover:text-[oklch(0.3_0.08_150)]">
              Log out
            </button>
          </form>
        </nav>
      </header>

      <main className="flex flex-1 justify-center px-6 pt-16 pb-24">
        <div className="w-full max-w-[620px]">
          <SubmitForm />
        </div>
      </main>
    </div>
  );
}
