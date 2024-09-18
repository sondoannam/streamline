'use server';

import { revalidatePath } from 'next/cache';
import { RoomServiceClient } from 'livekit-server-sdk';

import { RootPath } from '@/constants/enum';
import { removeEmailTrail } from '@/utils';

import { getSelf } from '@/lib/auth-service';
import { blockUser, unblockUser } from '@/lib/block-service';

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export const onBlock = async (id: string) => {
  const self = await getSelf();

  let blockedUser;

  try {
    blockedUser = await blockUser(id);
  } catch {
    // This means user is a guest
  }

  try {
    await roomService.removeParticipant(self.id, id);
  } catch {
    // This means user is not in the room
  }

  revalidatePath(RootPath.Home);
  revalidatePath(`${RootPath.Profile}/${removeEmailTrail(self.email)}/community`);

  return blockedUser;
};

export const onUnblock = async (id: string) => {
  const unblockedUser = await unblockUser(id);

  revalidatePath(RootPath.Home);

  if (unblockedUser) {
    revalidatePath(`${RootPath.Profile}/${removeEmailTrail(unblockedUser.email)}`);
  }

  return unblockedUser;
};
