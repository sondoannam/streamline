'use server';

import { Tables } from '@/types/supabase';

import { getSelf } from '@/lib/auth-service';
import { getStreamByUserId, uploadStreamThumbnail } from '@/lib/stream-service';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { RootPath } from '@/constants/enum';
import { removeEmailTrail } from '@/utils';

export const updateStream = async (values: Partial<Tables<'stream'>>, extraData?: FormData) => {
  try {
    const supabase = createClient();
    const self = await getSelf();
    const selfStream = await getStreamByUserId(self.id);

    if (!selfStream) {
      throw new Error('Stream not found');
    }

    let validData: Partial<Tables<'stream'>> = {
      name: values.name,
      is_chat_enabled: values.is_chat_enabled,
      is_chat_followers_only: values.is_chat_followers_only,
      is_chat_delayed: values.is_chat_delayed,
    };

    if (extraData) {
      const thumbnailFile = extraData.get('thumbnail');

      if (!thumbnailFile) {
        throw new Error('Invalid thumbnail image file');
      }

      console.log(thumbnailFile);

      const imgData = await uploadStreamThumbnail(self.id, thumbnailFile as File);

      console.log(imgData);

      const { data: newThumbnail } = supabase.storage.from('Stream').getPublicUrl(imgData.path);

      validData = {
        ...validData,
        thumbnail_url: newThumbnail.publicUrl,
      };
    }

    const { data: stream, error } = await supabase
      .from('stream')
      .update({
        ...validData,
      })
      .eq('id', selfStream.id)
      .select()
      .single();

    const email = removeEmailTrail(self.email);

    if (error || !stream) {
      throw new Error('Failed to update stream');
    }
    
    revalidatePath(`${RootPath.Profile}/${email}/chat`);
    revalidatePath(`${RootPath.Profile}/${email}`);
    revalidatePath(`/${email}`);

    return stream;
  } catch {
    throw new Error('Internal server error');
  }
};
