import Link from "next/link";

export const metadata = {
  title: "Contact | Matchado",
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm font-medium text-green-700 dark:text-green-500">
          ← Back to Matchado
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-black dark:text-zinc-50">Contact</h1>

        <p className="mt-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Questions, feedback, or anything else — reach out to{" "}
          <a href="mailto:frameitbot@gmail.com" className="font-medium text-green-700 dark:text-green-500">
            frameitbot@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
