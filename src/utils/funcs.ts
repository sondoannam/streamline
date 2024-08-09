import { Tables } from "@/types/supabase";

export const getUserName = (user: Tables<"users">) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.email;
};

export const removeEmailTrail = (email: string) => {
  return email.split("@")[0];
};
