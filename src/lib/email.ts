import { Resend } from "resend";

// Server-only: uses RESEND_API_KEY, never import into client-bundle-reachable code.
const resend = new Resend(process.env.RESEND_API_KEY);

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchado.app";

  try {
    await resend.emails.send({
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchado.app";
  const reasonLabel = REPORT_REASON_LABELS[report.reason] ?? report.reason;

  try {
    await resend.emails.send({
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
