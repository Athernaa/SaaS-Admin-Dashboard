"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTaskAction(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const project_id = formData.get("project_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("tasks").insert([
    { title, project_id, status }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function deleteTaskAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tasks");
  return { success: true };
}

export async function updateTaskStatusAction(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tasks");
  return { success: true };
}
