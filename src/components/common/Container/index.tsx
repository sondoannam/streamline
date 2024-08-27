"use client";

import { useMediaQuery } from "usehooks-ts";
import { useSideBar } from "@/store/use-sidebar";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  const matches = useMediaQuery(`(min-width: 1024px)`);
  const { collapsed, onCollapse, onExpand } = useSideBar((state) => state);

  useEffect(() => {
    if (matches) {
      onExpand();
    } else {
      onCollapse();
    }
  }, [matches, onCollapse, onExpand]);

  return (
    <div
      className={cn("flex-1", collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60")}
    >
      {children}
    </div>
  );
};
