import { Container, Title, Text } from "@mantine/core";

export default function SuccessPayment() {
  return (
    <Container size="xs" mt={100}>
      <Title color={"green"} align="center">
        Your payment is success. You are now a premium user
      </Title>
      <Text align="center" mt={8}>
        {" "}
        Head over to article to see the premium video
      </Text>
    </Container>
  );
}
