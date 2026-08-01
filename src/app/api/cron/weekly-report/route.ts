import { NextRequest, NextResponse } from "next/server";
import { getWeeklyReportStats } from "@/lib/weeklyReport";
import { sendWeeklyReportEmail } from "@/lib/email";

// Triggered by Vercel Cron (see vercel.json), which sends this exact header.
// Without a CRON_SECRET set, refuse to run rather than let the endpoint be
// publicly triggerable.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getWeeklyReportStats();
  await sendWeeklyReportEmail(stats);

  return NextResponse.json({ ok: true, stats });
}
