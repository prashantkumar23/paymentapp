import { useEffect } from "react";
import { Text } from "@mantine/core";
import { supabase } from "../utils/supabase";

export default function Login() {
  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }, []);

  return <Text>Login Page</Text>;
}
