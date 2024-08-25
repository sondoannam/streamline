"use client";

import React from "react";

import { Tables } from "@/types/supabase";
import { useSideBar } from "@/store/use-sidebar";
import { UserItem } from "./UserItem";
import { getUserName } from "@/utils";

interface FollowingProps {
  data: Tables<"users">[];
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
            isLive={true}
          />
        ))}
      </ul>
    </div>
  );
};
