'use client';

import { MessageSquare, Users } from 'lucide-react';

import { ChatVariant, useChatSideBar } from '@/store/use-chat-sidebar';
import { Hint } from '@/components/ui/hint';
import { Button } from '@/components/ui/button';

export const VariantToggle = () => {
  const { variant, onChangeVariant } = useChatSideBar((state) => state);

  const isChat = variant === ChatVariant.CHAT;

  const Icon = isChat ? Users : MessageSquare;

  const onToggle = () => {
    const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
  };

  const label = isChat ? 'Cộng đồng' : 'Quay lại chat';
  
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
