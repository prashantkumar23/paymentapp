import { Avatar, Button, Container, Stack, Text } from "@mantine/core";
import cookie from "cookie";
import axios from "axios";

import { useUser } from "../context/user";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const { logout, user, isLoading } = useUser();
  console.log("User", user);

  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  return (
    <Container size={"xs"}>
      {!isLoading && (
        <Stack spacing={5}>
          <Avatar size={50} src={user.user_metadata.avatar_url} radius={"lg"} />
          <Text>{user.user_metadata.name}</Text>
          <Text>{user.email}</Text>
          <Text fs={"italic"}>
            {user?.is_subscribed
              ? `Subscribed: ${user.interval}`
              : "Not Subscribed"}
          </Text>
          <Button
            mt={10}
            onClick={loadPortal}
            size="xs"
            sx={{ width: "max-content" }}
          >
            Manage Subscription
          </Button>
        </Stack>
      )}

      <Button onClick={() => logout()} size="xs" mt={30}>
        Logout
      </Button>
    </Container>
  );
}

export const getServerSideProps = async ({ req }: any) => {
  let token =
    req.headers.cookie &&
    cookie.parse(req.headers.cookie)["supabase-auth-token"];

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  token = JSON.parse(token as string)[0]; //jwt

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
