import { createClient } from '@/utils/supabase/server';

import { getSelf } from './auth-service';

export const getFollowedUsers = async () => {
  const supabase = createClient();
  try {
    const self = await getSelf();

    const { data } = await supabase
      .from('users')
      .select('*, stream(is_live)')
      .in('id', self.following)
      .not('id', 'in', `(${self.blocking.map((id) => id).join(',')})`);

    // const { data: following } = await supabase
    //   .from('follow')
    //   .select('*, users!follow_following_id_fkey(*)')
    //   .eq('follower_id', self.id);

    return data ?? [];
  } catch (error) {
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  const supabase = createClient();
  try {
    const self = await getSelf();

    const { data: otherUser } = await supabase.from('users').select('*').eq('id', id).single();

    if (!otherUser) {
      throw new Error('User not found');
    }

    if (otherUser.id === self.id) {
      return true;
    }

    const { data: existingFollow } = await supabase
      .from('follow')
      .select('*')
      .eq('follower_id', self.id)
      .eq('following_id', otherUser.id)
      .single();

    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const supabase = createClient();
  const self = await getSelf();

  const { data: otherUser } = await supabase.from('users').select('*').eq('id', id).single();

  if (!otherUser) {
    throw new Error('User not found');
  }

  if (otherUser.id === self.id) {
    throw new Error('Cannot follow yourtself');
  }

  const { data: existingFollow } = await supabase
    .from('follow')
    .select('*')
    .eq('follower_id', self.id)
    .eq('following_id', otherUser.id)
    .single();

  if (existingFollow) {
    throw new Error('Already following user');
  }

  const { data, error: followErr } = await supabase
    .from('follow')
    .insert({
      follower_id: self.id,
      following_id: otherUser.id,
    })
    .select('*, users!follow_following_id_fkey(*)')
    .single();

  if (followErr || !data?.users) {
    console.log(followErr, data);
    throw new Error('Failed to follow user');
  }

  // create trigger to update following and followers in supabase instead of doing this manually
  /* const { error: updateFollowingErr } = await supabase
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
  } */

  return data.users;
};

export const unfollowUser = async (id: string) => {
  const supabase = createClient();
  const self = await getSelf();

  const { data: otherUser } = await supabase.from('users').select('*').eq('id', id).single();

  if (!otherUser) {
    throw new Error('User not found');
  }

  if (otherUser.id === self.id) {
    throw new Error('Cannot unfollow yourtself');
  }

  const { data: existingFollow } = await supabase
    .from('follow')
    .select('*')
    .eq('follower_id', self.id)
    .eq('following_id', otherUser.id)
    .single();

  if (!existingFollow) {
    throw new Error('Not following user');
  }

  const { data, error: deleteFollowErr } = await supabase
    .from('follow')
    .delete()
    .eq('id', existingFollow.id)
    .select('*, users!follow_following_id_fkey(*)')
    .single();

  if (deleteFollowErr || !data?.users) {
    console.log(deleteFollowErr, data);
    throw new Error('Failed to delete follow record');
  }

  // create trigger to update following and followers in supabase instead of doing this manually
  /* const { error: updateFollowingErr } = await supabase
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
  } */

  return data.users;
};
