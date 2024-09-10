'use client';

import React from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

import { Hint } from '@/components/ui/hint';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  onToggle: () => void;
  onChange: (value: number) => void;
  value: number;
}

export const VolumeControl = ({ onToggle, onChange, value }: VolumeControlProps) => {
  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1;

  if (isMuted) {
    Icon = VolumeX;
  } else if (isAboveHalf) {
    Icon = Volume2;
  }

  const label = isMuted ? 'Bật âm thanh' : 'Tắt tiếng';

  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className='flex items-center gap-2'>
      <Hint label={label} asChild>
        <button
          title='toggle mute'
          onClick={onToggle}
          className='text-white p-1.5 hover:bg-white/10 rounded-lg'
        >
          <Icon className='w-6 h-6' />
        </button>
      </Hint>

      <Slider
        className='w-[8rem] cursor-pointer'
        onValueChange={handleChange}
        value={[value]}
        max={100}
        step={1}
      />
    </div>
  );
};
