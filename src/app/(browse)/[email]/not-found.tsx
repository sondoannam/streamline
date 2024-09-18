import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { RootPath } from '@/constants/enum';

const NotFoundPage = () => {
  return (
    <div className='h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground'>
      <h1 className='text-4xl'>404</h1>
      <p>Không tìm thấy người dùng</p>
      <Button variant='secondary' asChild>
        <Link href={RootPath.Home}>Quay về trang chủ</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
