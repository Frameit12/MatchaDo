"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminOfReportedReview } from "@/lib/email";

const REASONS = ["fake", "offensive", "spam", "other"] as const;
export type ReportReason = (typeof REASONS)[number];

export async function reportReview(productId: string, reviewId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/matcha/${productId}`)}`);
  }

  const reasonRaw = formData.get("reason");
  const reason = (REASONS as readonly string[]).includes(reasonRaw as string)
    ? (reasonRaw as ReportReason)
    : null;
  if (!reason) return;

  const detailsRaw = ((formData.get("details") as string) || "").trim();
  const details = reason === "other" && detailsRaw ? detailsRaw.slice(0, 150) : null;

  const { error } = await supabase.from("review_reports").insert({
    review_id: reviewId,
    reporter_id: user.id,
    reason,
    details,
  });

  // A unique-violation here just means this user already reported this
  // review -- treat it as a harmless no-op rather than surfacing an error.
  if (!error) {
    const admin = createAdminClient();
    const [{ data: product }, { data: review }, { data: reporterProfile }] = await Promise.all([
      admin.from("products").select("brand_name, product_name").eq("id", productId).single(),
      admin.from("reviews").select("user_id").eq("id", reviewId).single(),
      admin.from("profiles").select("username").eq("id", user.id).single(),
    ]);

    const reviewerProfile = review
      ? (await admin.from("profiles").select("username").eq("id", review.user_id).single()).data
      : null;

    await notifyAdminOfReportedReview({
      productId,
      brandName: product?.brand_name ?? "Unknown",
      productName: product?.product_name ?? "Unknown",
      reviewerUsername: reviewerProfile?.username ?? "unknown",
      reporterUsername: reporterProfile?.username ?? "unknown",
      reason,
      details,
    });
  }

  revalidatePath(`/matcha/${productId}`);
}
