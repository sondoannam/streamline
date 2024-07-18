import React from "react";

import { NavBar } from "@/components/common/NavBar";

const BrowseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavBar />
      <div className="flex h-full pt-20">{children}</div>
    </>
  );
};

export default BrowseLayout;
