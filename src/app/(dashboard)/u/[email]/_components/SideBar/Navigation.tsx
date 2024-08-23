"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Fullscreen, KeyRound, MessageSquare, Users } from "lucide-react";

import { RootPath } from "@/constants/enum";
import { useCurrentUserStore } from "@/providers/auth-store-provider";
import { removeEmailTrail } from "@/utils";

import { NavItem, NavItemSkeleton } from "./NavItem";

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useCurrentUserStore((state) => state);

  const routes = user
    ? [
        {
          label: "Stream",
          href: `${RootPath.Profile}/${removeEmailTrail(user.email)}`,
          icon: Fullscreen,
        },
        {
          label: "Keys",
          href: `${RootPath.Profile}/${removeEmailTrail(user.email)}/keys`,
          icon: KeyRound,
        },
        {
          label: "Chat",
          href: `${RootPath.Profile}/${removeEmailTrail(user.email)}/chat`,
          icon: MessageSquare,
        },
        {
          label: "Community",
          href: `${RootPath.Profile}/${removeEmailTrail(user.email)}/community`,
          icon: Users,
        },
      ]
    : [];

  if (!user) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, index) => (
          <NavItemSkeleton key={index} />
        ))}
      </ul>
    );
  }

  return (
    <ul>
      {routes.map((route) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </ul>
  );
};
