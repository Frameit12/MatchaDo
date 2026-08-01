import { createAdminClient } from "@/lib/supabase/admin";

export type WeeklyReportStats = {
  periodStart: string;
  periodEnd: string;
  newMembers: number;
  totalMembers: number;
  newSubmissions: number;
  newApproved: number;
  totalProducts: number;
  pendingProducts: number;
  newReviews: number;
  totalReviews: number;
  newReports: number;
};

export async function getWeeklyReportStats(): Promise<WeeklyReportStats> {
  const admin = createAdminClient();
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
  const since = periodStart.toISOString();

  const [
    { count: newMembers },
    { count: totalMembers },
    { count: newSubmissions },
    { count: newApproved },
    { count: totalProducts },
    { count: pendingProducts },
    { count: newReviews },
    { count: totalReviews },
    { count: newReports },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", since),
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }).gte("created_at", since),
    admin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("created_at", since),
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("reviews").select("*", { count: "exact", head: true }).gte("created_at", since),
    admin.from("reviews").select("*", { count: "exact", head: true }),
    admin.from("review_reports").select("*", { count: "exact", head: true }).gte("created_at", since),
  ]);

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    newMembers: newMembers ?? 0,
    totalMembers: totalMembers ?? 0,
    newSubmissions: newSubmissions ?? 0,
    newApproved: newApproved ?? 0,
    totalProducts: totalProducts ?? 0,
    pendingProducts: pendingProducts ?? 0,
    newReviews: newReviews ?? 0,
    totalReviews: totalReviews ?? 0,
    newReports: newReports ?? 0,
  };
}
