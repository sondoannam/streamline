"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useStore } from "zustand";

import {
  type CurrentUserStore,
  createCurrentUserStore,
} from "@/store/current-user-store";
import useSupabaseClient from "@/utils/supabase/client";

export type CurrentUserStoreApi = ReturnType<typeof createCurrentUserStore>;

export const CurrentUserContext = createContext<
  CurrentUserStoreApi | undefined
>(undefined);

export interface CurrentUserStoreProviderProps {
  children: ReactNode;
}

export const CurrentUserStoreProvider = ({
  children,
}: CurrentUserStoreProviderProps) => {
  const store = useRef(createCurrentUserStore());
  if (!store.current) {
    store.current = createCurrentUserStore();
  }
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchUser = async () => {
      if (!store.current.getState().user) {
        // fetch user
        const {
          data: { user: self },
        } = await supabase.auth.getUser();

        if (self) {
          const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("id", self.id)
            .single();

          if (user) {
            store.current.getState().setUser(user);
          }
        }
      }
    };

    fetchUser();
  }, []);


  return (
    <CurrentUserContext.Provider value={store.current}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserStore = <T,>(
  selector: (store: CurrentUserStore) => T
): T => {
  const store = useContext(CurrentUserContext);
  if (!store) {
    throw new Error(
      "useCurrentUserStore must be used within a CurrentUserStoreProvider"
    );
  }

  return useStore(store, selector);
};
