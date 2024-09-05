import { createClient } from "@/utils/supabase/server";

export const getUserByEmail = async (email: string) => {
  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*, stream(*)")
    .like("email", `${email}%`)
    .single();

  return user;
};

export const getUserById = async (id: string) => {
  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*, stream(*)")
    .eq("id", id)
    .single();

  return user;
};
