import React from 'react';

import { redirect } from 'next/navigation';

import { RootPath } from '@/constants/enum';
import { getSelfByEmail } from '@/lib/auth-service';

import { NavBar } from './_components/NavBar';
import { SideBar } from './_components/SideBar';
import { Container } from './_components/Container';

interface CreatorLayoutProps {
//   params: { email: string; };
  children: React.ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  return (
    <>
      <NavBar />
      <div className='flex h-full pt-20'>
        <SideBar />
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default CreatorLayout;
