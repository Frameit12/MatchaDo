"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const RATING_FIELDS = ["overall", "color", "aroma", "taste", "finish", "value_for_money"] as const;

export type ReviewFormState = {
  error: string | null;
  fieldErrors: Partial<Record<(typeof RATING_FIELDS)[number], string>>;
};

const initialFieldErrors: ReviewFormState["fieldErrors"] = {};

export async function submitReview(
  productId: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const ratings: Record<string, number> = {};
  const fieldErrors: ReviewFormState["fieldErrors"] = { ...initialFieldErrors };

  for (const field of RATING_FIELDS) {
    const raw = formData.get(field);
    const num = raw ? Number(raw) : 0;
    if (!num || num < 1 || num > 5) {
      fieldErrors[field] = "Please select a rating.";
    } else {
      ratings[field] = num;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: null, fieldErrors };
  }

  const what_i_loved = ((formData.get("what_i_loved") as string) || "").trim() || null;
  const could_be_better = ((formData.get("could_be_better") as string) || "").trim() || null;
  const descriptors = formData.getAll("descriptors") as string[];
  const bestFor = formData.getAll("best_for") as string[];
  const photo = formData.get("photo") as File | null;
  const removePhoto = formData.get("remove_photo") === "true";

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id, photo_url")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  let photo_url: string | null = removePhoto ? null : (existingReview?.photo_url ?? null);
  if (photo && photo.size > 0) {
    const ext = photo.name.split(".").pop();
    const path = `reviews/${user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("product-photos")
      .upload(path, photo, { contentType: photo.type });

    if (uploadError) {
      return {
        error: `Photo upload failed: ${uploadError.message}`,
        fieldErrors: {},
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-photos").getPublicUrl(path);
    photo_url = publicUrl;
  }

  const reviewFields = {
    overall: ratings.overall,
    color: ratings.color,
    aroma: ratings.aroma,
    taste: ratings.taste,
    finish: ratings.finish,
    value_for_money: ratings.value_for_money,
    what_i_loved,
    could_be_better,
    photo_url,
  };

  const { data: review, error: writeError } = existingReview
    ? await supabase.from("reviews").update(reviewFields).eq("id", existingReview.id).select("id").single()
    : await supabase
        .from("reviews")
        .insert({ ...reviewFields, product_id: productId, user_id: user.id })
        .select("id")
        .single();

  if (writeError || !review) {
    return { error: writeError?.message ?? "Failed to submit review.", fieldErrors: {} };
  }

  if (existingReview) {
    await supabase.from("review_taste_descriptors").delete().eq("review_id", review.id);
    await supabase.from("review_best_for").delete().eq("review_id", review.id);
  }

  if (descriptors.length > 0) {
    const { error: descriptorError } = await supabase
      .from("review_taste_descriptors")
      .insert(descriptors.map((descriptor) => ({ review_id: review.id, descriptor })));
    if (descriptorError) {
      return { error: descriptorError.message, fieldErrors: {} };
    }
  }

  if (bestFor.length > 0) {
    const { error: bestForError } = await supabase
      .from("review_best_for")
      .insert(bestFor.map((tag) => ({ review_id: review.id, tag })));
    if (bestForError) {
      return { error: bestForError.message, fieldErrors: {} };
    }
  }

  redirect(`/matcha/${productId}`);
}
