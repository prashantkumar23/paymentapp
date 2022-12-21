import { useState, useEffect } from "react";
import { Container, Text, Title, Center } from "@mantine/core";
import Player from "react-player";
import { supabase } from "../utils/supabase";
import Link from "next/link";

export default function LessonDetails({ lesson }: any) {
  const [premiumContent, setPremiumContent] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from("premium_content")
      .select("*")
      .eq("id", lesson.id)
      .single();
    setPremiumContent(data);
  };

  useEffect(() => {
    getPremiumContent().then(() => setIsLoading(false));
  }, []);

  // console.log(premiumContent);

  return (
    <Container size={"md"}>
      <Title align="center">{lesson.title}</Title>
      {!isLoading && (
        <Text color={"dimmed"} fs="italic" mt={10} size={12} align="center">
          {!premiumContent &&
            `This article associate a premium video to subscribed user. Please subscribed to view`}
        </Text>
      )}

      {premiumContent && (
        <Center>
          {/* @ts-ignore */}
          <Player url={premiumContent.video_url} controls />{" "}
        </Center>
      )}

      <Text align="justify" mt={20} mb={20}>
        {lesson.description}
      </Text>
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
