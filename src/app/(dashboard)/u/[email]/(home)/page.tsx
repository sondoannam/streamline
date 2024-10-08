import React from 'react';

import { getSelf } from '@/lib/auth-service';
import { getUserByEmail } from '@/lib/user-service';
import { NotFound } from '@/components/common/NotFound';
import { getStreamByUserId } from '@/lib/stream-service';
import { StreamPlayer } from '@/components/common/StreamPlayer';
import { getFollowersCount } from '@/lib/follow-service';

interface CreatorPageProps {
  params: { email: string };
}

const CreatorPage = async ({ params: { email } }: CreatorPageProps) => {
  const self = await getSelf();

  if (!self) {
    return <NotFound title='Unauthorized' />;
  }

  const followersCount = await getFollowersCount(self.id);

  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    return <NotFound title='Stream not found' />;
  }

  return (
    <div className='h-full'>
      <StreamPlayer user={self} stream={stream} isFollowing followersCount={followersCount} />
    </div>
  );
};

export default CreatorPage;
