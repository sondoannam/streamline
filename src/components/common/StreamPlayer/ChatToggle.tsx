'use client';

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

import { useChatSideBar } from '@/store/use-chat-sidebar';
import { Hint } from '@/components/ui/hint';
import { Button } from '@/components/ui/button';

export const ChatToggle = () => {
  const { collapsed, onExpand, onCollapse } = useChatSideBar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? 'Mở chat' : 'Ẩn chat';
  
  return (
    <Hint label={label} side='left' asChild>
      <Button
        onClick={onToggle}
        variant='ghost'
        className='h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent'
      >
        <Icon className='h-4 w-4' />
      </Button>
    </Hint>
  );
};
