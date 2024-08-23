import React from "react";

import { Logo } from "./Logo";
import { Actions } from "./Actions";

export const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full h-20 z-[49] bg-[#252731] px-2 lg:px-4 flex items-center justify-between shadow-sm">
      <Logo />
      <Actions />
    </nav>
  );
};