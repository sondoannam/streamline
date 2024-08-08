import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export const getRecommended = async () => {
  const supabase = createClient();
  const users = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return users.data as unknown as Tables<"users">[];
};
