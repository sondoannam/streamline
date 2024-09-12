'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

import { RootPath } from '@/constants/enum';
import { useCurrentUserStore } from '@/providers/auth-store-provider';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { onFollow, onUnfollow } from '@/actions/follow';
import { toast } from '@/components/ui/use-toast';
import { removeEmailTrail } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ActionsProps {
  isFollowing: boolean;
  hostIdentity: string;
  isHost: boolean;
}

export const Actions = ({ isFollowing, hostIdentity, isHost }: ActionsProps) => {
  const { push } = useRouter();
  const { user } = useCurrentUserStore((state) => state);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast({
            variant: 'success',
            title: `Đã theo dõi ${data.username ?? removeEmailTrail(data.email)}`,
          }),
        )
        .catch((error) =>
          toast({
            variant: 'destructive',
            title: 'Có lỗi xảy ra',
          }),
        );
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(hostIdentity)
        .then((data) =>
          toast({
            variant: 'success',
            title: `Đã bỏ theo dõi ${data.username ?? removeEmailTrail(data.email)}`,
          }),
        )
        .catch((error) =>
          toast({
            variant: 'destructive',
            title: 'Có lỗi xảy ra',
          }),
        );
    });
  };

  const toggleFollow = () => {
    if (!user) push(RootPath.Login);

    if (isHost) return;

    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <Button
      onClick={toggleFollow}
      disabled={isPending || isHost}
      variant='primary'
      size='sm'
      className='w-full lg:w-auto'
    >
      <Heart className={cn('h-4 w-4 mr-2', isFollowing ? 'fill-white' : 'fill-none')} />
      {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
    </Button>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className='h-10 w-full lg:w-24' />;
};
