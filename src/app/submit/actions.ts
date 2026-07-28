"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SubmitFormState = {
  error: string | null;
  fieldErrors: { brand_name?: string; product_name?: string };
  success: boolean;
};

export async function submitProduct(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  // TEMP: whole body wrapped for debugging — any exception that isn't one
  // of the already-handled cases below gets surfaced as state.error instead
  // of failing silently as an unhandled rejection.
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const brand_name = ((formData.get("brand_name") as string) || "").trim();
    const product_name = ((formData.get("product_name") as string) || "").trim();
    const gradeRaw = (formData.get("grade") as string) || "";
    const grade = gradeRaw.trim() !== "" ? gradeRaw : null;
    const originRaw = ((formData.get("origin") as string) || "").trim();
    const origin = originRaw !== "" ? originRaw : null;
    const photo = formData.get("photo") as File | null;

    const fieldErrors: SubmitFormState["fieldErrors"] = {};
    if (!brand_name) fieldErrors.brand_name = "Brand name is required.";
    if (!product_name) fieldErrors.product_name = "Product name is required.";

    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors, success: false };
    }

    let photo_url: string | null = null;
    if (photo && photo.size > 0) {
      const ext = photo.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(path, photo, { contentType: photo.type });

      if (uploadError) {
        return {
          error: `[debug] Photo upload failed: ${uploadError.message}`,
          fieldErrors: {},
          success: false,
        };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-photos").getPublicUrl(path);
      photo_url = publicUrl;
    }

    const { error: insertError } = await supabase.from("products").insert({
      brand_name,
      product_name,
      grade,
      origin,
      photo_url,
      status: "pending",
      submitted_by: user.id,
    });

    if (insertError) {
      return {
        error: `[debug] Insert failed: ${insertError.message} (code: ${insertError.code ?? "?"})`,
        fieldErrors: {},
        success: false,
      };
    }

    return { error: null, fieldErrors: {}, success: true };
  } catch (err) {
    // Next's redirect() throws internally by design — rethrow so it still
    // navigates instead of being caught here as a fake error.
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;

    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { error: `[debug] Unexpected error: ${message}`, fieldErrors: {}, success: false };
  }
}
