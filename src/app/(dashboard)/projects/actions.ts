"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const client_id = formData.get("client_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("projects").insert([
    { name, client_id, status }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  return { success: true };
}
