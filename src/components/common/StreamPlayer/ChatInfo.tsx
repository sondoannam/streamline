'use client';

import { Hint } from '@/components/ui/hint';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

interface ChatInfoProps {
  isDelayed: boolean;
  isFollowersOnly: boolean;
}

export const ChatInfo = ({ isDelayed, isFollowersOnly }: ChatInfoProps) => {
  const hint = useMemo(() => {
    if (isFollowersOnly) {
      return 'Chỉ người theo dõi mới có thể xem và bình luận';
    }

    if (isDelayed && !isFollowersOnly) {
      return 'Bình luận sẽ được hiển thị sau 3 giây';
    }

    if (isDelayed && isFollowersOnly) {
      return 'Chỉ người theo dõi mới có thể bình luận. Bình luận sẽ được hiển thị sau 3 giây';
    }

    return '';
  }, [isDelayed, isFollowersOnly]);

  const label = useMemo(() => {
    if (isFollowersOnly) {
      return 'Followers only';
    }

    if (isDelayed && !isFollowersOnly) {
      return 'Delay mode';
    }

    if (isDelayed && isFollowersOnly) {
      return 'Followers only & Delay mode';
    }

    return '';
  }, [isDelayed, isFollowersOnly]);

  if (!isDelayed && !isFollowersOnly) return null;

  return (
    <div className='p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2'>
      <Hint label={hint}>
        <Info className='w-4 h-4' />
      </Hint>
      <p className='text-xs font-semibold'>{label}</p>
    </div>
  );
};
