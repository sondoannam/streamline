import React from 'react';

import { notFound } from 'next/navigation';

import { getUserByEmail } from '@/lib/user-service';
import { getFollowersCount, isFollowingUser } from '@/lib/follow-service';
import { isBlockedByUser } from '@/lib/block-service';

import { StreamPlayer } from '@/components/common/StreamPlayer';

interface UserPageProps {
  params: {
    email: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByEmail(params.email);

  if (!user?.stream) notFound();

  const isBlocked = await isBlockedByUser(user.id);

  if (isBlocked) notFound();

  const isFollowing = await isFollowingUser(user.id);
  const followersCount = await getFollowersCount(user.id);

  return (
    <StreamPlayer
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
      followersCount={followersCount}
    />
  );
};

export default UserPage;
