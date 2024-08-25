import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { removeEmailTrail } from "@/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      // create user profile in the database by trigger function instead of here
      /* const { data: publicavatar_url } = supabase.storage
        .from("public_contents")
        .getPublicUrl("/spooky.svg");

      const { error: createUserProfileError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user?.id as string,
            email: data.user?.email as string,
            avatar_url: data.user?.app_metadata?.avatar_url ?? publicavatar_url.publicUrl,
          },
        ]);

      if (createUserProfileError) {
        redirect("/error");
      } */

      // maybe use supabase trigger instead of here
      const { error: createUserStreamError } = await supabase
        .from("stream")
        .insert({
          name: `${removeEmailTrail(data.user.email!)}'s stream`,
          user_id: data.user.id,
        });

      if (createUserStreamError) {
        redirect("/error");
      }

      // redirect user to specified redirect URL or root of app
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // redirect the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
