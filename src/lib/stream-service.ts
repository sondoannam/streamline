import { createClient } from "@/utils/supabase/server";

export const getStreamByUserId = async (userId: string) => {
  const supabase = createClient();

  const { data: stream } = await supabase
    .from("stream")
    .select("*")
    .eq("user_id", userId)
    .single();

  return stream;
};
