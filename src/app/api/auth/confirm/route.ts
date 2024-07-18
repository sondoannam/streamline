import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const { data: publicAvatarUrl } = supabase.storage
        .from("public_contents")
        .getPublicUrl("/spooky.svg");

      const { error: createUserProfileError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user?.id as string,
            email: data.user?.email as string,
            avatarUrl: data.user?.app_metadata?.avatar_url ?? publicAvatarUrl,
          },
        ]);

      if (createUserProfileError) {
        redirect("/error");
      }

      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
