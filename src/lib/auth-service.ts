import { createClient } from "@/utils/supabase/server";

export const getSelf = async () => {
  const supabase = createClient();
  const {
    data: { user: self },
  } = await supabase.auth.getUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const user = await supabase
    .from("users")
    .select("*")
    .eq("id", self.id)
    .single();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
