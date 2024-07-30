"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import useSupabaseClient from "@/utils/supabase/client";
import { RootPath } from "@/constants/enum";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const pathname = usePathname();
  const { push, refresh } = useRouter();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error", error);
      refresh();
      return;
    }

    push(`${RootPath.Login}?next=${pathname}`);
  };
  return (
    <Button
      variant="ghost"
      className="gap-4 px-0 py-2 m-0 h-auto !hover:bg-none w-full justify-start"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-5 w-5" />
      <span>Đăng xuất</span>
    </Button>
  );
};
