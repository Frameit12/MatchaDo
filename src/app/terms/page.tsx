import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Matchado",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm font-medium text-green-700 dark:text-green-500">
          ← Back to Matchado
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-black dark:text-zinc-50">Terms of Service</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated July 30, 2026</p>

        <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of Matchado, an independent,
              individually-run site for discovering and reviewing matcha. By creating an account or using
              Matchado, you agree to these Terms. If you don&apos;t agree, please don&apos;t use the site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Eligibility</h2>
            <p>
              You must be at least 13 years old to create an account. By signing up, you confirm that you
              meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Your account</h2>
            <p>
              You&apos;re responsible for the information you provide when creating an account, for keeping
              your login credentials secure, and for anything that happens under your account. Each account
              is for one person — please don&apos;t create multiple accounts or share your login with others.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Your content</h2>
            <p className="mb-3">
              You own the products, reviews, ratings, and photos you submit. By submitting content to
              Matchado, you grant us a non-exclusive, worldwide, royalty-free license to host, store,
              reproduce, and publicly display that content on the site, for as long as your content remains
              on Matchado. This license is what lets the site actually show your reviews and photos to other
              visitors.
            </p>
            <p>
              You&apos;re responsible for what you submit. Don&apos;t submit anything you don&apos;t have the
              right to share, or anything that infringes someone else&apos;s copyright, trademark, or other
              rights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Acceptable use</h2>
            <p className="mb-3">When using Matchado, you agree not to:</p>
            <ul className="list-disc pl-5">
              <li>Post false, misleading, or fake reviews (including reviews for products you haven&apos;t tried)</li>
              <li>Post illegal, infringing, defamatory, or harassing content</li>
              <li>Impersonate another person or misrepresent your affiliation with anyone</li>
              <li>Submit spam, or use the site for any commercial purpose we haven&apos;t agreed to</li>
              <li>Attempt to disrupt, overload, or gain unauthorized access to the site or other accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Moderation and removal</h2>
            <p>
              New product submissions are reviewed before they go live. We may, at our discretion, remove or
              decline to publish any content, or suspend or terminate any account, that we believe violates
              these Terms or is otherwise harmful to Matchado or its community — with or without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              Copyright complaints (DMCA)
            </h2>
            <p className="mb-3">
              If you believe content on Matchado infringes your copyright, send a notice to{" "}
              <a href="mailto:frameitbot@gmail.com" className="font-medium text-green-700 dark:text-green-500">
                frameitbot@gmail.com
              </a>{" "}
              that includes:
            </p>
            <ul className="mb-3 list-disc pl-5">
              <li>Your physical or electronic signature</li>
              <li>Identification of the copyrighted work you claim is infringed</li>
              <li>Identification of the material you claim is infringing, and where it appears on Matchado</li>
              <li>Your contact information (address, phone number, email)</li>
              <li>A statement that you have a good-faith belief the use is unauthorized</li>
              <li>
                A statement, made under penalty of perjury, that the notice is accurate and that you&apos;re
                authorized to act on behalf of the copyright owner
              </li>
            </ul>
            <p>
              We&apos;ll remove or disable access to content that we determine, in good faith, violates this
              policy, and we may terminate accounts that repeatedly infringe others&apos; copyrights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Not affiliated with any brand</h2>
            <p>
              Matchado is an independent review platform. We&apos;re not affiliated with, endorsed by, or
              sponsored by any matcha brand, producer, or retailer mentioned or listed on the site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Disclaimers</h2>
            <p>
              Reviews and ratings on Matchado reflect the opinions of individual users, not Matchado. We
              don&apos;t verify the accuracy of product information, reviews, or ratings, and we make no
              guarantees about them. Matchado is provided &quot;as is,&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Matchado and its operator won&apos;t be liable for any
              indirect, incidental, or consequential damages arising from your use of the site, or from any
              content posted by other users.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Termination</h2>
            <p>
              You can stop using Matchado, or ask us to delete your account, at any time — see our{" "}
              <Link href="/privacy" className="font-medium text-green-700 dark:text-green-500">
                Privacy Policy
              </Link>{" "}
              for how. We may suspend or terminate your access to the site for violating these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. If we do, we&apos;ll update the date at the top of
              this page. Continuing to use Matchado after a change means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Governing law</h2>
            <p>
              These Terms are governed by the laws of the State of New Jersey, United States, without regard
              to its conflict-of-laws principles.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">Contact us</h2>
            <p>
              Questions about these Terms? Reach out at{" "}
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
