import { useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export type TypedSupabaseClient = SupabaseClient<Database>;
let client: TypedSupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }
  
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

function useSupabaseClient() {
  return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseClient;
