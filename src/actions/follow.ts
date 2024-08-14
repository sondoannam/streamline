"use server";

import { revalidatePath } from "next/cache";

import { RootPath } from "@/constants/enum";
import { followUser, unfollowUser } from "@/lib/follow-service";
import { removeEmailTrail } from "@/utils";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id);

    revalidatePath(RootPath.Home);

    if (followedUser) {
      revalidatePath(
        `${RootPath.Profile}/${removeEmailTrail(followedUser.email)}`
      );
    }

    return followedUser;
  } catch (error: any) {
    console.log(error);
    throw new Error("Internal server error", error);
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unfollowedUser = await unfollowUser(id);

    revalidatePath(RootPath.Home);

    if (unfollowedUser) {
      revalidatePath(
        `${RootPath.Profile}/${removeEmailTrail(unfollowedUser.email)}`
      );
    }

    return unfollowedUser;
  } catch (error: any) {
    console.log(error);
    throw new Error("Internal server error", error);
  }
};
