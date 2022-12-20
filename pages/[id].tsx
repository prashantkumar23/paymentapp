import { useState, useEffect } from "react";
import { Container, Text, Title } from "@mantine/core";
import Player from "react-player";
import { supabase } from "../utils/supabase";

export default function LessonDetails({ lesson }: any) {
  const [premiumContent, setPremiumContent] = useState(undefined);

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from("premium_content")
      .select("*")
      .eq("id", lesson.id)
      .single();
    setPremiumContent(data);
  };

  useEffect(() => {
    getPremiumContent();
  }, []);

  // console.log(premiumContent);

  return (
    <Container size={"md"}>
      <Title>{lesson.title}</Title>
      <Text>{lesson.description}</Text>
      {/* @ts-ignore */}
      {premiumContent && <Player url={premiumContent.video_url} />}
    </Container>
  );
}

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lessons").select("id");

  const paths = lessons?.map(({ id }) => {
    return {
      params: {
        id: id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }: any) => {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};
