import React from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { RootPath } from '@/constants/enum';

interface NotFoundProps {
  title: string;
}

export const NotFound = ({ title }: NotFoundProps) => {
  return (
    <div className='w-full h-full flex flex-col items-center gap-6'>
      <h4 className='text-4xl font-bold text-accent-foreground'>{title}</h4>
      <Link href={RootPath.Home}>
        <Button size='lg' variant='primary'>
          Trang chủ
        </Button>
      </Link>
    </div>
  );
};
