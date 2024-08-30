'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { CoppyButton } from './CoppyButton';
import { Button } from '@/components/ui/button';

interface KeyCardProps {
  value: string | null;
}

export const KeyCard = ({ value }: KeyCardProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className='rounded-xl bg-muted p-6'>
      <div className='flex gap-x-10'>
        <p className='font-semibold shrink-0 leading-10'>Stream Key</p>
        <div className='w-full space-y-2'>
          <div className='w-full flex items-center gap-x-2'>
            <Input
              value={value ?? ''}
              type={show ? 'text' : 'password'}
              disabled
              placeholder='Stream Key'
            />
            <CoppyButton value={value ?? ''} />
          </div>
          <Button size='sm' variant='link' onClick={() => setShow(!show)}>
            {show ? 'Ẩn' : 'Xem'}
          </Button>
        </div>
      </div>
    </div>
  );
};
