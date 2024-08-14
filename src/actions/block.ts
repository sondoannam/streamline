"use server";

import { revalidatePath } from "next/cache";

import { RootPath } from "@/constants/enum";
import { blockUser, unblockUser } from "@/lib/block-service";
import { removeEmailTrail } from "@/utils";

export const onBlock = async (id: string) => {
    const blockedUser = await blockUser(id);

    revalidatePath(RootPath.Home);

    if (blockedUser) {
        revalidatePath(`${RootPath.Profile}/${removeEmailTrail(blockedUser.email)}`);
    }

    return blockedUser;
}

export const onUnblock = async (id: string) => {
    const unblockedUser = await unblockUser(id);

    revalidatePath(RootPath.Home);

    if (unblockedUser) {
        revalidatePath(`${RootPath.Profile}/${removeEmailTrail(unblockedUser.email)}`);
    }

    return unblockedUser;
}