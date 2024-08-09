"use client";

import { useSideBar } from "@/store/use-sidebar";
import { Tables } from "@/types/supabase";
import { getUserName } from "@/utils";

import { UserItem, UserItemSkeleton } from "./UserItem";

interface RecommendedProps {
  data: Tables<"users">[];
}

export const Recommended = ({ data }: RecommendedProps) => {
  const { collapsed } = useSideBar((state) => state);

  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            email={user.email}
            username={getUserName(user)}
            imageUrl={user.avatarUrl ?? "/spooky.svg"}
            isLive={true}
          />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
