"use client";

import React, { Suspense } from "react";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { RootPath } from "@/constants/enum";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/common/NavBar/Actions/UserButton";
import { useCurrentUserStore } from "@/providers/auth-store-provider";

export const Actions = () => {
  const { user } = useCurrentUserStore((state) => state);

  return (
    <Suspense>
      <div className="flex items-center justify-end gap-x-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
          asChild
        >
          <Link href={RootPath.Home}>
            <LogOut className="h-5 w-5 mr-2" />
            Exit
          </Link>
        </Button>

        {user && <UserButton user={user} />}
      </div>
    </Suspense>
  );
};
