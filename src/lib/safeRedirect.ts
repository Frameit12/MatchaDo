// Only allow same-site relative paths as post-auth redirect targets, so a
// crafted `next` value can't send a logged-in user off-site (open redirect).
// Supabase's email templates hand back `next` as an absolute URL (via
// {{ .RedirectTo }}), so absolute URLs are reduced to their path+search+hash
// and the host is discarded rather than trusted.
export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/"): string {
  if (typeof value !== "string" || value === "") return fallback;

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return `${url.pathname}${url.search}${url.hash}` || fallback;
    } catch {
      return fallback;
    }
  }

  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
