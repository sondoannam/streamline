'use client';

import { Maximize, Minimize } from 'lucide-react';

import { Hint } from '@/components/ui/hint';

interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenControl = ({ isFullscreen, onToggle }: FullscreenControlProps) => {
  const Icon = isFullscreen ? Minimize : Maximize;

  const label = isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình';

  return (
    <div className='flex items-center justify-center gap-4'>
      <Hint label={label} asChild>
        <button
          title='toggle fullscreen'
          onClick={onToggle}
          className='text-white p-1.5 hover:bg-white/10 rounded-lg'
        >
          <Icon className='w-5 h-5' />
        </button>
      </Hint>
    </div>
  );
};
