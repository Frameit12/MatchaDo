import { Resend } from "resend";
import type { WeeklyReportStats } from "@/lib/weeklyReport";

// Server-only: uses RESEND_API_KEY, never import into client-bundle-reachable code.
// Constructed lazily (not at module load) so a missing key can't crash the
// build or any page that imports this module -- it just skips sending.
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const REPORT_REASON_LABELS: Record<string, string> = {
  fake: "Fake review",
  offensive: "Offensive content",
  spam: "Spam or duplicate",
  other: "Other",
};

// Reporter-supplied free text (details, usernames) must not be interpolated
// into the email HTML unescaped.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyAdminOfPendingSubmission(product: {
  id: string;
  brand_name: string;
  product_name: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const client = getResendClient();
  if (!client) {
    console.error("Cannot send admin notification email: RESEND_API_KEY is not set.");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchado.app";

  try {
    await client.emails.send({
      from: "Matchado <notifications@matchado.app>",
      to: adminEmail,
      subject: `New product pending approval: ${product.brand_name} — ${product.product_name}`,
      html: `
        <p>A new product was submitted and is waiting for your review.</p>
        <p><strong>${product.brand_name}</strong> — ${product.product_name}</p>
        <p><a href="${siteUrl}/admin">Review pending submissions</a></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}

export async function notifyAdminOfReportedReview(report: {
  productId: string;
  brandName: string;
  productName: string;
  reviewerUsername: string;
  reporterUsername: string;
  reason: string;
  details: string | null;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const client = getResendClient();
  if (!client) {
    console.error("Cannot send review report notification email: RESEND_API_KEY is not set.");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchado.app";
  const reasonLabel = REPORT_REASON_LABELS[report.reason] ?? report.reason;

  try {
    await client.emails.send({
      from: "Matchado <notifications@matchado.app>",
      to: adminEmail,
      subject: `Review reported (${reasonLabel}): ${report.brandName} — ${report.productName}`,
      html: `
        <p>A review was flagged and is waiting for your review.</p>
        <p><strong>${report.brandName}</strong> — ${report.productName}</p>
        <p>Review by: ${escapeHtml(report.reviewerUsername)}</p>
        <p>Reported by: ${escapeHtml(report.reporterUsername)}</p>
        <p>Reason: ${reasonLabel}</p>
        ${report.details ? `<p>Details: ${escapeHtml(report.details)}</p>` : ""}
        <p><a href="${siteUrl}/matcha/${report.productId}">View the product page</a></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send review report notification email:", error);
  }
}

export async function notifyAdminOfNewSignup(signup: { username: string; email: string }) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const client = getResendClient();
  if (!client) {
    console.error("Cannot send new signup notification email: RESEND_API_KEY is not set.");
    return;
  }

  try {
    await client.emails.send({
      from: "Matchado <notifications@matchado.app>",
      to: adminEmail,
      subject: `New signup: ${signup.username}`,
      html: `
        <p>A new member joined Matchado.</p>
        <p><strong>${escapeHtml(signup.username)}</strong> — ${escapeHtml(signup.email)}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send new signup notification email:", error);
  }
}

function formatReportDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export async function sendWeeklyReportEmail(stats: WeeklyReportStats) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const client = getResendClient();
  if (!client) {
    console.error("Cannot send weekly report email: RESEND_API_KEY is not set.");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchado.app";
  const rangeLabel = `${formatReportDate(stats.periodStart)} – ${formatReportDate(stats.periodEnd)}`;

  try {
    await client.emails.send({
      from: "Matchado <notifications@matchado.app>",
      to: adminEmail,
      subject: `Matchado weekly report: ${rangeLabel}`,
      html: `
        <p>Here's what happened on Matchado from ${rangeLabel}.</p>
        <p>
          <strong>Members:</strong> ${stats.newMembers} new (${stats.totalMembers} total)<br />
          <strong>Matcha submissions:</strong> ${stats.newSubmissions} new, ${stats.newApproved} approved
          (${stats.totalProducts} total, ${stats.pendingProducts} awaiting approval)<br />
          <strong>Reviews:</strong> ${stats.newReviews} new (${stats.totalReviews} total)<br />
          <strong>Reports filed:</strong> ${stats.newReports}
        </p>
        ${
          stats.pendingProducts > 0
            ? `<p><a href="${siteUrl}/admin">Review pending submissions →</a></p>`
            : ""
        }
      `,
    });
  } catch (error) {
    console.error("Failed to send weekly report email:", error);
  }
}
