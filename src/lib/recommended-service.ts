import { createClient } from "@/utils/supabase/server";
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
    const { data: followingView } = await supabase
      .from("user_following_view")
      .select("*")
      .eq("user_id", currentUser.id)
      .single();

    const { data: blockingView } = await supabase
      .from("user_blocking_view")
      .select("*")
      .eq("user_id", currentUser.id)
      .single();

    const currentFollowing = followingView?.following
      ? `(${followingView.following.map((id) => `'${id}'`).join(", ")})`
      : "()";

    const currentBlocking = blockingView?.blocking
      ? `(${blockingView.blocking.map((id) => `'${id}'`).join(", ")})`
      : "()";

    fetchUsers = supabase
      .from("users")
      .select("*")
      .neq("id", currentUser.id)
      .not("id", "in", currentFollowing)
      .not("id", "in", currentBlocking)
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
