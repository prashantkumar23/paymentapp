import { Button, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Container>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}
