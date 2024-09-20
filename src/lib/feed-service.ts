import { createClient } from '@/utils/supabase/server';
import { StreamDto } from '@/types/dto';

import { getSelf } from './auth-service';

export const getStreams = async () => {
  const supabase = createClient();

  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let streams: StreamDto[] = [];

  if (userId) {
    let arrayString = '()';

    const { data: blockingUsers } = await supabase
      .from('block')
      .select('blocker_id')
      .eq('blocked_id', userId);

    if (blockingUsers) {
      arrayString = `(${blockingUsers.map((user) => user.blocker_id).join(',')})`;
    }

    const { data } = await supabase
      .from('stream')
      .select('id, thumbnail_url, name, is_live, users(*)')
      .not('user_id', 'in', arrayString)
      .order('is_live', { ascending: false })
      .order('updated_at', { ascending: false });

    if (data) {
      streams = data;
    }
  } else {
    const { data } = await supabase
      .from('stream')
      .select('id, thumbnail_url, name, is_live, users(*)')
      .order('is_live', { ascending: false })
      .order('updated_at', { ascending: false });

    if (data) {
      streams = data;
    }
  }

  return streams;
};
