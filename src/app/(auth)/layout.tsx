import Link from 'next/link';
import { Logo } from './_components/logo';
import { RootPath } from '@/constants/enum';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-fit py-6 flex flex-col items-center justify-center space-y-6'>
      <Link href={RootPath.Home}>
        <Logo />
      </Link>
      {children}
    </div>
  );
}
