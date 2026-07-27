import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveProduct, rejectProduct } from "./actions";
import RejectButton from "./RejectButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, brand_name, product_name, grade, origin, photo_url, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const pending = products ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Admin — Pending Submissions</h1>
          <Link href="/" className="text-sm font-medium text-green-700 hover:underline">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-8 py-10">
        {pending.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <p className="text-lg font-semibold text-gray-800">No pending submissions</p>
            <p className="mt-1 text-sm text-gray-500">All caught up — nothing waiting for review.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((product) => {
              const boundApprove = approveProduct.bind(null, product.id);
              const boundReject = rejectProduct.bind(null, product.id);
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-5 rounded-lg border border-gray-200 bg-white p-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {product.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.photo_url}
                        alt={product.product_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {product.brand_name}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{product.product_name}</div>
                    <div className="mt-1 flex gap-3 text-sm text-gray-500">
                      <span>{product.grade ?? "Unknown"}</span>
                      {product.origin && <span>{product.origin}</span>}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <form action={boundApprove}>
                      <button
                        type="submit"
                        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                      >
                        Approve
                      </button>
                    </form>
                    <RejectButton productName={product.product_name} onReject={boundReject} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
