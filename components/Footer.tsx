import { Center, Container, Text } from "@mantine/core";

export default function Footer() {
  return (
    <Container size={"xs"} style={{ position: "absolute", bottom: 10 }}>
      <Center>
        <Text>Made by Prashant Kumar</Text>
        <Text color={"dimmed"} fs="italic">
          Built using NextJS, Supabase and Stripe
        </Text>
      </Center>
    </Container>
  );
}
