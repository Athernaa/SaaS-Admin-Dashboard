"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;

  const { error } = await supabase.from("clients").insert([
    { name, email, company }
  ]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  redirect("/clients");
  
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  
}
