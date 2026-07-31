import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Matchado",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm font-medium text-green-700 dark:text-green-500">
          ← Back to Matchado
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-black dark:text-zinc-50">Privacy Policy</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated July 30, 2026</p>

        <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <p>
              Matchado is an independent, individually-run site for discovering and reviewing matcha. This
              policy explains what information we collect, why we collect it, and what rights you have over
              it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Information we collect</h2>
            <p className="mb-3">
              <strong>Account information.</strong> When you sign up, we collect the email address and
              username you provide, and a password (which we never see or store directly — it&apos;s handled
              by our authentication provider).
            </p>
            <p className="mb-3">
              <strong>Content you submit.</strong> Products you submit (brand, product name, grade, origin,
              and any photo) and reviews you write (ratings, tasting notes, and any photo) are stored and
              displayed on the site.
            </p>
            <p>
              <strong>Automatically collected information.</strong> Like most websites, our hosting provider
              logs basic technical information (such as IP address and browser type) for security and
              reliability. We don&apos;t run any analytics or advertising trackers, and we don&apos;t use
              cookies for anything beyond keeping you signed in.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              Your content is public
            </h2>
            <p>
              Products, reviews, ratings, photos, and your username are visible to anyone who visits
              Matchado — none of it is private. Please don&apos;t include anything in a review or photo that
              you wouldn&apos;t want publicly visible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">How we use your information</h2>
            <p>
              We process your account information because it&apos;s necessary to provide the account you
              signed up for (to let you log in, submit matcha, and write reviews). We use your information to
              operate your account, let you sign in, display the content you submit, and moderate submissions
              before they go live. We don&apos;t use your email for marketing, and we don&apos;t sell or rent
              your information to anyone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Who we share it with</h2>
            <p className="mb-3">
              We use Supabase to handle sign-in, store data, and host uploaded photos, and Vercel to host the
              site itself. These providers process your information only to the extent needed to run
              Matchado — we don&apos;t share your information with anyone else.
            </p>
            <p>
              Supabase and Vercel may process and store data in the United States or other countries outside
              your own, including outside the European Economic Area. Both providers rely on the European
              Commission&apos;s Standard Contractual Clauses as a safeguard for these transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">How long we keep your data</h2>
            <p>
              We keep your account and the content you submit for as long as your account is active. If you
              ask us to delete your account, we&apos;ll delete your account information and reviews within a
              reasonable time, except where we need to keep something to comply with a legal obligation or
              resolve a dispute.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Your rights and choices</h2>
            <p className="mb-3">
              You can edit or delete any review you&apos;ve written at any time from its page. Beyond that,
              you have the right to:
            </p>
            <ul className="mb-3 list-disc pl-5">
              <li>Ask what personal data we hold about you, and get a copy of it</li>
              <li>Ask us to correct inaccurate data</li>
              <li>Ask us to delete your account and associated data</li>
              <li>Ask us to restrict or object to how we process your data</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw consent at any time, where processing is based on consent</li>
            </ul>
            <p className="mb-3">
              To exercise any of these, email{" "}
              <a href="mailto:frameitbot@gmail.com" className="font-medium text-green-700 dark:text-green-500">
                frameitbot@gmail.com
              </a>{" "}
              and we&apos;ll take care of it. If you&apos;re in the EU, UK, or EEA and believe we haven&apos;t
              handled your data properly, you also have the right to lodge a complaint with your local data
              protection supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Children&apos;s privacy</h2>
            <p>
              Matchado isn&apos;t directed at children, and we don&apos;t knowingly collect information from
              anyone under 13.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Changes to this policy</h2>
            <p>
              If this policy changes, we&apos;ll update the date at the top of this page. Continued use of
              Matchado after a change means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Contact us</h2>
            <p>
              Questions about this policy or your data? Reach out at{" "}
              <a href="mailto:frameitbot@gmail.com" className="font-medium text-green-700 dark:text-green-500">
                frameitbot@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
