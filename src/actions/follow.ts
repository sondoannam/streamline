"use server";

import { RootPath } from "@/constants/enum";
import { followUser, unfollowUser } from "@/lib/follow-service";
import { revalidatePath } from "next/cache";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id);

    revalidatePath(RootPath.Home);

    if (followedUser?.users) {
      revalidatePath(`${RootPath.Profile}/${followedUser.users.email}`);
    }

    return followedUser;
  } catch (error: any) {
    console.log(error);
    throw new Error("Internal server error", error);
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unfollowedUserEmail = await unfollowUser(id);

    revalidatePath(RootPath.Home);

    if (unfollowedUserEmail) {
      revalidatePath(`${RootPath.Profile}/${unfollowedUserEmail}`);
    }

    return unfollowedUserEmail;
  } catch (error: any) {
    console.log(error);
    throw new Error("Internal server error", error);
  }
};
