"use client";

import { useIsClient } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useSideBar } from "@/store/use-sidebar";
import { ToggleSkeleton } from "./SideBar/Toggle";
import { RecommendedSkeleton } from "./SideBar/Recommended";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const isClient = useIsClient();
  const { collapsed } = useSideBar((state) => state);

  if (!isClient) {
    return (
      <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2d2e35] z-50">
        <ToggleSkeleton />
        <RecommendedSkeleton />
        <RecommendedSkeleton />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2d2e35] z-50",
        collapsed && "w-[70px]"
      )}
    >
      {children}
    </aside>
  );
};
