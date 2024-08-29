"use server";

import { Tables } from "@/types/supabase";

import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { RootPath } from "@/constants/enum";
import { removeEmailTrail } from "@/utils";

export const updateStream = async (values: Partial<Tables<"stream">>) => {
  try {
    const supabase = createClient();
    const self = await getSelf();
    const selfStream = await getStreamByUserId(self.id);

    if (!selfStream) {
      throw new Error("Stream not found");
    }

    const validData = {
      name: values.name,
      is_chat_enabled: values.is_chat_enabled,
      is_chat_followers_only: values.is_chat_followers_only,
      is_chat_delayed: values.is_chat_delayed,
    };

    const { data: stream } = await supabase
      .from("stream")
      .update({
        ...validData,
      })
      .eq("id", selfStream.id)
      .select()
      .single();

    const email = removeEmailTrail(self.email);

    revalidatePath(`${RootPath.Profile}/${email}/chat`);
    revalidatePath(`${RootPath.Profile}/${email}`);
    revalidatePath(`/${email}`);

    return stream;
  } catch {
    throw new Error("Internal server error");
  }
};
