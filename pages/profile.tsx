import { Button, Container } from "@mantine/core";
import cookie from "cookie";
import { Fragment } from "react";
import axios from "axios";

import { useUser } from "../context/user";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const { logout, user, isLoading } = useUser();

  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  return (
    <Container>
      {!isLoading && (
        <Fragment>
          {user?.is_subscribed
            ? `Subscribed: ${user.interval}`
            : "Not Subscribed"}
          <Button mt={10} onClick={loadPortal}>
            Manage Subscription
          </Button>
        </Fragment>
      )}

      <Button onClick={() => logout()}>Logout</Button>
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
