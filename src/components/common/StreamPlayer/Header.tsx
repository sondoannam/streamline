'use client';

import { UserIcon } from 'lucide-react';
import { useParticipants, useRemoteParticipant } from '@livekit/components-react';

import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar, UserAvatarSkeleton } from '../UserAvatar';
import { VerifyMark } from '../VerifyMark';
import { Actions, ActionsSkeleton } from './Actions';

interface HeaderProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  imageUrl: string | null;
  isFollowing: boolean;
  name: string;
}

export const Header = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  imageUrl,
  isFollowing,
  name,
}: HeaderProps) => {
  const participants = useParticipants();
  const participant = useRemoteParticipant(hostIdentity);

  const isLive = !!participant;
  const participantCount = participants.length - 1;

  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  return (
    <div className='flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4'>
      <div className='flex items-center gap-x-3'>
        <UserAvatar
          imageUrl={imageUrl ?? '/spooky.svg'}
          username={hostName}
          size='lg'
          isLive={isLive}
        />

        <div className='space-y-1'>
          <div className='flex items-center gap-x-2'>
            <h2 className='text-lg font-semibold'>{hostName}</h2>
            <VerifyMark />
          </div>
          <p className='text-sm font-semibold'>{name}</p>
          {isLive ? (
            <div className='font-semibold flex gap-x-1 items-center text-xs text-rose-500'>
              <UserIcon className='h-4 w-4' />
              <p>{participantCount} người xem</p>
            </div>
          ) : (
            <p className='font-semibold text-xs text-muted-foreground'>Offline</p>
          )}
        </div>
      </div>

      <Actions isFollowing={isFollowing} hostIdentity={hostIdentity} isHost={isHost} />
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <div className='flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4'>
      <div className='flex items-center gap-x-2'>
        <UserAvatarSkeleton size='lg' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
      <ActionsSkeleton />
    </div>
  );
};
