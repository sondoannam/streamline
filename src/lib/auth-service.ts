import { removeEmailTrail } from "@/utils";
import { createClient } from "@/utils/supabase/server";

export const getSelf = async () => {
  const supabase = createClient();
  const {
    data: { user: self },
  } = await supabase.auth.getUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", self.id)
    .single();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getSelfByEmail = async (email: string) => {
  const supabase = createClient();
  const {
    data: { user: self },
  } = await supabase.auth.getUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .like("email", `${email}%`)
    .single();

  if (!user) {
    throw new Error("User not found");
  }

  if (removeEmailTrail(self.email!) !== email) {
    throw new Error("Unauthorized");
  }

  return user;
};
