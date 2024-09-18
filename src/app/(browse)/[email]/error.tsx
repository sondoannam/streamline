'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { RootPath } from '@/constants/enum';

const ErrorPage = () => {
  return (
    <div className='h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground'>
      <p>Có lỗi xảy ra</p>
      <Button variant='secondary' asChild>
        <Link href={RootPath.Home}>Quay về trang chủ</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
