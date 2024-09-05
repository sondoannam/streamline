"use client";

import React from "react";

import { useSideBar } from "@/store/use-sidebar";
import { getUserName } from "@/utils";
import { UserWithStreamStatus } from "@/types/dto";

import { UserItem } from "./UserItem";

interface FollowingProps {
  data: UserWithStreamStatus[];
}

export const Following = ({ data }: FollowingProps) => {
  const { collapsed } = useSideBar((state) => state);

  if (!data.length) {
    return null;
  }

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Đang theo dõi</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            email={user.email}
            imageUrl={user.avatar_url ?? "/spooky.svg"}
            username={getUserName(user)}
            isLive={user.stream?.is_live ?? false}
          />
        ))}
      </ul>
    </div>
  );
};
