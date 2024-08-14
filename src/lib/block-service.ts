import { createClient } from "@/utils/supabase/server";

import { getSelf } from "./auth-service";

export const isBlockedByUser = async (id: string) => {
  const supabase = createClient();
  try {
    const self = await getSelf();

    const { data: otherUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (!otherUser) {
      throw new Error("User not found");
    }

    const { data: existingBlock } = await supabase
      .from("block")
      .select("*")
      .eq("blocker_id", self.id)
      .eq("blocked_id", otherUser.id)
      .single();

    return !!existingBlock;
  } catch (error) {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const supabase = createClient();
  const self = await getSelf();

  if (self.id === id) {
    throw new Error("Cannot block yourself");
  }

  const { data: otherUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!otherUser) {
    throw new Error("User not found");
  }

  const { data: existingBlock } = await supabase
    .from("block")
    .select("*")
    .eq("blocker_id", self.id)
    .eq("blocked_id", otherUser.id)
    .single();

  if (existingBlock) {
    throw new Error("User already blocked");
  }

  const { data, error } = await supabase
    .from("block")
    .insert({
      blocker_id: self.id,
      blocked_id: otherUser.id,
    })
    .select("*, users!block_blocked_id_fkey(*)")
    .single();

  if (error) {
    throw new Error("Failed to block user");
  }

  const { error: updateBlockedListErr } = await supabase
    .from("users")
    .update({
      blocking: [...self.blocking, otherUser.id],
    })
    .eq("id", self.id);

  if (updateBlockedListErr) {
    throw new Error("Failed to update block list");
  }

  return data.users;
};

export const unblockUser = async (id: string) => {
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

  const { data: existingBlock } = await supabase
    .from("block")
    .select("*")
    .eq("blocker_id", self.id)
    .eq("blocked_id", otherUser.id)
    .single();

  if (!existingBlock) {
    throw new Error("User not blocked");
  }

  const { data, error } = await supabase
    .from("block")
    .delete()
    .eq("id", existingBlock.id)
    .select("*, users!block_blocked_id_fkey(*)")
    .single();

  if (error) {
    throw new Error("Failed to unblock user");
  }

  return data.users;
};
