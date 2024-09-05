'use client';

import { useSideBar } from '@/store/use-sidebar';
import { getUserName } from '@/utils';
import { UserWithStreamStatus } from '@/types/dto';

import { UserItem, UserItemSkeleton } from './UserItem';

interface RecommendedProps {
  data: UserWithStreamStatus[];
}

export const Recommended = ({ data }: RecommendedProps) => {
  const { collapsed } = useSideBar((state) => state);
  
  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className='pl-6 mb-4'>
          <p className='text-sm text-muted-foreground'>Danh sách đề cử</p>
        </div>
      )}
      <ul className='space-y-2 px-2'>
        {data.map((user) => (
          <UserItem
            key={user.id}
            email={user.email}
            username={getUserName(user)}
            imageUrl={user.avatar_url ?? '/spooky.svg'}
            isLive={user.stream?.is_live ?? false}
          />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className='px-2'>
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
