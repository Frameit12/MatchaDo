"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveProduct(productId: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status: "approved" }).eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function rejectProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
