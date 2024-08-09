import { createClient } from "@/utils/supabase/server";

import { getSelf } from "./auth-service";
import { removeEmailTrail } from "@/utils";

export const isFollowingUser = async (id: string) => {
  try {
    const supabase = createClient();

    const self = await getSelf();

    const { data: otherUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return true;
    }

    const { data: existingFollow } = await supabase
      .from("follow")
      .select("*")
      .eq("follower_id", self.id)
      .eq("following_id", otherUser.id)
      .single();

    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const supabase = createClient();
  const self = await getSelf();

  const { data: otherUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot follow yourtself");
  }

  const { data: existingFollow } = await supabase
    .from("follow")
    .select("*")
    .eq("follower_id", self.id)
    .eq("following_id", otherUser.id)
    .single();

  if (existingFollow) {
    throw new Error("Already following user");
  }

  const { data, error: followErr } = await supabase
    .from("follow")
    .insert({
      follower_id: self.id,
      following_id: otherUser.id,
    })
    .select("*, users!follow_following_id_fkey(email)")
    .single();

  if (followErr) {
    console.log(followErr, data);
    throw new Error("Failed to follow user");
  }

  const { error: updateFollowingErr } = await supabase
    .from("users")
    .update({ following: [...self.following, otherUser.id] })
    .eq("id", self.id);

  if (updateFollowingErr) {
    console.log(updateFollowingErr);
    throw new Error("Failed to update following");
  }

  const { error: updateFollowersErr } = await supabase
    .from("users")
    .update({ followed_by: [...otherUser.followed_by, self.id] })
    .eq("id", otherUser.id);

  if (updateFollowersErr) {
    console.log(updateFollowersErr);
    throw new Error("Failed to update followers");
  }

  return data;
};

export const unfollowUser = async (id: string) => {
  const supabase = createClient();
  const self = await getSelf();

  const { data: otherUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot unfollow yourtself");
  }

  const { data: existingFollow } = await supabase
    .from("follow")
    .select("*")
    .eq("follower_id", self.id)
    .eq("following_id", otherUser.id)
    .single();

  if (!existingFollow) {
    throw new Error("Not following user");
  }

  const { error: deleteFollowErr } = await supabase
    .from("follow")
    .delete()
    .eq("id", existingFollow.id)

  if (deleteFollowErr) {
    console.log(deleteFollowErr);
    throw new Error("Failed to delete follow record");
  }

  const { error: updateFollowingErr } = await supabase
    .from("users")
    .update({ following: self.following.filter((id) => id !== otherUser.id) })
    .eq("id", self.id);

  if (updateFollowingErr) {
    console.log(updateFollowingErr);
    throw new Error("Failed to update following");
  }

  const { error: updateFollowersErr } = await supabase
    .from("users")
    .update({
      followed_by: otherUser.followed_by.filter((id) => id !== self.id),
    })
    .eq("id", otherUser.id);

  if (updateFollowersErr) {
    console.log(updateFollowersErr);
    throw new Error("Failed to update followers");
  }

  return removeEmailTrail(otherUser.email);
};