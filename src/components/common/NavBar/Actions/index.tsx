import React, { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

import { RootPath } from "@/constants/enum";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";
import { UserButton } from "./UserButton";

export async function Actions() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Suspense>
      <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
        {!user ? (
          <Link href={RootPath.Login}>
            <Button size='sm' variant='primary'>Đăng nhập</Button>
          </Link>
        ) : (
          <div className="flex items-center gap-x-4">
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <Link href={`/u/${user.email}`}>
                <Clapperboard className="h-5 w-5 lg:mr-2" />
                <span className="hidden lg:block">Dashboard</span>
              </Link>
            </Button>

            <UserButton user={user} />
          </div>
        )}
      </div>
    </Suspense>
  );
}
