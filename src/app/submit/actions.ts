"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminOfPendingSubmission } from "@/lib/email";

const RATING_FIELDS = ["overall", "color", "aroma", "taste", "finish", "value_for_money"] as const;

export type SubmitFormState = {
  error: string | null;
  fieldErrors: Partial<Record<"brand_name" | "product_name" | (typeof RATING_FIELDS)[number], string>>;
  success: boolean;
  productId: string | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

const GRADE_WORDS = ["ceremonial", "culinary", "unknown"];

// Someone may type the grade into the product name field instead of using
// the separate Grade dropdown (e.g. product name "Shuga Ceremonial" when the
// stored product is "Shuga" with grade "Ceremonial"). Comparing with these
// words stripped catches that without loosening typo-matching elsewhere.
function stripGradeWords(value: string): string {
  return value
    .split(" ")
    .filter((word) => !GRADE_WORDS.includes(word))
    .join(" ")
    .trim();
}

function isCloseEnough(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const dist = levenshtein(a, b);
  const threshold = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.15));
  return dist <= threshold;
}

function closeness(a: string, b: string): "exact" | "similar" | null {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return null;
  if (na === nb) return "exact";
  if (isCloseEnough(na, nb)) return "similar";

  const sa = stripGradeWords(na);
  const sb = stripGradeWords(nb);
  if (sa && sb && isCloseEnough(sa, sb)) return "similar";

  return null;
}

export type DuplicateMatch = {
  id: string;
  brand_name: string;
  product_name: string;
  status: string;
  matchType: "exact" | "similar";
};

export async function checkDuplicateProduct(brandName: string, productName: string): Promise<DuplicateMatch[]> {
  const brand = brandName.trim();
  const product = productName.trim();
  if (!brand || !product) return [];

  // Uses the admin client so we catch duplicates across every submitter and
  // status (including other users' pending products), not just what RLS
  // would let this caller see.
  const admin = createAdminClient();
  const { data: products } = await admin.from("products").select("id, brand_name, product_name, status");
  if (!products) return [];

  const matches: DuplicateMatch[] = [];
  for (const p of products) {
    const brandCloseness = closeness(brand, p.brand_name);
    const productCloseness = closeness(product, p.product_name);
    if (brandCloseness && productCloseness) {
      const matchType = brandCloseness === "exact" && productCloseness === "exact" ? "exact" : "similar";
      matches.push({ id: p.id, brand_name: p.brand_name, product_name: p.product_name, status: p.status, matchType });
    }
  }

  return matches.sort((a) => (a.matchType === "exact" ? -1 : 1));
}

export async function submitProduct(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
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

  const ratings: Record<string, number> = {};
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
    return { error: null, fieldErrors, success: false, productId: null };
  }

  const duplicates = await checkDuplicateProduct(brand_name, product_name);
  if (duplicates.length > 0 && formData.get("confirm_not_duplicate") !== "true") {
    return {
      error: "This matcha looks like it may already be in the catalog. Please review the matches above.",
      fieldErrors: {},
      success: false,
      productId: null,
    };
  }

  let productPhotoUrl: string | null = null;
  const photoForUpload = photo && photo.size > 0 ? photo : null;
  if (photoForUpload) {
    const ext = photoForUpload.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("product-photos")
      .upload(path, photoForUpload, { contentType: photoForUpload.type });

    if (uploadError) {
      return {
        error: `Photo upload failed: ${uploadError.message}`,
        fieldErrors: {},
        success: false,
        productId: null,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-photos").getPublicUrl(path);
    productPhotoUrl = publicUrl;
  }

  const { data: insertedProduct, error: insertError } = await supabase
    .from("products")
    .insert({
      brand_name,
      product_name,
      grade,
      origin,
      photo_url: productPhotoUrl,
      status: "pending",
      submitted_by: user.id,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message, fieldErrors: {}, success: false, productId: null };
  }

  const productId = insertedProduct.id;

  await notifyAdminOfPendingSubmission({ id: productId, brand_name, product_name });

  const what_i_loved = ((formData.get("what_i_loved") as string) || "").trim() || null;
  const could_be_better = ((formData.get("could_be_better") as string) || "").trim() || null;
  const descriptors = formData.getAll("descriptors") as string[];
  const bestFor = formData.getAll("best_for") as string[];
  const reviewPhoto = formData.get("review_photo") as File | null;

  let reviewPhotoUrl: string | null = null;
  if (reviewPhoto && reviewPhoto.size > 0) {
    const ext = reviewPhoto.name.split(".").pop();
    const path = `reviews/${user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("product-photos")
      .upload(path, reviewPhoto, { contentType: reviewPhoto.type });

    if (uploadError) {
      return {
        error: `Your matcha was submitted, but the review photo failed to upload: ${uploadError.message}`,
        fieldErrors: {},
        success: false,
        productId,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-photos").getPublicUrl(path);
    reviewPhotoUrl = publicUrl;
  }

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user.id,
      overall: ratings.overall,
      color: ratings.color,
      aroma: ratings.aroma,
      taste: ratings.taste,
      finish: ratings.finish,
      value_for_money: ratings.value_for_money,
      what_i_loved,
      could_be_better,
      photo_url: reviewPhotoUrl,
    })
    .select("id")
    .single();

  if (reviewError || !review) {
    return {
      error: `Your matcha was submitted, but your review couldn't be saved: ${reviewError?.message ?? "unknown error"}. You can write it from your product page.`,
      fieldErrors: {},
      success: false,
      productId,
    };
  }

  if (descriptors.length > 0) {
    const { error: descriptorError } = await supabase
      .from("review_taste_descriptors")
      .insert(descriptors.map((descriptor) => ({ review_id: review.id, descriptor })));
    if (descriptorError) {
      return {
        error: `Your matcha and review were submitted, but taste descriptors couldn't be saved: ${descriptorError.message}`,
        fieldErrors: {},
        success: false,
        productId,
      };
    }
  }

  if (bestFor.length > 0) {
    const { error: bestForError } = await supabase
      .from("review_best_for")
      .insert(bestFor.map((tag) => ({ review_id: review.id, tag })));
    if (bestForError) {
      return {
        error: `Your matcha and review were submitted, but "best for" tags couldn't be saved: ${bestForError.message}`,
        fieldErrors: {},
        success: false,
        productId,
      };
    }
  }

  return { error: null, fieldErrors: {}, success: true, productId };
}
