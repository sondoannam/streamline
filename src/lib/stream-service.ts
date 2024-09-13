import { createClient } from '@/utils/supabase/server';

export const getStreamByUserId = async (userId: string) => {
  const supabase = createClient();

  const { data: stream } = await supabase.from('stream').select('*').eq('user_id', userId).single();

  return stream;
};

export const uploadStreamThumbnail = async (userId: string, file: File) => {
  const supabase = createClient();

  const name = userId + '-' + file.name.split('.')[0];

  const { data, error } = await supabase.storage
    .from('Stream')
    .upload(`thumbnail/${name}`, file, {
      upsert: true,
    });

  if (error || !data) {
    console.log('Failed to upload thumbnail', error);
    throw new Error('Failed to upload thumbnail');
  }

  return data;
};
