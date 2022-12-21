import { Card, Container, Grid, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "../context/user";
import { supabase } from "../utils/supabase";

// 4242424242424242
// 4000000000009995
// 4000002500003155

export default function Home({ lessons }: any) {
  const { user } = useUser();

  // console.log("User", user);

  return (
    <Container size={"md"} mt={50}>
      <Grid>
        {lessons.map(({ id, title }: any) => (
          <Grid.Col key={id} xs={12} sm={6} md={3}>
            <Link href={`/${id}`} style={{ textDecoration: "none" }}>
              <Card withBorder radius={"sm"}>
                <Stack>
                  <Text weight={500}>{title}</Text>
                </Stack>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lessons").select("*");

  return {
    props: {
      lessons,
    },
  };
};
