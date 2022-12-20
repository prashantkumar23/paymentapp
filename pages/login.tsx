import { useEffect } from "react";
import { Button, Container, Text } from "@mantine/core";
import { useUser } from "../context/user";

export default function Login() {
  const { login } = useUser();

  return (
    <Container>
      <Button onClick={() => login()}>Login</Button>
    </Container>
  );
}
