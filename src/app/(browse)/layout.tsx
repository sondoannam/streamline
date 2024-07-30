import React from "react";

import NavBar from "@/components/common/NavBar";
import Sidebar from "@/components/common/SideBar";
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
        <Sidebar />
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;
