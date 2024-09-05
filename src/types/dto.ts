import { Tables } from './supabase';

export interface LoginDto {
  email: string;
  password: string;
}

export type UserWithStreamStatus = Tables<'users'> & { stream: { is_live: boolean } | null };
