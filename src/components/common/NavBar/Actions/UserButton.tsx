import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { User as UserIcon } from "lucide-react";
import { RootPath } from "@/constants/enum";
import { LogoutButton } from "./LogoutButton";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function UserButton({ user }: Readonly<{ user: User }>) {
  const supabase = createClient();

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full hover:!bg-gray-300 bg-gray-200 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-0 overflow-hidden"
        >
          <Image
            src={userProfile?.avatarUrl ?? "/spooky.svg"}
            alt="avatar"
            width={40}
            height={40}
            className="w-full max-w-10 max-h-10 h-auto object-cover object-center"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="text-base text-primary">
          {userProfile?.first_name ?? userProfile?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base h-9">
            <Link href={RootPath.Profile} className="w-full">
              <Button
                variant="ghost"
                className="justify-start pl-0 gap-4 w-full"
              >
                <UserIcon className="mr-2 h-5 w-5" />
                <span>Hồ sơ</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base h-9">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
