import { createClient } from "@/lib/supabase/server";
import type { UserBudget } from "@/types/database";

export async function getBudget(): Promise<UserBudget | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_budgets")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load budget:", error.message);
    return null;
  }

  return data;
}
