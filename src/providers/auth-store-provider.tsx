"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStore } from "zustand";

import {
  type CurrentUserStore,
  createCurrentUserStore,
} from "@/store/current-user-store";
import useSupabaseClient from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
  const supabase = useSupabaseClient();
  const { refresh } = useRouter();

  const [session, setSession] = useState<Session | null>(null);

  if (!store.current) {
    store.current = createCurrentUserStore();
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
      refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session) {
        store.current.setState({ user: null });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user", error);
        return;
      }

      store.current.setState({ user: data });
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
