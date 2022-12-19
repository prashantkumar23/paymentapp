import { Card, Container, Grid, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";

// 4242424242424242
// 4000000000009995
// 4000002500003155

export default function Home({ lessons }: any) {
  useEffect(() => {
    const getUserFromSupabase = async () => {
      const user = await supabase.auth.getUser();
      console.log("User", user);
    };

    getUserFromSupabase();
  }, []);

  return (
    <Container size={"md"} mt={50}>
      <Grid>
        {lessons.map(({ id, title, description }: any) => (
          <Grid.Col key={id} span={4}>
            <Link href={`/${id}`} style={{ textDecoration: "none" }}>
              <Card>
                <Stack>
                  <Text weight={500}>{title}</Text>
                  <Text>{description}</Text>
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
