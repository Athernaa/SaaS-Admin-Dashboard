"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();
  
  const amountStr = formData.get("amount") as string;
  const client_id = formData.get("client_id") as string;
  const status = formData.get("status") as string;

  const amount = parseFloat(amountStr);

  const { error } = await supabase.from("invoices").insert([
    { amount, client_id, status }
  ]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect("/invoices");
}

export async function deleteInvoiceAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  
}

export async function updateInvoiceStatusAction(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("invoices").update({ status }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  
}
