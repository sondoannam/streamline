import Link from 'next/link';

import { removeEmailTrail } from '@/utils';
import { StreamDto } from '@/types/dto';

import { Thumbnail, ThumbnailSkeleton } from '@/components/common/Thumbnail';
import { LiveBadge } from '@/components/common/LiveBadge';
import { UserAvatar, UserAvatarSkeleton } from '@/components/common/UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultCardProps {
  data: StreamDto;
}

export const ResultCard = ({ data }: ResultCardProps) => {
  const username = data.users!.username ?? removeEmailTrail(data.users!.email);

  return (
    <Link href={`/${removeEmailTrail(data.users!.email)}`}>
      <div className='h-full w-full space-y-4'>
        <Thumbnail
          src={data.thumbnail_url}
          fallback={data.users!.avatar_url!}
          isLive={data.is_live}
          username={username}
        />
        {data.is_live && (
          <div className='absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform'>
            <LiveBadge />
          </div>
        )}
        <div className='flex gap-x-3'>
          <UserAvatar
            username={username}
            imageUrl={data.users!.avatar_url!}
            isLive={data.is_live}
          />
          <div className='flex flex-col text-sm overflow-hidden'>
            <p className='truncate font-semibold hover:text-blue-600'>{data.name}</p>
            <p className='text-muted-foreground'>{username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className='h-full w-full space-y-4'>
      <ThumbnailSkeleton />
      <div className='flex gap-x-3'>
        <UserAvatarSkeleton />
        <div className='flex flex-col gap-y-1'>
          <Skeleton className='w-32 h-4' />
          <Skeleton className='w-24 h-3' />
        </div>
      </div>
    </div>
  );
};
