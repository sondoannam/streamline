import { Tables } from './supabase';

export interface LoginDto {
  email: string;
  password: string;
}

export type UserWithStream = Tables<'users'> & { stream: Tables<'stream'> | null };
