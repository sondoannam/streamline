import { Tables } from '@/types/supabase';
import { createStore } from 'zustand';

export type CurrentUserState = {
    user: Tables<'users'> | null;
}

export type CurrentUserActions = {
    setUser: (user: Tables<'users'> | null) => void;
};

export const defaultCurrentUserState: CurrentUserState = {
    user: null,
};

export type CurrentUserStore = CurrentUserState & CurrentUserActions;

export const createCurrentUserStore = (initState: CurrentUserState = defaultCurrentUserState) => {
    return createStore<CurrentUserStore>()((set) => ({
        ...initState,
        setUser: (user) => set(() => ({ user })),
    }))
}