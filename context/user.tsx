import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const Context = createContext<{
  user: any | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

const Provider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getUserFromSession = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) return data.user;
    return null;
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.reload();
  };

  const getUserProfileInfo = async () => {
    const sessionUser = await getUserFromSession();

    if (sessionUser) {
      const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      setUser({
        ...sessionUser,
        ...profile,
      });
    }
  };

  useEffect(() => {
    const makeCall = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      axios.post("/api/set-supabase-cookie", {
        event: user ? "SIGNED_IN" : "SIGNED_OUT",
        session,
      });
    };

    if (user) {
      const channel = supabase
        .channel("public:profile")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profile",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            // console.log("Change received!", payload);
            setUser({ ...user, ...payload.new });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    makeCall();
  }, [user]);

  useEffect(() => {
    getUserProfileInfo().then(() => setIsLoading(false));

    supabase.auth.onAuthStateChange(async () => {
      getUserProfileInfo().then(() => setIsLoading(false));
    });
  }, []);

  const exposed = {
    user,
    login,
    logout,
    isLoading,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
