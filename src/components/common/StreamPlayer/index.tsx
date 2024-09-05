'use client';

import React from 'react';

import { LiveKitRoom } from '@livekit/components-react';
import { Tables } from '@/types/supabase';
import { useViewerToken } from '@/hooks/useViewerToken';
import { removeEmailTrail } from '@/utils';

import { NotFound } from '../NotFound';
import { Video } from './Video';

interface StreamPlayerProps {
  user: Tables<'users'>;
  stream: Tables<'stream'>;
  isFollowing: boolean;
}

export const StreamPlayer = ({ user, stream, isFollowing }: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return <NotFound title='Không xem được stream' />;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL}
      className='grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full'
    >
      <div className='space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar'>
        <Video hostName={user.username ?? removeEmailTrail(user.email)} hostIdentity={user.id} />
      </div>
    </LiveKitRoom>
  );
};
