import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getSelf } from "./auth-service";

export const getRecommended = async () => {
  const supabase = createClient();
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch (error) {
    userId = null;
  }

  let fetchUsers;

  if (userId) {
    fetchUsers = supabase.from("users").select("*").neq("id", userId);
  } else {
    fetchUsers = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
  }

  const { data } = await fetchUsers;

  return data ?? [];
};
