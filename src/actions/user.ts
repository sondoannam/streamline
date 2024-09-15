"use server";

import { RootPath } from '@/constants/enum';
import { getSelf } from '@/lib/auth-service';
import { Tables } from '@/types/supabase';
import { removeEmailTrail } from '@/utils';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const updateUser = async (values: Partial<Tables<'users'>>) => {
  const self = await getSelf();
  const supabase = createClient();

  const validData = {
    bio: values.bio,
  };

  const { data, error } = await supabase
    .from('users')
    .update({ ...validData })
    .eq('id', self.id)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update user');
  }

  revalidatePath(`${RootPath.Profile}/${removeEmailTrail(self.email)}`);
  revalidatePath(`${removeEmailTrail(self.email)}`);

  return data;
};
