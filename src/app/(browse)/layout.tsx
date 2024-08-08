import React, { Suspense } from "react";

import NavBar from "@/components/common/NavBar";
import { Sidebar, SidebarSkeleton } from "@/components/common/SideBar";
import { Container } from "@/components/common/Container";

const BrowseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavBar />
      <div className="flex h-full pt-20">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;
