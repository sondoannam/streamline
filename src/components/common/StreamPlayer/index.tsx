'use client';

import React from 'react';

import { LiveKitRoom } from '@livekit/components-react';
import { Tables } from '@/types/supabase';
import { useViewerToken } from '@/hooks/useViewerToken';
import { useChatSideBar } from '@/store/use-chat-sidebar';
import { removeEmailTrail } from '@/utils';
import { cn } from '@/lib/utils';

import { Video, VideoSkeleton } from './Video';
import { Header, HeaderSkeleton } from './Header';
import { Chat, ChatSkeleton } from './Chat';
import { ChatToggle } from './ChatToggle';
import { InfoCard } from './InfoCard';
import { AboutCard } from './AboutCard';

interface StreamPlayerProps {
  user: Tables<'users'>;
  stream: Tables<'stream'>;
  isFollowing: boolean;
  followersCount: number;
}

export const StreamPlayer = ({ user, stream, isFollowing, followersCount }: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);
  const { collapsed } = useChatSideBar((state) => state);

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  return (
    <>
      {collapsed && (
        <div className='hidden lg:block fixed top-[100px] right-2 z-50'>
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL}
        className={cn(
          'grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full',
          collapsed && 'lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2',
        )}
      >
        <div className='space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar'>
          <Video hostName={user.username ?? removeEmailTrail(user.email)} hostIdentity={user.id} />
          <Header 
            hostName={user.username ?? removeEmailTrail(user.email)}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.avatar_url}
            isFollowing={isFollowing}
            name={stream.name}
          />
          <InfoCard 
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnail_url}
          />
          <AboutCard 
            hostName={user.username ?? removeEmailTrail(user.email)}
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio}
            followedByCount={followersCount}
          />
        </div>

        <div className={cn('col-span-1', collapsed && 'hidden')}>
          <Chat
            viewerName={name}
            hostName={removeEmailTrail(user.email)}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={stream.is_chat_enabled}
            isChatDelayed={stream.is_chat_delayed}
            isChatFollowersOnly={stream.is_chat_followers_only}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className='grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full'>
      <div className='space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10'>
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className='col-span-1 bg-background'>
        <ChatSkeleton />
      </div>
    </div>
  );
};
