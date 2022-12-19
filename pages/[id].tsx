import { Container, Text, Title } from "@mantine/core";
import { supabase } from "../utils/supabase";

export default function LessonDetails({ lesson }: any) {
  console.log(lesson);

  return (
    <Container size={"md"}>
      <Title>{lesson.title}</Title>
      <Text>{lesson.description}</Text>
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
