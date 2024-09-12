'use client';

import { useTransition } from 'react';

import { MinusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Hint } from '@/components/ui/hint';
import { cn } from '@/lib/utils';
import { stringToColor } from '@/utils';
import { onBlock } from '@/actions/block';
import { toast } from '@/components/ui/use-toast';

interface CommunityItemProps {
  hostName: string;
  viewerName: string;
  participantName?: string;
  participantIdentity: string;
}

export const CommunityItem = ({
  hostName,
  viewerName,
  participantName,
  participantIdentity,
}: CommunityItemProps) => {
  const [isPending, startTransition] = useTransition();

  const color = stringToColor(participantName ?? '');
  const isSelf = participantName === viewerName;
  const isHost = participantName === hostName;

  const handleBlock = () => {
    if (!participantName || isSelf || !isHost) return;

    startTransition(() => {
      onBlock(participantIdentity)
        .then(() =>
          toast({
            variant: 'muted',
            title: `Đã chặn ${participantName}`,
          }),
        )
        .catch(() =>
          toast({
            variant: 'destructive',
            title: 'Có lỗi xảy ra',
          }),
        );
    });
  };

  return (
    <div
      className={cn(
        'group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5',
        isPending && 'opacity-50 pointer-events-none',
      )}
    >
      <p style={{ color: color }}>{participantName}</p>
      {isHost && !isSelf && (
        <Hint label='Chặn'>
          <Button
            variant='ghost'
            onClick={handleBlock}
            disabled={isPending}
            className='h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition'
          >
            <MinusCircle className='h-4 w-4 text-muted-foreground' />
          </Button>
        </Hint>
      )}
    </div>
  );
};
