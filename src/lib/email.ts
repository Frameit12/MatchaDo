import { Resend } from "resend";

// Server-only: uses RESEND_API_KEY, never import into client-bundle-reachable code.
const resend = new Resend(process.env.RESEND_API_KEY);

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
