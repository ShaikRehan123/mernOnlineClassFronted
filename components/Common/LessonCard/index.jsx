import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const LessonCard = ({ lesson }) => {
  const name = lesson.name;
  const description = lesson.description;
  const created_at = dayjs(lesson.created_at).format("MMM D, YYYY h:mm A");
  const updated_at = dayjs(lesson.updated_at).format("MMM D, YYYY h:mm A");
  const video_link = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/upload/course_videos/${lesson.course_id}/${lesson.video_link}`;
  const is_active = lesson.is_active;
  const lesson_id = lesson._id;
  const course_id = lesson.course_id;

  console.table({
    name,
    description,
    created_at,
    updated_at,
    video_link,
    is_active,
  });

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const deleteLesson = async () => {
    console.log("delete");
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/lessons/delete/${lesson_id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (res.data.status == "success") {
        toast.success(res.data.message || "Lesson deleted");
        refreshData();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const toggleActive = async () => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/lessons/toggleActive/${lesson_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (res.data.status == "success") {
        toast.success(res.data.message || "Lesson updated");
        refreshData();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <Container
      maxW="container.xl"
      centerContent
      p={4}
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
    >
      <Heading
        as="h3"
        size="lg"
        my={4}
        color={useColorModeValue("gray.800", "white")}
      >
        {name}
      </Heading>
      <Text color={useColorModeValue("gray.600", "gray.400")} mb={4}>
        {description}
      </Text>
      <Box
        as="video"
        w="100%"
        h="100%"
        controls
        src={video_link}
        type="video/mp4"
        borderRadius="lg"
      />
      {/* delete and toggle active button */}
      <Box mt={4}>
        <Text color={useColorModeValue("gray.600", "gray.400")}>
          Created at: {created_at}
        </Text>
        <Text color={useColorModeValue("gray.600", "gray.400")}>
          Updated at: {updated_at}
        </Text>
      </Box>
      <Box mt={4}>
        <Button colorScheme="red" mr={4} onClick={deleteLesson}>
          Delete
        </Button>
        <Button
          colorScheme={is_active ? "yellow" : "green"}
          onClick={toggleActive}
        >
          {is_active ? "Deactivate" : "Activate"}
        </Button>
      </Box>
    </Container>
  );
};

export default LessonCard;
