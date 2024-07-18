"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { LoginFormType, RegisterFormType } from "@/validators/auth.validate";
import { RootPath } from "@/constants/enum";

export async function login(formData: LoginFormType) {
  try {
    const supabase = createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.email,
      password: formData.password,
    };

    const res = await supabase.auth.signInWithPassword(data);
    console.log(res.error);

    return res;
  } catch (error) {
    throw new Error("Failed to login. Unhandle error");
  }
}

export async function signup(formData: RegisterFormType) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  //   const { error: createUserProfileError } = await supabase
  //   .from('users')
  //   .insert([
  //     {
  //         email: formData.email,
  //         first_name: formData.firstName,
  //         last_name: formData.lastName,

  //     },
  //   ])
  //   .select();

  //   if (createUserProfileError) {
  //     redirect("/error");
  //   }

  console.log(error);

  revalidatePath("/", "layout");
  redirect(RootPath.Login);
}
