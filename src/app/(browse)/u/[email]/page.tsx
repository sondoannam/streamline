import React from "react";

import { notFound } from "next/navigation";

import { getUserByEmail } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { getUserName } from "@/utils";

import Actions from "./_components/Actions";

interface UserPageProps {
  params: {
    email: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByEmail(params.email);

  if (!user) notFound();

  const isFollowing = await isFollowingUser(user.id);

  return (
    <div className="flex flex-col gap-y-4">
      <Actions
        isFollowing={isFollowing}
        userId={user.id}
        username={getUserName(user)}
      />
    </div>
  );
};

export default UserPage;
