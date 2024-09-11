'use client';

import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { ChatInfo } from './ChatInfo';

interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}

export const ChatForm = ({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}: ChatFormProps) => {
  const [isDelayedBlocked, setIsDelayedBlocked] = useState(false);

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled = isHidden || isFollowersOnlyAndNotFollowing || isDelayedBlocked;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayedBlocked) {
      setIsDelayedBlocked(true);
      setTimeout(() => {
        setIsDelayedBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      onSubmit();
    }
  };

  if (isHidden) return null;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center gap-y-4 p-3'>
      <div className='w-full'>
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Nhập bình luận...'
          disabled={isDisabled}
          className={cn('border-white/10', isFollowersOnly && 'roundedt-t-none border-t-0')}
        />
      </div>
      <div className='ml-auto'>
        <Button type='submit' variant='primary' size='sm' disabled={isDisabled}>
          Gửi
        </Button>
      </div>
    </form>
  );
};

export const ChatFormSkeleton = () => {
  return (
    <div className='flex flex-col items-center gap-y-4 p-3'>
      <Skeleton className='w-full h-10' />
      <div className='flex items-center gap-x-2 ml-auto'>
        <Skeleton className='h-7 w-7' />
        <Skeleton className='h-7 w-12' />
      </div>
    </div>
  );
};
