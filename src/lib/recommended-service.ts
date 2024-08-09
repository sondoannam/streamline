import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getSelf } from "./auth-service";

export const getRecommended = async () => {
  const supabase = createClient();
  let currentUser;

  try {
    const self = await getSelf();
    currentUser = self;
  } catch (error) {
    currentUser = null;
  }

  let fetchUsers;

  if (currentUser) {
    const currentFollowing = `(${currentUser.following.map(id => `'${id}'`).join(", ")})`;

    fetchUsers = supabase
      .from("users")
      .select("*")
      .neq("id", currentUser.id)
      .not("id", "in", currentFollowing)
      .order("created_at", { ascending: false });
  } else {
    fetchUsers = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
  }

  const { data } = await fetchUsers;

  return data ?? [];
};
