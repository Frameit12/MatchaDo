// Only allow same-site relative paths as post-auth redirect targets, so a
// crafted `next` value can't send a logged-in user off-site (open redirect).
export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/"): string {
  if (typeof value !== "string" || value === "") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
